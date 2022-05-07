import { React, useState, useEffect } from '../../libraries'
import { debounce } from 'lodash'
import { connect } from 'react-redux'
import { Api } from '../../helpers/api'
import { TriggerUpdate, FilterHospitals, FilterSpesialist, FilterPrice } from '../../modules/actions'
import { ButtonDarkGrey } from '../atoms'
import { FilterDoctorSpesialist, ScheduleSpesialist, LoadingComponent, EmptyData } from '../molecules'
import {
  // DoctorProfile,
  // SmallLogo,
  ChevronLeft,
  MagnifierIcon,
  FilterIcon,
} from '../../assets/images'

const DoctorSpesialistList = (props) => {
  const {
    TriggerUpdate,
    TriggerReducer,
    withoutHeightHeader,
    FilterSpesialistReducer,
    FilterHospitalsReducer,
    FilterPriceReducer,
    // FilterHospitals,
    // FilterSpesialist,
    // FilterPrice,
    counterCloseFromOrderedDoctorSpesialistList,
    disabledFromOrdered,
    disableButtonBackLeft,
    sectionHeight = null,
    isFromMissedCall = false
  } = props;

  const padding = window.location.pathname.includes("call") ? "pb-20" : "pb-10";
  const [heightContent, setHeightContent] = useState(0)
  const [frameFilterScheduling, setframeFilterScheduling] = useState(false)
  const [frameFilter, setFrameFilter] = useState(false)
  const [maxLoad, setMaxLoad] = useState(true);
  const [listDoctor, setListDoctor] = useState([])
  const [doctorSelect, setDoctorSelect] = useState("")
  const [loading, setLoading] = useState(false);
  const [filterParam, setFilterParam] = useState({
    _limit: 5,
    _start: 0,
    _q: "",
    specialist: [],
    hospitals: [],
    price: []
  })

  useEffect(() => {
    if(sectionHeight){
      let headerListDoctor = document.getElementById("header-list-doctor").clientHeight;
      setHeightContent(parseInt(sectionHeight) - parseInt(headerListDoctor));
    }
  }, [sectionHeight])

  const handleCounterFilterDoctor = () => {

    if (FilterSpesialistReducer.length > 0) {
      setFilterParam({...filterParam, specialist: FilterSpesialistReducer, _start: 0 })
    }

    if (FilterHospitalsReducer.length > 0) {
      setFilterParam({...filterParam, hospitals: FilterHospitalsReducer, _start: 0 })
    }

    if (FilterPriceReducer.length > 0) {
      setFilterParam({...filterParam, price: FilterPriceReducer, _start: 0 })
    }

    if(FilterSpesialistReducer.length < 1 && FilterHospitalsReducer.length < 1 && FilterPriceReducer.length < 1){
      setFilterParam({
        ...filterParam,
        specialist: [],
        hospitals: [],
        price: [],
        _start: 0
      })
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   if(filterParam._start < 1){
  //     setListDoctor([]);
  //   }
  //   loadLisDoctor();
  // }, [filterParam]);

  const getUnique = (array) => {
      var uniqueArray = [];
      for(var value of array){
          if(uniqueArray.indexOf(value) === -1){
              uniqueArray.push(value);
          }
      }
      return uniqueArray;
    }

  const loadLisDoctor = async () => {
    if(filterParam._start < 1) setLoading(true);
    const params = {}
    // const query = (
    //   filterParam.specialist && filterParam.specialist.length > 0
    //   && filterParam.hospitals && filterParam.hospitals.length > 0
    //   && filterParam.price && filterParam.price.length > 0
    // ) ? '?' : '&';

    if (filterParam._q !== "") params._q = filterParam._q;
    if (filterParam._q === "") params._limit = filterParam._limit;
    if (filterParam._q === "") params._start = filterParam._start;

    let specialist = [];
    let specialistUrlParam = "";
    if (filterParam.specialist && filterParam.specialist.length > 0) {
      filterParam.specialist.forEach((item, i) => {
        specialist.push(`&specialis.id_in=${item.specialization_id}`)
      });
      specialist = getUnique(specialist)
      specialistUrlParam = specialist.join('');
    }

    let hospitals = [];
    let hospitalsUrlParam = "";
    if (filterParam.hospitals && filterParam.hospitals.length > 0) {
      filterParam.hospitals.forEach((item, i) => {
        hospitals.push(`&hospital.id_in=${item.hospital_id}`)
      });
      hospitals = getUnique(hospitals)
      hospitalsUrlParam = hospitals.join('');
    }

    let price = [];
    let priceUrlParam = "";
    if (filterParam.price && filterParam.price.length > 0) {
      filterParam.price.forEach((item, i) => {
        if(item.type === "min") price.push(`&price_lt=${item.value}`);
        if(item.type === "middle"){
          let priceValueSplit = item.value.split(",")
          price.push(`&price_lte=${priceValueSplit[1]}`);
          price.push(`&price_gte=${priceValueSplit[0]}`);
        }
        if(item.type === "max") price.push(`&price_gt=${item.value}`);
      });
      price = getUnique(price)
      priceUrlParam = price.join('');
    }

    Api.get(`/data/doctors?_sort=name:ASC${specialistUrlParam}${hospitalsUrlParam}${priceUrlParam}`, {
      params: params
    }).then(doctors => {
      if(params._start > 0) setListDoctor(prevArray => [...prevArray, ...doctors.data.data]);
      else {
        setMaxLoad(true);
        setListDoctor(doctors.data.data);
      }

      setLoading(false)
    }).catch(error => {
      if(params._start < 1) setListDoctor([]);
      if(params._start > 1) setMaxLoad(false);
      setLoading(false);
    });
  }

  const handleClickSectionChange = () => {
    setFrameFilter(!frameFilter)
  }

  // const handleClickSectionBack = () => {
  //   TriggerUpdate({ closeDoctorSpesialistList: true })
  //   FilterSpesialist([])
  //   FilterHospitals([])
  //   FilterPrice([])
  // }

  const handleCounterButtonDarkGray = (value) => {
    setDoctorSelect(value)
    setframeFilterScheduling(true)
  }

  const handleLoadMore = () => {
    setFilterParam({
      ...filterParam,
      _q: "",
      _start: filterParam._start + 5
    })
  }

  const handleChangeSearch = debounce((event) => {
    setListDoctor([])
    setFilterParam({
      ...filterParam,
      _q: event.target.value.length ? event.target.value : '',
      _limit: 5,
      _start: 0
    })
  }, 700)

  useEffect(() => {
    loadLisDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParam])

  useEffect(() => {
    if(TriggerReducer && TriggerReducer.closeFilterSpesialist){
      setFrameFilter(false)
      TriggerUpdate(null)
    }

    if(TriggerReducer !== null && TriggerReducer.closeSpesialistListOrdered){
      setframeFilterScheduling(false);
      counterCloseFromOrderedDoctorSpesialistList();
      TriggerUpdate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer])

  return (
    <div style={{ height: `${sectionHeight ? sectionHeight : "auto"}` }} className={`flex flex-wrap content-start absolute z-10 top-0 left-0 bg-white w-full h-full`}>
      <div id="header-list-doctor" className="w-full flex flex-wrap items-center px-2">
        <div className="pt-16 pb-4"></div>
          {!disableButtonBackLeft ?
            <div className="w-1/12 flex justify-center">
              <img
                src={ChevronLeft}
                alt="Chevron Left"
                className="w-2 cursor-pointer"
                onClick={() => counterCloseFromOrderedDoctorSpesialistList !== "" ? counterCloseFromOrderedDoctorSpesialistList() : {}}
              />
            </div>
          : ""}
        <div className={`${!disableButtonBackLeft ? "w-10/12" : "w-11/12"} px-2`}>
          <div className="relative w-full">
            <button className="absolute z-10 left-0 inset-y-0 ml-4 focus:outline-none">
              <img src={MagnifierIcon} alt="Magnifier Icon" className="w-4" />
            </button>
            <input type="text" onChange={handleChangeSearch} className="w-full py-1 pl-10 pr-3 rounded-full focus:outline-none" style={{ backgroundColor: "#F2F2F5" }} />
          </div>
        </div>
        <div className="w-1/12 flex justify-center">
          <img src={FilterIcon} alt="Filter Icon" className="cursor-pointer" onClick={() => handleClickSectionChange()} />
        </div>
      </div>
      <div className={`w-full px-2 scroll-small ${frameFilter || frameFilterScheduling ? "overflow-y-hidden" : "overflow-y-auto"}`} style={{ height: `${heightContent !== 0 ? heightContent+"px" : "auto"}` }}>
        {listDoctor.length > 0 ?
          <>
            {listDoctor.map((res, idx) => {
              return (
                <div key={idx} className={`w-full flex flex-wrap items-start my-3 ${isFromMissedCall ? "px-2" : "xl:px-5 px-2"}`}>
                  <div className="w-full flex flex-wrap items-start rounded shadow p-3">
                    <div className="w-1/6 h-20 bg-gray-300 rounded-sm">
                      {res.photo ?
                        <img
                          src={ res.photo.formats.small }
                          alt="Doctor Profile"
                          className="object-cover w-full h-full rounded-sm"
                        />
                      : ""}
                    </div>
                    <div className={`w-5/6 ${isFromMissedCall ? "pl-3" : "pl-5"}`}>
                      <div className="text-xs mb-1">
                        {res.hospital && res.hospital.length > 0 ?
                          <>
                            <img src={res.hospital[0].icon ? res.hospital[0].icon.url : ""} alt="Small Logo" className="inline mr-2 w-8" />
                            <span>{res.hospital[0].name}</span>
                          </>
                        : ""}
                      </div>
                      <p className={`font-bold mb-1 ${isFromMissedCall ? "text-sm" : "text-base"}`}>{res.name}</p>
                      <p className="mb-1 flex flex-wrap items-center">
                        <span className={`mr-auto text-dark2 text-xs ${isFromMissedCall ? "inline-block w-full mb-2" : ""}`}>
                          {res.experience}
                        </span>
                        <span className="ml-auto text-sm font-bold text-info2">{ res.price ? res.price.formatted : "" }</span>
                      </p>
                    </div>
                    <div className="w-full flex flex-row items-center mt-4">
                      <span className={`flex-1 font-bold text-info2 pr-1 ${isFromMissedCall ? "text-xs" : "text-sm"}`}>Sp. {res.specialization ? res.specialization.name : ""}</span>
                      <span className="ml-auto pl-1">
                        <ButtonDarkGrey
                          text="Pilih Jadwal"
                          value={res.doctor_id}
                          counter={(value) => handleCounterButtonDarkGray(value)}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            {filterParam._q === "" && maxLoad ?
              <div className={`w-full flex justify-center my-3 ${padding}`}>
                <button className="text-mainColor" onClick={handleLoadMore}>Tampilkan lebih</button>
              </div>
            : ""}
          </>
        : ""}
        {!loading && listDoctor.length < 1 ?
          <div className="absolute w-full h-full flex flex-wrap justify-center items-center">
            <EmptyData text="Doctor tidak ditemukan!" />
          </div>
        : ""}
        {loading ?
          <div className="absolute w-full h-full flex flex-wrap justify-center items-center">
            <LoadingComponent />
          </div>
        : ""}
        {frameFilter ?
          <FilterDoctorSpesialist
            withoutHeightHeader={withoutHeightHeader}
            counter={() => handleCounterFilterDoctor()}
          />
        : ""}
        {frameFilterScheduling ?
          <ScheduleSpesialist
            disabledFromOrdered={disabledFromOrdered}
            isUpdateSpesialist={true}
            counterClose={() => setframeFilterScheduling(false)}
            doctorSelect={doctorSelect}
            withoutHeightHeader={withoutHeightHeader}
          />
        : ""}
      </div>
    </div>
  )
}

DoctorSpesialistList.defaultProps = {
  withoutHeightHeader: false,
  counterCloseFromOrderedDoctorSpesialistList: "",
  disabledFromOrdered: false,
  disableButtonBackLeft: false
}

const mapStateToProps = (state) => ({
  TriggerReducer: state.TriggerReducer.data,
  FilterSpesialistReducer: state.FilterSpesialistReducer.data,
  FilterHospitalsReducer: state.FilterHospitalsReducer.data,
  FilterPriceReducer: state.FilterPriceReducer.data
})

const mapDispatchToProps = {
  TriggerUpdate,
  FilterHospitals,
  FilterSpesialist,
  FilterPrice
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSpesialistList)
