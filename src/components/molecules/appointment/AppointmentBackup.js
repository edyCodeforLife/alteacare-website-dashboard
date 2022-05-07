import moment from 'moment'
import { debounce } from 'lodash'
import { connect } from 'react-redux'
import { Api } from '../../../helpers/api'
import { ArrowDown } from '../../../assets/images'
import { LabelTitle, Appointment } from '../../atoms'
import { LocalStorage } from '../../../helpers/localStorage'
import { TriggerUpdate } from '../../../modules/actions'
import { React, useEffect, useState } from '../../../libraries'
import { EmptyData, InputSearchWithIcon, LoadingComponent } from '../../molecules'

const AppointmentTemporary = ({ sectionSecondHeight, TriggerUpdate, type }) => {
  const [active, setActive] = useState(null)
  const [loadListAppointment, setLoadListAppointment] = useState(false)
  const [, setSectionLoadinHeight] = useState(false)
  const [listAppointment, setListAppointment] = useState([])
  const [paramsFilter, setParamsFilter] = useState({
    date_start: "",
    date_end: "",
    doctor_id: "",
    user_id: "",
    consultation_method: "",
    hospital_id: "",
    specialist_id: "",
    status: [],
    keyword: "",
    page: null
  })
  const [listAppointmentDate, setListAppointmentDate] = useState([
    {
      date_start: `${moment().add(0, 'days').format("YYYY-MM-DD")}`,
      date_end: `${moment().add(1, 'days').format("YYYY-MM-DD")}`,
      dateText: "Hari Ini",
      loading: false
    },
    {
      date_start: `${moment().add(-1, 'days').format("YYYY-MM-DD")}`,
      date_end: `${moment().add(0, 'days').format("YYYY-MM-DD")}`,
      dateText: "Kemarin",
      loading: false
    }
  ])

  useEffect(() => {
    setListAppointment([])
    if(type === ""){
      let listAppointmentData = []
      listAppointmentDate.forEach((res, idx) => {
        let listAppointmentDateData = [...listAppointmentDate]
        let paramsFilterUpdate = {...paramsFilter}
        paramsFilterUpdate.status = ['NEW', 'PROCESS_GP', 'WAITING_FOR_PAYMENT']
        if(paramsFilter.keyword === ""){
          paramsFilterUpdate.date_start = res.date_start
          paramsFilterUpdate.date_end = res.date_end
        }
        listAppointmentDateData[idx].loading = true
        setListAppointmentDate(listAppointmentDateData)

        Api.post(`/appointment/v1/consultation/ongoing`, paramsFilterUpdate, {
          headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
        }).then(appointment => {
          listAppointmentData[idx] = {
            text: res.dateText,
            date: res.date_start,
            appointmentData: appointment.data.data,
          }
          listAppointmentDateData[idx].loading = false
          setListAppointmentDate(listAppointmentDateData)
        }).catch(function (error) {
          listAppointmentData[idx] = {
            text: res.dateText,
            date: res.date_start,
            appointmentData: [],
          }
          listAppointmentDateData[idx].loading = false
          setListAppointmentDate(listAppointmentDateData)
        })
        setListAppointment(listAppointmentData)
      });
    } else {
      let listAppointmentData = []
      listAppointmentDate.forEach((res, idx) => {
        let listAppointmentDateData = [...listAppointmentDate]
        let paramsFilterUpdate = {...paramsFilter}
        paramsFilterUpdate.status = ['CANCELED_BY_SYSTEM', 'CANCELED_BY_GP', 'CANCELED_BY_USER', 'PAYMENT_EXPIRED', 'PAYMENT_FAILED', 'REFUNDED']
        if(paramsFilter.keyword === ""){
          paramsFilterUpdate.date_start = res.date_start
          paramsFilterUpdate.date_end = res.date_end
        }

        listAppointmentDateData[idx].loading = true
        setListAppointmentDate(listAppointmentDateData)

        Api.post(`/appointment/v1/consultation/canceled`, paramsFilterUpdate, {
          headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
        })
        .then(appointment => {
          listAppointmentData[idx] = {
            text: res.dateText,
            date: res.date_start,
            appointmentData: appointment.data.data,
          }
          listAppointmentDateData[idx].loading = false
          setListAppointmentDate(listAppointmentDateData)
        })
        .catch(function (error) {
          console.log(error.message)
          listAppointmentData[idx] = {
            text: res.dateText,
            date: res.date_start,
            appointmentData: [],
          }
          listAppointmentDateData[idx].loading = false
          setListAppointmentDate(listAppointmentDateData)
        })
        setListAppointment(listAppointmentData)
      });
    }
  }, [type, loadListAppointment])

  const handleCounter = (value) => {
    setActive(value);
    TriggerUpdate({
      page: "home",
      trigger: "open-order",
      AppointmentId: value
    })
  }

  const handleCounterInputSearch = debounce((value) => {
    setParamsFilter({
      ...paramsFilter,
      keyword: value
    })
    setLoadListAppointment(!loadListAppointment)
  }, 700)

  useEffect(() => {
    if (sectionSecondHeight) {
      const heightHeader = document.getElementById('wrap-search').clientHeight
      setSectionLoadinHeight(parseInt(sectionSecondHeight) - parseInt(heightHeader))
    }
  }, [sectionSecondHeight])

  const pagination = () => {
    console.log(1);
  }

  return (
    <>
      <div className="w-full py-2 px-5" id="wrap-search">
        <InputSearchWithIcon counter={(value) => handleCounterInputSearch(value)} />
      </div>
      <div
        className={`flex flex-wrap content-start overflow-y-auto scroll-small w-full relative`}
        style={{ height: sectionSecondHeight !== "" ? sectionSecondHeight + "px" : "" }}
      >
        {listAppointmentDate.length > 0 ?
          listAppointmentDate.map((res, idx) => {
            return (
              <div className="w-full relative mb-1" key={idx}>
                <div className={`w-full ${idx > 0 && paramsFilter.keyword !== "" ? "hidden" : "block"}`}>
                  <LabelTitle text={paramsFilter.keyword === "" ? res.dateText : "Data List"} />
                </div>
                <div className={`w-full mt-1 relative ${idx > 0 && paramsFilter.keyword !== "" ? "hidden" : "block"}`}>
                  {listAppointment[idx] && listAppointment[idx].appointmentData.length > 0 ?
                    <>
                    {listAppointment[idx].appointmentData.map((row, index) => {
                      return(
                        <div className="w-full" key={index}>

                          <Appointment
                            key={index}
                            name={row.user.name}
                            date={row.schedule ? row.schedule.date : null}
                            time={row.schedule ? moment(row.schedule.time_start, 'HH:mm').format('HH:mm') : null}
                            value={row.id}
                            counter={(value) => handleCounter(value)}
                            active={ row.id === active ? true : false }
                          />
                        </div>
                      )
                    })}
                    <button
                        onClick={() => pagination()}
                        className="w-full text-mainColor flex flex-wrap justify-center text-sm mt-5 mb-2"
                      >
                        <span className="w-full text-center text-xs mb-2">Tampilkan Lebih</span>
                        <img src={ArrowDown} alt="Arrow Down" />
                    </button>
                    </>
                  : ""}
                  {res.loading ?
                      <div className="w-full h-full flex items-center my-5">
                        <LoadingComponent />
                      </div>
                  : ""}
                  {
                    !res.loading && listAppointment[idx] && listAppointment[idx].appointmentData.length < 1 ?
                      <div className="w-full h-full flex items-center my-5">
                        <EmptyData text="tidak ada perjanjian disini" />
                      </div>
                    : ""
                  }
                </div>
              </div>
            )
          })
        : ""}
      </div>
    </>
  )
}

AppointmentTemporary.defaultProps = {
  type: ""
}

const mapDispatchToProps = {
  TriggerUpdate
}

export default connect(null, mapDispatchToProps)(AppointmentTemporary)
