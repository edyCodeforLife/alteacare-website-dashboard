import moment from 'moment'
import { connect } from 'react-redux'
import { Api } from '../../../helpers/api'
import { LabelTitle, Appointment } from '../../atoms'
import { TriggerUpdate } from '../../../modules/actions'
import { useEffect, useState } from '../../../libraries'
import { LocalStorage } from '../../../helpers/localStorage'
import { EmptyData, LoadingComponent } from '../../molecules'

const AppointmentCancel = ({ sectionSecondHeight, TriggerUpdate, TriggerReducer, title, search, section }) => {
  const [sectionSecondHeightUpdate, setSectionSecondHeightUpdate] = useState(0)
  const [active, setActive] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [totalAppointments, setTotalAppointments] = useState(null)
  const [paramsFilter, setParamsFilter] = useState({
    date_start: section === 1 ? moment().add(0, 'days').format("YYYY-MM-DD") : moment().add(-1, 'days').format("YYYY-MM-DD"),
    date_end: section === 1 ? moment().add(0, 'days').format("YYYY-MM-DD") : moment().add(-1, 'days').format("YYYY-MM-DD"),
    status: ['CANCELED_BY_SYSTEM', 'CANCELED_BY_GP', 'CANCELED_BY_USER', 'PAYMENT_EXPIRED', 'PAYMENT_FAILED'],
    sort_type: 'DESC',
    keyword: '',
    page: 1
  })

  useEffect(() => {
    if(refresh){
      setTotalAppointments(null)
      // if(paramsFilter.keyword !== '' && paramsFilter.page === 1){
      //   setAppointments([]);
      // }
      Api.post(`/appointment/v1/consultation/canceled`, paramsFilter, {
        headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
      }).then(appointment => {
        console.log("appointment cancel", appointment)
        setTotalAppointments(appointment.data.meta.total)
        if(paramsFilter.keyword !== '' && paramsFilter.page === 1){
          setAppointments(appointment.data.data);
        } else {
          appointment.data.data.forEach((item, i) => {
            setAppointments(appointments => appointments.concat(item));
          });
        }
        setShowMore(true);
        setLoading(false);
      }).catch((error) => {
        if(paramsFilter.keyword !== '' && paramsFilter.page === 1){
          setAppointments([]);
        }
        setShowMore(false);
        setLoading(false);
      });
      setRefresh(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    setRefresh(true)
  }, [paramsFilter.page])

  useEffect(() => {
    if(TriggerReducer && TriggerReducer.refreshAppointmentTemporaryCancel){
      setAppointments([]);
      setRefresh(true);
      TriggerUpdate(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer])

  useEffect(() => {
    setAppointments([]);
    setParamsFilter({ ...paramsFilter, keyword: `${search ? search : ""}`, page: 1 });
    setRefresh(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleCounter = (value) => {
    setActive(value);
    TriggerUpdate({ page: "home", trigger: "open-order", AppointmentId: value })
  }

  const pagination = () => {
    setParamsFilter({ ...paramsFilter, page: paramsFilter.page + 1 })
  }

  useEffect(() => {
    let headerHeight = document.getElementById("header-appointments-list").clientHeight;
    setSectionSecondHeightUpdate(parseInt(sectionSecondHeight)-parseInt(headerHeight));
  }, [sectionSecondHeight])

  return (
    <div className="flex flex-wrap content-start w-full relative" style={{ height: `${(sectionSecondHeight)}px` }}>
      {/* <div className="w-full relative mb-1"> */}
        <div id="header-appointments-list" className="w-full block">
          <LabelTitle text={title} />
        </div>
        <div className="w-full mt-1 relative block overflow-y-auto scroll-small pb-4" style={{ height: `${(sectionSecondHeightUpdate)}px` }}>
          {
            appointments.length > 0 ?
              appointments.map((appointment, index) => {
                return (
                  <div className="w-full" key={index}>
                    <Appointment
                      key={index}
                      name={appointment.user.name}
                      date={appointment.schedule ? appointment.schedule.date : null}
                      time={appointment.schedule ? appointment.schedule.time_start : null}
                      value={appointment.id}
                      counter={(value) => handleCounter(value)}
                      active={ appointment.id === active ? true : false }
                    />
                  </div>
                )
              })
            : !loading && appointments.length < 1 ?
              <div className="w-full h-full absolute inset-y-0 my-auto flex items-center">
                <EmptyData text="tidak ada perjanjian disini" />
              </div>
            : ""
          }
          {
            showMore && totalAppointments && totalAppointments > appointments.length ?
              <button onClick={() => pagination()} className="w-full text-mainColor flex flex-wrap justify-center text-sm mt-5 mb-2">
                <span className="w-full text-center text-xs mb-2">Tampilkan Lebih</span>
              </button>
            : ""
          }
          {
            loading ?
              <div className="w-full h-full absolute inset-y-0 my-auto flex items-center">
                <LoadingComponent />
              </div> : ""
          }
        </div>
      {/* </div> */}
    </div>
  )
}

const mapStateToProps = (state) => ({
  TriggerReducer: state.TriggerReducer.data
})

const reducer = {
  TriggerUpdate
}

export default connect(mapStateToProps, reducer)(AppointmentCancel)
