import { React, useState, useEffect } from '../../libraries'
import { connect } from 'react-redux'
import { Api } from '../../helpers/api'
import { LocalStorage } from '../../helpers/localStorage'
import { CleanParamsAppointment, TriggerUpdate, UserDataSelected } from '../../modules/actions'
import { ButtonDarkGrey, BoxDefault, LabelTitle } from '../atoms'
import { DataPatient, DoctorSpesialist, DataPatientSearch, LoadingComponent } from '../molecules'
import { SimpleBio } from '../molecules/bio'
import { FormNotePatient, FormPatient } from '../molecules/patient'
import { Canceled, ModalDefault } from '../molecules/modal'
import { AlertClose, ChevronLeft } from '../../assets/images'
import { AlertMessagePanel } from './modal'

const SectionFormPatient = ({
  HeightElementReducer,
  UserSelectReducer,
  ParamCreateAppointment,
  CleanParamsAppointment,
  UserDataSelected,
  UserSelectIdReducer,
  TriggerUpdate,
  TriggerReducer,
  buttonBack,
  type,
  disabledFromOrdered,
  counterCloseFromOrderedFormPatien,
  counterRefferenceId
}) => {
  const [sectionSecondHeight, setSectionSecondHeight] = useState("")
  const [section, setSection] = useState("frame-1")
  const [BioData, setBioData] = useState(null)
  const [sectionEditProfile, setSectionEditProfile] = useState(false)
  const [sectionDataPatientSearch, setsectionDataPatientSearch] = useState(false)
  const [buttonNextPayment, setButtonNextPayment] = useState(true)
  const [messageAlert, setMessageAlert] = useState(null)
  const [isLoadingProccess, setIsLoadingProccess] = useState(false)
  const [consultationModal, setConsultationModal] = useState(false)
  const [appointmentId, setAppointmentId] = useState("")
  const [appointmentDetail, setAppointmentDetail] = useState(null)
  const [step, setStep] = useState({
    pasien: false,
    note: false,
    spesialis: false
  })
  const [modalCanceled, setModalCanceled] = useState({
    status: false,
    appointmentId: ""
  })

  useEffect(() => {
    if(HeightElementReducer !== null){
      const elementHeader = document.getElementById('element-header-section-form-patient').clientHeight
      setSectionSecondHeight(parseInt(HeightElementReducer.heightElement)-parseInt(elementHeader))
    }
  }, [HeightElementReducer])

  useEffect(() => {
    setBioData(UserSelectReducer)
  }, [UserSelectReducer])

  const handleClickSectionChange = (value) => {
    setSection(value)
  }

  useEffect(() => {
    if(ParamCreateAppointment.doctor_id !== "" && ParamCreateAppointment.user_id !== "" && ParamCreateAppointment.schedules.length > 0){
      setButtonNextPayment(false)
    }
  }, [ParamCreateAppointment])

  useEffect(() => {
    if(UserSelectIdReducer && UserSelectIdReducer.appointmentId){
      setAppointmentId(UserSelectIdReducer.appointmentId)
      Api.get(`/appointment/v1/consultation/${UserSelectIdReducer.appointmentId}` ,
        {
          headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
        }
      )
      .then(res => {
        if(counterRefferenceId !== "") counterRefferenceId(res.data.data.refference_appointment_id);
        setAppointmentDetail(res.data.data)
      })
      .catch(function (error) {
        console.log(error.message)
      })
    } else {
      setAppointmentDetail(null)
    }
  }, [UserSelectIdReducer])

  const handleMakeConsultation = () => {
    setIsLoadingProccess(true)
    setButtonNextPayment(true)
    Api.post('/appointment/v3/consultation', ParamCreateAppointment,
      {
        headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
      }
    ).then(res => {
      setMessageAlert({
        text: "Perjanjian konsultasi diteruskan ke pembayaran"
      })
      setSection("frame-1")
      CleanParamsAppointment()
      setIsLoadingProccess(false)
      setButtonNextPayment(false)
      setConsultationModal(false)
    }).catch(function (error) {
      console.log(error.message)
      setIsLoadingProccess(false)
      setButtonNextPayment(false)
      setConsultationModal(false)
    })
  }

  const handleContinueToPayment = () => {
    setIsLoadingProccess(true)
    setButtonNextPayment(true)
    Api.get(`/appointment/v1/payment/${appointmentId}/process-to-payment`,
      {
        headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
      }
    ).then(res => {
      setMessageAlert({
        text: "Perjanjian konsultasi diteruskan ke pembayaran"
      })
      setSection("frame-1")
      CleanParamsAppointment()
      setIsLoadingProccess(false)
      setButtonNextPayment(false)
      setConsultationModal(false)
    }).catch(function (error) {
      console.log(error.message)
      setIsLoadingProccess(false)
      setButtonNextPayment(false)
      setConsultationModal(false)
    })
  }

  const counterButtonBack = () => {
    TriggerUpdate({
      dataPatientSearch: true
    })
    CleanParamsAppointment()
  }

  useEffect(() => {
    if(TriggerReducer !== null && TriggerReducer.cancelEdit){
      setSectionEditProfile(false)
      TriggerUpdate(null)
    }

    if(TriggerReducer !== null && TriggerReducer.triggerSuccessEditUser){
      setMessageAlert({
        text: TriggerReducer.text
      })
      setSectionEditProfile(false)
      TriggerUpdate(null)
    }

    if(TriggerReducer !== null && TriggerReducer.closeSectionrightTypeCall){
      setsectionDataPatientSearch(false)
      TriggerUpdate(null)
    }
  }, [TriggerReducer])

  const handleCounterFormPatient = (value) => {
    if(value.status === "successUpdate" && UserSelectReducer !== null){
      Api.get(`/user/users/${UserSelectReducer.id}`, {
        headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
      })
      .then(res => {
        UserDataSelected(res.data.data)
      })
      .catch( function (error) {
        console.log(error.message)
      })
    }
  }

  const handleCounterRedButton = (value) => {
    // console.log(value)
    setModalCanceled({
      status: true,
      appointmentId: value
    })
  }

  const handleCounterModalCanceled = (value) => {
    if(value.status){
      Api.post(`/appointment/v1/consultation/cancel`, { appointment_id: value.appointmentId, note: value.note }, {
        headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
      })
      .then(res => {
        setMessageAlert({
          text: "Perjanjian konsultasi telah di batalkan"
        })
        setModalCanceled({
          status: false,
          appointmentId: ""
        })
      })
      .catch(function (error) {
        console.log(error.message)
      })
    } else {
      setModalCanceled({
        status: false,
        appointmentId: ""
      })
    }
  }

  const handleCounterWithFormNote = (value) => {
    console.log(value)
  }

  const handleFillAddress = (value) => {
    // console.log(value)
    let UserSelectReducerData = {...UserSelectReducer}
    UserSelectReducerData.user_addresses = value
    UserDataSelected(UserSelectReducerData)
    setsectionDataPatientSearch(false)
  }

  const handleModalConsultation = () => {
    setConsultationModal(true)
  }

  const handleCounterModalDefaultConsultation = (value) => {
    if(value){
      if(type === "call" || type === "missed-call"){
        handleContinueToPayment()
      } else {
        handleMakeConsultation()
      }
    } else {
      setConsultationModal(false)
    }
  }

  return (
    <div className="w-full relative">
      {messageAlert !== null ?
        <AlertMessagePanel text={messageAlert.text} counter={(value) => setMessageAlert(value)} />
      : ""}
      {consultationModal ?
        <ModalDefault
          text="Apakah Anda yakin yang ingin melanjutkan konsultasi ini ke pembayaran? Mohon periksa kembali untuk proses selanjutnya."
          buttonText="Batal"
          buttontextwhite="Yakin"
          counter={(value) => handleCounterModalDefaultConsultation(value)}
        />
      : ""}
      <div id="element-header-section-form-patient">
        <div className={`w-full py-2 px-5 flex items-center ${buttonBack === "" || buttonBack !== false ? "justify-between" : "justify-end"}`}>
        {!disabledFromOrdered ?
          <>
            {buttonBack === "" || buttonBack !== false ?
              <button onClick={counterButtonBack} className="flex items-center text-mainColor font-bold">
                <img src={ChevronLeft} alt="Chevron Left Icon" className="inline mr-4 cursor-pointer" />
              </button>
            : ""}
            {/* <ButtonDarkGrey
              text="Lanjut ke Pembayaran"
              counter={() => type === "call" || type === "missed-call" ? handleContinueToPayment() : handleMakeConsultation()}
              backgroundColor={buttonNextPayment ? "bg-dark4" : "bg-mainColor"}
              disabled={buttonNextPayment}
              isLoading={isLoadingProccess}
            /> */}
            <ButtonDarkGrey
              text="Lanjut ke Pembayaran"
              counter={() => handleModalConsultation()}
              backgroundColor={buttonNextPayment ? "bg-dark4" : "bg-mainColor"}
              disabled={buttonNextPayment}
              isLoading={isLoadingProccess}
            />
          </>
          : ""}
        </div>
        {type === "call" || type === "missed-call" ?
          appointmentDetail !== null ?
            <div className="w-full">
              <LabelTitle
                text={`Order ID : ${appointmentDetail.order_code}`}
                redButton={{ text: "Batal", appointmentId: appointmentDetail.id }}
                counterRedButton={(value) => handleCounterRedButton(value)}
                status={appointmentDetail.status}
                fontStyle="font-bold"
                // buttonBack={() => counterButtonBack()}
              />
            </div>
          : ""
        : ""}
        <div className="w-full py-2 px-5 flex bg-light3 text-dark2">
          <button
            className={`font-bold text-xs ${section === "frame-1" || section === "frame-2" ? "border-b-2 border-solid border-info2" : ""} py-1 mr-5`}
            disabled={step.pasien}
            onClick={() => handleClickSectionChange("frame-1")}>Pasien
          </button>
          <button
            className={`font-bold text-xs ${section === "frame-3" ? "border-b-2 border-solid border-info2" : ""} py-1 mr-5`}
            disabled={step.note}
            onClick={() => handleClickSectionChange("frame-3")}>Note
          </button>
          {!disabledFromOrdered ?
            <button
              className={`font-bold text-xs ${section === "frame-4" || section === "frame-5" || section === "frame-6" || section === "frame-7" ? "border-b-2 border-solid border-info2" : ""} py-1`}
              disabled={step.spesialis}
              onClick={() => handleClickSectionChange("frame-4")}>
              Spesialis
            </button>
          : ""}
          {disabledFromOrdered ?
            <button className="ml-auto" onClick={() => counterCloseFromOrderedFormPatien()}>
              <img src={AlertClose} alt="Alert Close Icon" />
            </button>
          : ""}
        </div>
      </div>
      <div className="flex flex-wrap overflow-y-auto scroll-small border-l border-solid" style={{ height: sectionSecondHeight !== "" ? sectionSecondHeight + "px" : "", borderColor: "#F2F2F5" }}>
        <div className="w-full flex flex-wrap">
          {section === "frame-1" ?
            <>
              {!sectionEditProfile ?
                <div className="relative w-full flex flex-wrap px-5 py-5">
                  {
                    !UserDataSelected ?
                      <div className="w-full h-full absolute inset-0 bg-white z-10">
                        <LoadingComponent />
                      </div>
                    : ""
                  }

                  { BioData ?
                    <>
                      <div className={`${type !== "missed-call" ? "w-8/12" : "w-full"} self-start`}>
                        {BioData.user_addresses.length > 0 && BioData.user_details.id_card !== "" ?
                          <SimpleBio data={BioData} image={true} />
                        :
                          <FormPatient type="completeData" BioData={BioData} counter={(value) => handleCounterFormPatient(value)} />
                        }

                      </div>
                      {type !== "missed-call" ?
                        <div className="w-4/12 pb-2">
                          <div className="flex flex-wrap justify-end">
                            {BioData.user_addresses.length > 0 ?
                              <button
                                className={`border border-solid border-darker text-darker rounded py-1 px-2 text-sm`}
                                onClick={() => setSectionEditProfile(true)}>Edit</button>
                            : ""}
                            {type === "call" ?
                              <button
                                className={`mt-20 border border-solid border-mainColor text-mainColor rounded py-1 px-1 text-xs`}
                                onClick={() => setsectionDataPatientSearch(true)}>Check Data Pasien</button>
                            : ""}
                          </div>
                        </div>
                      : ""}
                    </>
                  :
                    <div className="w-full h-full absolute inset-0 bg-white z-10">
                      <LoadingComponent />
                    </div>
                  }
                </div>
              :
                <FormPatient />
              }
            </>
            : ""}
          {section === "frame-2" ?
            <DataPatient />
            : ""}
          {section === "frame-3" ?
            <FormNotePatient />
            : ""}
          {section === "frame-4" ?
            <DoctorSpesialist disabledFromOrdered={false} />
            : ""}
          {section === "frame-7" ?
            <div className="flex flex-wrap relative w-full border-light3">
              <div className="w-full px-6 pt-2 pb-2 flex flex-wrap items-center">
                <div className="w-11/12 flex flex-wrap items-center">
                  <p className="w-full flex items-center pb-2 font-bold text-left text-sm">
                    <span className="mr-auto">Spesialist</span>
                  </p>
                </div>
                <div className="w-1/12 flex justify-end items-start">
                  <img src={AlertClose} alt="Alert Close" className="w-2/5 cursor-pointer" onClick={() => handleClickSectionChange("frame-5")} />
                </div>
              </div>
            </div>
            : ""}
        </div>
      </div>
      {type === "call" && sectionDataPatientSearch ?
        <>
          <div className="fixed w-full h-full z-10 left-0 top-0" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}></div>
          <div className="absolute w-full bottom-0 left-0 bg-white z-20" style={{ height: sectionSecondHeight !== "" ? sectionSecondHeight + "px" : "" }}>
            <DataPatientSearch
              userId={BioData !== null ? BioData.id : ""}
              type={type}
              counterFillAddress={(value) => handleFillAddress(value)}
            />
          </div>
        </>
      : ""}

      {modalCanceled.status ?
        <Canceled
          appointmentId={modalCanceled.appointmentId}
          counterWithFormNote={(value) => handleCounterWithFormNote(value)}
          counter={(value) => handleCounterModalCanceled(value)} />
      : ""}
    </div>
  )
}

SectionFormPatient.defaultProps = {
  buttonBack: "",
  type: "",
  disabledFromOrdered: false,
  counterCloseFromOrderedFormPatien: "",
  counterRefferenceId: ""
}

const mapStateToProps = (state) => ({
  HeightElementReducer: state.HeightElementReducer.data,
  UserSelectReducer: state.UserSelectReducer.data,
  ParamCreateAppointment: state.ParamCreateAppointment.data,
  TriggerReducer: state.TriggerReducer.data,
  UserSelectIdReducer: state.UserSelectIdReducer.data
})

const mapDispatchToProps = {
  CleanParamsAppointment,
  TriggerUpdate,
  UserDataSelected
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionFormPatient)
