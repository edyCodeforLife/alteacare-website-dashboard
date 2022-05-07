import moment from 'moment'
import { dayFormat } from '../../../helpers/dateFormat'
import { React, useState, useEffect } from '../../../libraries'
import { LabelDefault, LabelTitle } from '../../atoms'
import { LocalStorage } from '../../../helpers/localStorage'
import { Api } from '../../../helpers/api'
import { LoadingComponent, EmptyData } from '../../molecules'
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector'

const AppointmentList = ({ data, counter, type, sectionFirstHeight, keyword, loadList, filter, dateNow = false }) => {
  const { TriggerReducer } = useShallowEqualSelector((state) => state);
  // const [totalList, setTotalList] = useState(0);
  // const [loadMore, setLoadMore] = useState(false);
  // const [loadingData, setLoadingData] = useState(false);
  const [active, setActive] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  const [AppointmentData, setAppointmentData] = useState([]);

  const [paramAppointment, setParamAppointment] = useState({
    sort_by: "id",
    sort_type: "DESC",
    doctor_id: "",
    user_id: "",
    consultation_method: "",
    hospital_id: "",
    specialist_id: "",
    hospital_ids: [],
    specialist_ids: [],
    status: ["PAID", "ON_GOING", "WAITING_FOR_MEDICAL_RESUME", "MEET_SPECIALIST"],
    page: 1,
    keyword: '',
  });

  useEffect(() => {
    createAppointmentData(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(TriggerReducer.data && TriggerReducer.data.refreshListAppointment){
      setRefreshData(true);
    }
  }, [TriggerReducer.data])

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if(refreshData){
      let AppointmentDataUpdate = [...AppointmentData];
      let module = ''
      if(type === "not-done"){
        module = '/appointment/v1/consultation/ongoing';
        AppointmentData.forEach((item, idx) => {
          let paramAppointmentUpdate = {...paramAppointment};

          AppointmentDataUpdate[idx].loading = true;

          paramAppointmentUpdate.status = ["PAID", "ON_GOING", "WAITING_FOR_MEDICAL_RESUME", "MEET_SPECIALIST"];
          paramAppointmentUpdate.schedule_date_start = item.date;
          paramAppointmentUpdate.schedule_date_end = item.date;
          paramAppointmentUpdate.page = 1;
          getAppointmentLis(module, idx, paramAppointmentUpdate);
        });
      } else if(type === "done") {
        let paramAppointmentUpdate = {...paramAppointment};

        AppointmentDataUpdate[0].loading = true;

        paramAppointmentUpdate.status = ["COMPLETED"];
        paramAppointmentUpdate.schedule_date_start = AppointmentDataUpdate[0].date;
        paramAppointmentUpdate.schedule_date_end = AppointmentDataUpdate[0].date;
        paramAppointmentUpdate.page = 1;
        module = '/appointment/v1/consultation/history';
        getAppointmentLis(module, 0, paramAppointmentUpdate);
      } else if(type === "cancel") {
        let paramAppointmentUpdate = {...paramAppointment};

        AppointmentDataUpdate[0].loading = true;

        paramAppointmentUpdate.status = ["REFUNDED"];
        paramAppointmentUpdate.canceled_date_start = AppointmentDataUpdate[0].date;
        paramAppointmentUpdate.canceled_date_end = AppointmentDataUpdate[0].date;
        paramAppointmentUpdate.page = 1;
        module = '/appointment/v1/consultation/canceled';
        getAppointmentLis(module, 0, paramAppointmentUpdate);
      }

      // set loading
      setAppointmentData(AppointmentDataUpdate);

      setRefreshData(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]);

  const getAppointmentLis = (module, index, paramAppointment, isPaggination = false) => {
    setParamAppointment(paramAppointment);
    Api.post(`${module}`, paramAppointment,
      { headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` } }
    )
    .then(res => {
      let dataResponse = res.data;
      handleResponseDone(true, index, dataResponse, isPaggination);
    })
    .catch(function (){
      handleResponseDone(false, index, null, isPaggination);
    });
  }

  const handleResponseDone = (type, index, dataResponse, isPaggination) => {
    let AppointmentDataUpdate = [...AppointmentData];
    let listData = [];
    if(type){
      if(isPaggination){
        listData = [...AppointmentDataUpdate[index].data, ...dataResponse.data];
      } else {
        listData = dataResponse.data;
      }
    } else {
      if(isPaggination){
        listData = [...AppointmentDataUpdate[index].data];
      } else {
        listData = [];
      }
    }
    AppointmentDataUpdate[index].loading = false;
    AppointmentDataUpdate[index].data = listData;
    AppointmentDataUpdate[index].total = type ? dataResponse.meta.total : null;
    // console.log("AppointmentDataUpdate", AppointmentDataUpdate);
    setAppointmentData(AppointmentDataUpdate);
  }

  const createAppointmentData = (type, date = null) => {
    let AppointmentDataUpdate = []
    if(type === "done" || type === "cancel"){
      AppointmentDataUpdate = todayAppointmentData();
    } else if(type === 'not-done') {
      AppointmentDataUpdate = todayAndTomorrowAppointmentData();
    } else {
      AppointmentDataUpdate = searchAppointmentData(date);
    }
    setAppointmentData(AppointmentDataUpdate);
    setRefreshData(true);
  }

  const todayAndTomorrowAppointmentData = () => {
    const defaultAppointmentData = [
      {
        date : moment().add(0, 'days').format("YYYY-MM-DD"),
        text: "Hari Ini",
        data: [],
        loading: false,
        total: null,
        page: 1
      },
      {
        date : moment().add(1, 'days').format("YYYY-MM-DD"),
        text: "Besok",
        data: [],
        loading: false,
        total: null,
        page: 1
      }
    ];
    return defaultAppointmentData;
  }

  const todayAppointmentData = () => {
    const defaultAppointmentData = [
      {
        date : moment().add(0, 'days').format("YYYY-MM-DD"),
        text: "Hari Ini",
        data: [],
        loading: false,
        total: null,
        page: 1
      }
    ];
    return defaultAppointmentData;
  }

  const searchAppointmentData = (date) => {
    const dateFormat = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const defaultAppointmentData = [
      {
        date : moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        text: `Perjanjian Konsultasi ${dayFormat(moment(dateFormat).day())}, ${moment(dateFormat).format('DD MMM Y')}`,
        data: [],
        loading: false,
        total: null,
        page: 1
      }
    ];
    return defaultAppointmentData;
  }

  const handleFilter = () => {
    if(Object.keys(filter).length > 0){
      let filterSpesialist = []
      if(filter.specialist.length > 0){
        filter.specialist.forEach((res) => {
          filterSpesialist.push(res.specialization_id)
        })
      }

      let filterHospitals = []
      if(filter.hospitals.length > 0){
        filter.hospitals.forEach((res) => {
          filterHospitals.push(res.hospital_id)
        })
      }

      if(filter.specialist.length > 0 || filter.hospitals.length > 0){
        setParamAppointment({
          ...paramAppointment,
          hospital_ids: filterHospitals,
          specialist_ids: filterSpesialist
        });
        setRefreshData(true);
      } else {
        setParamAppointment({
          ...paramAppointment,
          hospital_ids: [],
          specialist_ids: []
        });
      }

      if(filter.date){
        createAppointmentData('', filter.date);
      } else {
        createAppointmentData(type);
      }
    }
  }

  const handleCounter = (value) => {
    setActive(value);
    counter(value)
  }

  const handleLoadMore = (index) => {
    let paramAppointmentUpdate = {...paramAppointment};
    let AppointmentDataUpdate = [...AppointmentData];
    let totalPage = AppointmentDataUpdate[index].page + 1;
    AppointmentDataUpdate[index].page = totalPage
    paramAppointmentUpdate.page = totalPage;
    setAppointmentData(AppointmentDataUpdate);
    let module = ''
    if(type === "not-done"){
      paramAppointmentUpdate.schedule_date_start = AppointmentDataUpdate[index].date;
      paramAppointmentUpdate.schedule_date_end = AppointmentDataUpdate[index].date;
      module = '/appointment/v1/consultation/ongoing';
    }
    if(type === "done"){
      paramAppointmentUpdate.schedule_date_start = AppointmentDataUpdate[index].date;
      paramAppointmentUpdate.schedule_date_end = AppointmentDataUpdate[index].date;
      module = '/appointment/v1/consultation/history';
    }
    if(type === "cancel"){
      paramAppointmentUpdate.canceled_date_start = AppointmentDataUpdate[index].date;
      paramAppointmentUpdate.canceled_date_end = AppointmentDataUpdate[index].date;
      module = '/appointment/v1/consultation/canceled';
    }

    getAppointmentLis(module, index, paramAppointmentUpdate, true);
  }

  useEffect(() => {
    setParamAppointment({...paramAppointment, keyword});
    setRefreshData(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  return (
    <>
      {AppointmentData.map((item, idx) => {
        return (
          <div key={idx}>
            <div>
              <LabelTitle text={item.text} />
              {item.data.length > 0 && !item.loading ?
                <>
                  {item.data.map((res, index) => {
                    return (
                      <button
                        key={index}
                        className="w-full flex flex-wrap items-center py-2 xl:px-4 px-2 border-b border-subtle text-dark2 cursor-pointer hover:bg-gray-200"
                        onClick={counter !== "" ? () => handleCounter(res.id) : () => {}}
                        style={{ backgroundColor: res.id === active ? 'rgba(229, 231, 235, 1)' : '' }}
                      >
                        <div className="w-3/12">
                          <p className="text-left text-sm font-bold text-dark2 truncate pr-2">{res.user.name}</p>
                        </div>
                        <div className="w-4/12">
                          <p className="text-left text-sm truncate pr-2">{res.doctor.name}</p>
                        </div>
                        <div className="w-2/12">
                          <p className="text-left text-sm pr-1">
                            {`${moment(res.schedule ? res.schedule.time_start : '', 'HH:mm').format('HH:mm')}-${moment(res.schedule ? res.schedule.time_end : '', 'HH:mm').format('HH:mm')}`}
                          </p>
                        </div>
                        <div className="w-3/12 flex items-center justify-end">
                          <LabelDefault
                            text={res.status_detail.label}
                            styleComponent={{ backgroundColor: `${res.status_detail.bg_color}`, color: `${res.status_detail.text_color}` }}
                            className={`py-2 xl:px-2 px-1 rounded-lg xl:text-sm text-xs w-full`}
                          />
                        </div>
                      </button>
                    )
                  })}
                  <div className="pb-5"></div>
                </>
              : ""}
            </div>
            {item.total && item.data.length < item.total ?
              <div className="w-full flex justify-center pb-5">
                <button
                  className="text-mainColor"
                    onClick={() => handleLoadMore(idx)}>Tampilkan lebih</button>
              </div>
            : ""}
            {!item.loading && item.data.length < 1 ?
              <div className="py-10">
                <EmptyData text="Tidak ada perjanjian disini" />
              </div>
            : ""}
            {item.loading ?
              <div className="py-10">
                <LoadingComponent />
              </div>
            : ""}
          </div>
        )
      })}
    </>
  )
}

AppointmentList.defaultProps = {
  data: [],
  counter: "",
  value: "",
  type: "",
  sectionFirstHeight: "",
  keyword: "",
  loadList: false,
  filter: {},
}

export default AppointmentList
