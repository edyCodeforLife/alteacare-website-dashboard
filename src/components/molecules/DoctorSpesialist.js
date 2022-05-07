import moment from 'moment'
import { connect } from 'react-redux'
import { Api } from '../../helpers/api'
import { ButtonTextAndBorderBlue } from '../atoms'
import { DoctorSpesialistList } from '../molecules'
import { dayFormat } from '../../helpers/dateFormat'
import { TriggerUpdate } from '../../modules/actions'
import { LocalStorage } from '../../helpers/localStorage'
import { React, useState, useEffect } from '../../libraries'
import { ClockIcon, CalenderIcon } from '../../assets/images'

const DoctorSpesialist = (props) => {
  const {
    TriggerReducer,
    TriggerUpdate,
    ParamsAppointment,
    disabledFromOrdered,
    sectionHeight = null,
    hiddenButtonChangeSpecialist = false,
    isFromMissedCall = false
  } = props;

  const [dataDoctor, setDataDoctor] = useState({});
  const [scheduleSelected, setScheduleSelected] = useState(null);
  const [changeSpesialist, setChangeSpesialist] = useState(false);

  const handleChangeSpesialist = () => {
    setChangeSpesialist(true)
  }

  useEffect(() => {
    if (TriggerReducer && TriggerReducer.closeDoctorSpesialistList) {
      setChangeSpesialist(false)
      TriggerUpdate(null)
    }

    if (TriggerReducer !== null && TriggerReducer.updateAppointmentTrigger) {
      const ParamsAppointmentUpdate = {...ParamsAppointment};
      delete ParamsAppointmentUpdate.consultation_method;
      Api.patch(`/appointment/v1/consultation/${ParamsAppointmentUpdate.appointmentId}`, ParamsAppointmentUpdate, {
        headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer])

  useEffect(() => {
    if (ParamsAppointment.doctor_id !== '') {
      Api.get(`/data/doctors/${ParamsAppointment.doctor_id}`)
      .then((response) => {
        setDataDoctor(response.data.data)
        setChangeSpesialist(false)
      }).catch((error) => {
        setDataDoctor({})
        setChangeSpesialist(false)
      })
    }
  }, [ParamsAppointment.doctor_id])

  useEffect(() => {
    if(ParamsAppointment.schedules.length > 0){
      setScheduleSelected(ParamsAppointment.schedules[0])
    }
  }, [ParamsAppointment.schedules])

  return (
    <div className="flex flex-wrap w-full xl:px-5 px-2 bg-white relative">
      {
        Object.keys(dataDoctor).length > 0 ?
          (
            <>
              <div className="w-4/6 pt-4 flex flex-wrap self-start">
                <div className="w-2/6 h-28 bg-gray-300 rounded-sm">
                  {
                    dataDoctor.photo
                      ? (
                        <img
                          src={ dataDoctor.photo.formats.small }
                          alt="Doctor Profile"
                          className="object-cover w-full h-full rounded-sm"
                        />
                      ) : ''
                  }
                </div>
                <div className="w-full py-2">
                  <div className="text-xs mb-1">
                    {
                      dataDoctor.hospital && dataDoctor.hospital.length > 0
                        ? (
                          <>
                            <img src={dataDoctor.hospital[0].icon ? dataDoctor.hospital[0].icon.url : ""} alt="Small Logo" className="inline mr-2 w-8" />
                            <span>{dataDoctor.hospital[0].name}</span>
                          </>
                        ) : ''
                    }
                  </div>
                  <p className="font-bold mb-1 text-sm">{dataDoctor.name}</p>
                  <p className="text-xs mb-1">Sp. {dataDoctor.specialization.name}</p>
                </div>
                <p className="w-full pt-1 pb-2 text-sm text-dark2">{dataDoctor.price.formatted}</p>
                {
                  scheduleSelected
                    ? (
                      <>
                        <div className="w-full py-1 text-sm text-dark2">
                          <img src={CalenderIcon} alt="Calender Icon" className="inline mr-3" />
                          {`${dayFormat(moment(scheduleSelected.date).day())}, ${moment(scheduleSelected.date).format('DD MMM Y')}`}
                        </div>
                        <div className="w-full py-1 text-sm text-dark2">
                          <img src={ClockIcon} alt="Calender Icon" className="inline mr-3" />
                          {`${moment(scheduleSelected.time_start, "HH:mm:ss").format("HH:mm")} - ${moment(scheduleSelected.time_end, "HH:mm:ss").format("HH:mm")}`}
                        </div>
                      </>
                    ) : ''
                }
              </div>
              <div className="w-2/6 pt-4 self-start">
                {
                  !hiddenButtonChangeSpecialist
                    ? (
                      <ButtonTextAndBorderBlue
                        text="Change Spesialist"
                        fontSize={`${isFromMissedCall ? "text-xxs" : "xl:text-xs text-xxs"}`}
                        dimesion={`w-full ${isFromMissedCall ? "p-1" : "xl:p-2 p-1"}`}
                        counter={() => handleChangeSpesialist()}
                      />
                    ) : ''
                }
              </div>
            </>
          ) : ''
      }
      {
        changeSpesialist || Object.keys(dataDoctor).length < 1
          ? (
            <DoctorSpesialistList
              isFromMissedCall={isFromMissedCall}
              sectionHeight={sectionHeight}
              disabledFromOrdered={disabledFromOrdered}
              counterCloseFromOrderedDoctorSpesialistList={() => setChangeSpesialist(false)}
              disableButtonBackLeft={Object.keys(dataDoctor).length < 1}
            />
          ) : ''
      }
    </div>
  )
}

DoctorSpesialist.defaultProps = {
  disabledFromOrdered: false
}

const mapStateToProps = (state) => ({
  TriggerReducer: state.TriggerReducer.data,
  ParamsAppointment: state.ParamCreateAppointment.data
})

const mapDispatchToProps = {
  TriggerUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSpesialist)
