import { React, useState, useEffect } from '../../../libraries';
import { batch, useDispatch } from 'react-redux';

import { Api } from '../../../helpers/api';
import { LocalStorage } from '../../../helpers/localStorage';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

import Addresses from '../address/Addresses';
// import { SimpleBio } from '../../molecules/bio';
import FamilyMemberList from '../familyMember/List';
import FormAddress from '../formPatient/FormAddress';
// import { FormPatient } from '../../molecules/patient';
import { ButtonDarkGrey, LabelTitle } from '../../atoms';
import { FormNotePatient } from '../../molecules/patient';
import FormPatientMember from '../formPatient/FormPatient';
import PatientScreen from '../../molecules/patient/Patient';
import { ChevronLeft, AlertClose } from '../../../assets/images';
import FormCheckDataPatient from '../formPatient/FormCheckDataPatient';
import { DoctorSpesialist } from '../../molecules';
import {
  AlertMessagePanel,
  ModalDefault,
  Canceled,
  ModalWindow,
} from '../../molecules/modal';

import { MemberAction } from '../../../modules/actions/family-member/Member__Action';
import { PatientSelectAction } from '../../../modules/actions/user/userData__Action';

import {
  DocumentUpdate,
  FilterHospitals,
  FilterSpesialist,
  setTriggerUpdate,
  // setUserDataSelected,
  CreateParamsAppointment,
  setCleanParamsAppointment,
} from '../../../modules/actions';

const SectionFormPatient = props => {
  const {
    type = '',
    counterRefferenceId = '',
    disabledFromOrdered = false,
    hiddenButtonChevronLeft = false,
    isEnableUpdateAppointment = false,
    counterCloseFromOrderedFormPatien = '',
  } = props;

  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [address, setAddress] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [messageAlert, setMessageAlert] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [addressMessage, setAddressMessage] = useState(null);
  const [formPatientMessage, setFormPatientMessage] = useState(null);
  const [patientMessage, setPatientMessage] = useState(null);
  const [isOpenAddresses, setIsOpenAddresses] = useState(false);
  const [buttonNextPayment, setButtonNextPayment] = useState(true);
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const [consultationModal, setConsultationModal] = useState(false);
  const [isLoadingProccess, setIsLoadingProccess] = useState(false);
  const [ableButtonProsess, setAbleButtonProsess] = useState(false);
  // const [sectionEditProfile, setSectionEditProfile] = useState(false);
  const [hiddenButtonProsess, setHiddenButtonProsess] = useState(false);
  const [displayFeaturePatient, setDisplayFeaturePatient] = useState(null);
  const [isLoadAppointmentDetail, setIsLoadAppointmentDetail] = useState(false);
  // const [sectionDataPatientSearch, setsectionDataPatientSearch] = useState(false);
  const [modalWindowData, setModalWindowData] = useState({
    visibility: false,
    text: '',
  });
  const [modalCanceled, setModalCanceled] = useState({
    status: false,
    appointmentId: null,
  });

  const {
    TriggerReducer,
    UserSelectReducer,
    // UserSelectIdReducer,
    HeightElementReducer,
    PatientSelectReducer,
    ParamCreateAppointment,
  } = useShallowEqualSelector(state => state);

  const counterButtonBack = () => {
    batch(() => {
      if (type === 'missed-call')
        dispatch(setTriggerUpdate({ dataPatientSearch: true }));
      else dispatch(setTriggerUpdate({ dataPatientSearch: true }));
      dispatch(setCleanParamsAppointment());
      dispatch(PatientSelectAction(null));
    });
  };

  const handleModalConsultation = () => {
    setConsultationModal(true);
  };

  const handleCounterModalDefaultConsultation = value => {
    if (value) {
      let data;
      if (!ableButtonProsess) {
        if (type === 'call' || type === 'missed-call') {
          data = {
            method: Api.get(
              `/appointment/v1/payment/${appointmentId}/process-to-payment`,
              {
                headers: {
                  Authorization: `Bearer ${LocalStorage('access_token')}`,
                },
              }
            ),
            textMessageAlert: 'Perjanjian konsultasi diteruskan ke pembayaran',
            type: 'process-payment',
          };
        } else {
          let ParamCreateAppointmentUpdate = { ...ParamCreateAppointment.data };
          ParamCreateAppointmentUpdate.consultation_method = 'VIDEO_CALL';
          data = {
            method: Api.post(
              `/appointment/v3/consultation`,
              ParamCreateAppointmentUpdate,
              {
                headers: {
                  Authorization: `Bearer ${LocalStorage('access_token')}`,
                },
              }
            ),
            textMessageAlert: 'Berhasil Membuat Perjanjian konsultasi',
            type: 'make-consultation',
          };
        }
        prosessAppointment(data);
      } else {
        updateConsultation(ableButtonProsess);
      }
    } else {
      setConsultationModal(false);
    }
  };

  const updateConsultation = (ableButtonProsess = false) => {
    Api.patch(
      `/appointment/v1/consultation/${ParamCreateAppointment.data.appointment_id}`,
      ParamCreateAppointment.data,
      {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      }
    )
      .then(res => {
        if (ableButtonProsess)
          closedAll(true, 'Berhasil Memperbarui Perjanjian konsultasi');
      })
      .catch(function (error) {
        if (ableButtonProsess) closedAll(false, error.response.data.message);
      });
  };

  const prosessAppointment = ({ method, textMessageAlert, type }) => {
    setIsLoadingProccess(true);
    setButtonNextPayment(true);
    if (type === 'process-payment') updateConsultation();

    method
      .then(res => {
        closedAll(true, textMessageAlert, res);
      })
      .catch(function (error) {
        closedAll(false, error.response.data.message, null);
      });
  };

  const closedAll = (status, textMessageAlert, response = null) => {
    setTab(0);
    setIsLoadingProccess(false);
    setButtonNextPayment(false);
    setConsultationModal(false);
    let ParamCreateAppointmentUpdate = { ...ParamCreateAppointment.data };
    if (status && response) {
      ParamCreateAppointmentUpdate.appointment_id =
        ParamCreateAppointmentUpdate.appointment_id
          ? ParamCreateAppointmentUpdate.appointment_id
          : response.data.data.appointment_id;

      dispatch(CreateParamsAppointment(ParamCreateAppointmentUpdate));
    }

    if (status) setMessageAlert({ text: textMessageAlert, type: 'success' });
    if (!status) setMessageAlert({ text: textMessageAlert, type: 'failed' });

    if (status) setAbleButtonProsess(true);
    if (status) setIsLoadAppointmentDetail(!isLoadAppointmentDetail);
    if (status) {
      dispatch(
        setTriggerUpdate({
          refreshAppointmentTemporary: true,
          refreshAppointmentTemporaryCancel: true,
        })
      );
    }
  };

  // const handleFillAddress = (value) => {
  //   let UserSelectReducerData = {...UserSelectReducer.data}
  //   UserSelectReducerData.user_addresses = value
  //   dispatch(setUserDataSelected(UserSelectReducerData))
  //   setsectionDataPatientSearch(false)
  // }

  const handleCounterRedButton = value => {
    setModalCanceled({
      status: true,
      appointmentId: value,
    });
  };

  const handleCloseModalCancel = () => {
    setModalCanceled({
      status: false,
      appointmentId: null,
    });
  };

  const handleCounterWithFormNote = value => {
    //
  };

  const handleCounterModalCanceled = value => {
    if (value.status) {
      Api.post(
        `/appointment/v1/consultation/cancel`,
        { appointment_id: value.appointmentId, note: value.note },
        {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        }
      )
        .then(res => {
          setMessageAlert({
            text: 'Perjanjian konsultasi telah di batalkan',
            type: 'success',
          });
          setModalCanceled({
            status: false,
            appointmentId: '',
          });
          setIsLoadAppointmentDetail(!isLoadAppointmentDetail);
          setHiddenButtonProsess(true);
        })
        .catch(error => {
          setMessageAlert({
            text: error.response.data.message,
            type: 'failed',
            direction: 'bottom',
          });
          setModalCanceled({
            status: false,
            appointmentId: '',
          });
          setModalWindowData({
            visibility: true,
            text: error.response.data.message,
          });
        });
    } else {
      setModalCanceled({ status: false, appointmentId: null });
    }
  };

  useEffect(() => {
    if (PatientSelectReducer.data) {
      const birthDate =
        PatientSelectReducer?.data?.birthdate ||
        PatientSelectReducer?.data?.birth_date;
      const phone =
        PatientSelectReducer.data.phone_number ||
        PatientSelectReducer.data.phone;
      let addressData = PatientSelectReducer.data.address_raw
        ? PatientSelectReducer.data.address_raw[0]
        : null;

      if (addressData !== undefined || addressData !== null) {
        addressData = PatientSelectReducer.data.street
          ? {
              street: PatientSelectReducer.data.street,
              rt_rw: PatientSelectReducer.data.rt_rw,
              sub_district: PatientSelectReducer.data.sub_district,
              district: PatientSelectReducer.data.district,
              city: PatientSelectReducer.data.city,
              province: PatientSelectReducer.data.province,
            }
          : {};
      }

      setPatientData({
        id: PatientSelectReducer.data.id,
        age: PatientSelectReducer.data.age,
        email: PatientSelectReducer.data.email,
        phone: phone,
        cardId: PatientSelectReducer.data.card_id,
        lastName: PatientSelectReducer.data.last_name,
        birthDate: birthDate,
        firstName: PatientSelectReducer.data.first_name,
        gender:
          PatientSelectReducer.data.gender === 'MALE'
            ? 'Laki-laki'
            : 'Perempuan',
        photo: PatientSelectReducer.data.card_photo
          ? PatientSelectReducer.data.card_photo.url
          : '',
        address:
          addressData !== undefined && addressData !== null
            ? `${addressData.street},
          Blok RT/RW ${addressData.rt_rw}
          kel.${addressData.sub_district ? addressData.sub_district.name : ''}
          Kec.${addressData.district ? addressData.district.name : ''}
          ${addressData.city ? addressData.city.name : ''}
          ${addressData.province ? addressData.province.name : ''}`
            : '-',
        contactEmail: PatientSelectReducer.data.contact_email,
        contactPhone: PatientSelectReducer.data.contact_phone,
      });
    } else {
      setPatientData(null);
    }
  }, [PatientSelectReducer]);

  useEffect(() => {
    if (HeightElementReducer !== null) {
      const elementHeader = document.getElementById(
        'element-header-section-form-patient'
      ).clientHeight;
      setSectionHeight(
        parseInt(HeightElementReducer.data.heightElement) -
          parseInt(elementHeader)
      );
    }
  }, [HeightElementReducer]);

  useEffect(() => {
    if (TriggerReducer.data !== null && TriggerReducer.data.cancelEdit) {
      // setSectionEditProfile(false)
      dispatch(setTriggerUpdate(null));
    }

    if (
      TriggerReducer.data !== null &&
      TriggerReducer.data.triggerSuccessEditUser
    ) {
      setMessageAlert({
        text: TriggerReducer.data.text,
        type: 'success',
      });
      // setSectionEditProfile(false)
      dispatch(setTriggerUpdate(null));
    }

    // if(TriggerReducer.data !== null && TriggerReducer.data.closeSectionrightTypeCall){
    //   setsectionDataPatientSearch(false);
    //   dispatch(setTriggerUpdate(null));
    // }

    if (TriggerReducer.data !== null && TriggerReducer.data.updateAppointment) {
      updateConsultation();
      dispatch(setTriggerUpdate(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer]);

  useEffect(() => {
    if (ParamCreateAppointment && ParamCreateAppointment.data) {
      let condition = false;
      if (patientData) {
        condition =
          ParamCreateAppointment.data.doctor_id !== '' &&
          ParamCreateAppointment.data.user_id !== '' &&
          ParamCreateAppointment.data.symptom_note !== '' &&
          ParamCreateAppointment.data.schedules.length > 0 &&
          patientData.cardId !== '';
      }

      setAppointmentId(ParamCreateAppointment.data.appointment_id);

      if (condition) setButtonNextPayment(false);
      else setButtonNextPayment(true);
    }
  }, [ParamCreateAppointment, patientData]);

  useEffect(() => {
    if (appointmentId) {
      Api.get(`/appointment/v1/consultation/${appointmentId}`, {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      }).then(res => {
        setAppointmentDetail(res.data.data);
        dispatch(DocumentUpdate(res.data.data.medical_document));

        if (counterRefferenceId !== '')
          counterRefferenceId(res.data.data.refference_appointment_id);
        if (res.data.data.status === 'NEW') setHiddenButtonProsess(false);
        if (res.data.data.status === 'PROCESS_GP')
          setHiddenButtonProsess(false);
        if (res.data.data.status === 'CANCELED_BY_GP')
          setHiddenButtonProsess(true);
        if (
          res.data.data.status === 'WAITING_FOR_PAYMENT' &&
          !ableButtonProsess
        )
          setHiddenButtonProsess(true);
        if (res.data.data.status === 'WAITING_FOR_PAYMENT' && ableButtonProsess)
          setHiddenButtonProsess(false);
        if (res.data.data.status === 'CANCELED_BY_SYSTEM')
          setHiddenButtonProsess(true);
      });
    } else {
      setAppointmentDetail(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, isLoadAppointmentDetail]);

  useEffect(() => {
    dispatch(FilterHospitals([]));
    dispatch(FilterSpesialist([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (patientMessage) {
      setMessageAlert({
        text: patientMessage,
        type: 'success',
        direction: 'bottom',
      });
    }
  }, [patientMessage]);

  const handleMessageErrorSelect = value => {
    setMessageAlert({
      text: value,
      type: 'failed',
      direction: 'bottom',
    });
  };

  const closeModalWindow = () => {
    setModalWindowData({ visibility: false, text: '' });
  };

  const openFormAddressEdit = param => {
    setAddressId(param);
    setIsOpenAddresses(true);
    setDisplayFeaturePatient('FORM-ADDRESS');
  };

  const selectAddress = value => {
    setAddress(value);
    setDisplayFeaturePatient('FORM');
  };

  const handleCloseFormAddress = value => {
    setAddressId(null);
    setIsOpenAddresses(false);
    if (value) setAddressMessage(value.message);
    if (value && value.isOpenAddresses) setDisplayFeaturePatient('ADDRESSES');
    else setDisplayFeaturePatient('FORM');
  };

  const handleCloseFormPatient = value => {
    if (value) setPatientMessage(value.message);
    setDisplayFeaturePatient('');
  };

  const openFormEditPatient = item => {
    if (item) {
      dispatch(
        MemberAction({
          gender: item.gender,
          patientId: item.id,
          cardId: item.card_id,
          lastName: item.last_name,
          firstName: item.first_name,
          birthDate: item.birth_date,
          cardPhoto: item.card_photo,
          addressId: item.address_id,
          birthPlace: item.birth_place,
          nationality: item.nationality ? item.nationality.id : '',
          birthCountry: item.birth_country ? item.birth_country.id : '',
          insuranceNumber: item.insurance
            ? item.insurance.insurance_number
            : '',
          insuranceCompanyId: item.insurance
            ? item.insurance.insurance_company_id
            : '',
          insurancePlafonGroup: item.insurance
            ? item.insurance.insurance_plafon_group
            : '',
          familyRelationType: item.family_relation_type
            ? item.family_relation_type.id
            : '',
          contactEmail: item.contact_email,
          contactPhone: item.contact_phone,
        })
      );
      setDisplayFeaturePatient('FORM');
    }
  };

  const changeTab = value => {
    const condition = PatientSelectReducer && PatientSelectReducer.data;
    if (condition && value > 0) {
      setTab(value);
    } else if (value > 0) {
      setMessageAlert({
        type: 'failed',
        direction: 'bottom',
        text: 'Data pasien harus dipilih terlebih dahulu!',
      });
    }

    if (value < 1) setTab(value);
  };

  return (
    <div className="w-full h-full top-0 flex-col lg:absolute">
      {messageAlert ? (
        <AlertMessagePanel
          text={messageAlert.text}
          type={messageAlert.type}
          counter={value => setMessageAlert(value)}
          direction={
            messageAlert.direction
              ? messageAlert.direction
              : messageAlert.type === 'failed'
              ? 'bottom'
              : ''
          }
        />
      ) : (
        ''
      )}
      {modalWindowData.visibility ? (
        <ModalWindow
          text={modalWindowData.text}
          counterClose={() => closeModalWindow()}
        />
      ) : (
        ''
      )}
      {consultationModal ? (
        <ModalDefault
          text={`
                ${
                  ableButtonProsess
                    ? 'Apakah Anda yakin ingin memperbarui konsultasi?'
                    : 'Apakah Anda yakin yang ingin melanjutkan konsultasi ini ke pembayaran? Mohon periksa kembali untuk proses selanjutnya.'
                }
              `}
          buttonText="Batal"
          buttontextwhite="Yakin"
          counter={value => handleCounterModalDefaultConsultation(value)}
        />
      ) : (
        ''
      )}
      <div id="element-header-section-form-patient">
        {!disabledFromOrdered ? (
          <div
            className={`
                w-full py-2 px-2 flex items-center
                ${!hiddenButtonChevronLeft ? 'justify-between' : 'justify-end'}
              `}
          >
            {!hiddenButtonChevronLeft ? (
              <button
                className="flex items-center text-mainColor font-bold"
                onClick={() => counterButtonBack()}
              >
                <img
                  src={ChevronLeft}
                  alt="Chevron Left Icon"
                  className="inline mr-4 cursor-pointer"
                />
              </button>
            ) : (
              ''
            )}
            {!hiddenButtonProsess ? (
              <div className="">
                <ButtonDarkGrey
                  text={`${
                    ableButtonProsess
                      ? 'Perbarui Konsultasi'
                      : 'Lanjut ke Pembayaran'
                  }`}
                  counter={() => handleModalConsultation()}
                  backgroundColor={
                    buttonNextPayment ? 'bg-dark4' : 'bg-mainColor'
                  }
                  disabled={buttonNextPayment}
                  isLoading={isLoadingProccess}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
        <div className="w-full">
          {appointmentDetail && !disabledFromOrdered && (
            <div className="w-full">
              <LabelTitle
                text={`Order ID : ${appointmentDetail.order_code}`}
                redButton={
                  appointmentDetail &&
                  (appointmentDetail.status === 'CANCELED_BY_GP' ||
                    appointmentDetail.status === 'WAITING_FOR_PAYMENT')
                    ? ''
                    : {
                        text: 'Batal',
                        appointmentId: appointmentDetail.id,
                      }
                }
                counterRedButton={value => handleCounterRedButton(value)}
                status={appointmentDetail?.status}
                fontStyle="font-bold"
                label={appointmentDetail?.status_detail?.label || ''}
                styleComponentLabel={
                  !!appointmentDetail
                    ? (() => {
                        return {
                          backgroundColor: `${appointmentDetail.status_detail.bg_color}`,
                          color: `${appointmentDetail.status_detail.text_color}`,
                        };
                      })()
                    : ''
                }
                dimension="py-2 px-2"
                // buttonBack={() => counterButtonBack()}
              />
            </div>
          )}
        </div>
        <div className="w-full pt-2 px-2 bg-light3 text-dark2">
          <div className="flex">
            <button
              className={`font-bold text-xs ${
                tab === 0 ? 'border-b-2' : ''
              } border-solid border-info2 py-1 mr-5`}
              onClick={() => changeTab(0)}
            >
              Daftar Keluarga
            </button>
            <button
              className={`font-bold text-xs ${
                tab === 1 ? 'border-b-2' : ''
              } border-solid border-info2 py-1 mr-5`}
              onClick={() => changeTab(1)}
            >
              Pasien
            </button>
            <button
              className={`font-bold text-xs ${
                tab === 2 ? 'border-b-2' : ''
              } border-solid border-info2 py-1 mr-5`}
              onClick={() => changeTab(2)}
            >
              Note
            </button>
            {!disabledFromOrdered ? (
              <button
                className={`font-bold text-xs ${
                  tab === 3 ? 'border-b-2' : ''
                } border-solid border-info2 py-1`}
                onClick={() => changeTab(3)}
              >
                Spesialis
              </button>
            ) : (
              ''
            )}
            {disabledFromOrdered ? (
              <button
                className="ml-auto my-auto"
                onClick={() =>
                  counterCloseFromOrderedFormPatien !== ''
                    ? counterCloseFromOrderedFormPatien()
                    : {}
                }
              >
                <img src={AlertClose} alt="Alert Close Icon" />
              </button>
            ) : (
              ''
            )}
          </div>
          {tab === 0 ? (
            <div className="py-1">
              <button
                onClick={() => setDisplayFeaturePatient('FORM')}
                className="text-xs font-bold text-mainColor"
              >
                + TAMBAH
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      {tab === 0 ? (
        <div className="flex-1 h-full flex flex-wrap overflow-y-auto scroll-small border-l border-solid border-light3 relative">
          <FamilyMemberList
            patientMessage={patientMessage}
            disableCheckbox={
              type === 'missed-call' &&
              appointmentDetail &&
              (appointmentDetail.status === 'CANCELED_BY_GP' ||
                appointmentDetail.status === 'CANCELED_BY_SYSTEM')
            }
            clearPatientMessage={() => setPatientMessage(null)}
            openFormEditPatient={item => openFormEditPatient(item)}
            messageErrorSelect={value => handleMessageErrorSelect(value)}
            userId={UserSelectReducer?.data?.id || null}
          />
        </div>
      ) : (
        ''
      )}
      {tab !== 0 ? (
        <div
          className="flex-1 h-full flex flex-wrap overflow-y-auto scroll-small border-l border-solid border-light3 relative"
          style={{ height: sectionHeight + 'px' }}
        >
          {tab === 1 ? (
            <>
              {/* {
                  !sectionEditProfile
                    ? ( */}
              <div className="relative w-full flex flex-wrap py-5 px-2">
                {patientData ? (
                  <>
                    <div className={`xl:w-10/12 w-9/12 self-start`}>
                      {
                        <PatientScreen
                          age={patientData.age}
                          photo={patientData.photo}
                          email={patientData.email}
                          phone={patientData.phone}
                          gender={patientData.gender}
                          cardId={patientData.cardId || '-'}
                          address={patientData.address}
                          lastName={patientData.lastName}
                          birthDate={patientData.birthDate}
                          firstName={patientData.firstName}
                          contactEmail={patientData.contactEmail}
                          contactPhone={patientData.contactPhone}
                        />
                      }
                    </div>
                    <div className="xl:w-2/12 w-3/12 pb-2">
                      <div className="flex flex-wrap justify-end">
                        {(!appointmentDetail && type !== 'missed-call') ||
                        (type !== 'missed-call' &&
                          appointmentDetail &&
                          (appointmentDetail.status === 'NEW' ||
                            appointmentDetail.status === 'PROCESS_GP')) ? (
                          patientData.address !== '-' &&
                          patientData.cardId !== '' ? (
                            <button
                              className={`border border-solid border-darker text-darker rounded py-1 px-2 text-sm`}
                              onClick={() =>
                                openFormEditPatient(
                                  PatientSelectReducer?.data || null
                                )
                              }
                            >
                              Ubah
                            </button>
                          ) : (
                            // <button
                            //   className={`mt-28 border border-solid border-mainColor text-mainColor rounded py-1 px-1 xl:text-xs text-xxs`}
                            //   onClick={() => setsectionDataPatientSearch(true)}>Check Data Pasien</button>
                            ''
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </div>
              {/* ) : ''
                } */}
              {/* {
                  sectionEditProfile
                    ? <FormPatient isFromMissedCall={type === "missed-call"} />
                    : ''
                } */}
            </>
          ) : (
            ''
          )}
          {tab === 2 ? (
            <FormNotePatient
              isEnableUpdateAppointment={isEnableUpdateAppointment}
              isDisableInput={
                appointmentDetail &&
                type === 'missed-call' &&
                (appointmentDetail.status === 'CANCELED_BY_GP' ||
                  appointmentDetail.status === 'CANCELED_BY_SYSTEM')
              }
              isFromMissedCall={type === 'missed-call'}
              ableButtonProsess={ableButtonProsess}
              counterCloseFromOrderedFormPatient={
                counterCloseFromOrderedFormPatien
              }
            />
          ) : (
            ''
          )}
          {tab === 3 ? (
            <DoctorSpesialist
              hiddenButtonChangeSpecialist={
                appointmentDetail &&
                type === 'missed-call' &&
                (appointmentDetail.status === 'CANCELED_BY_GP' ||
                  appointmentDetail.status === 'CANCELED_BY_SYSTEM')
              }
              sectionHeight={sectionHeight}
              isFromMissedCall={type === 'missed-call'}
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      {displayFeaturePatient ? (
        <div className="w-full h-full absolute z-10 top-0 bg-white">
          {
            <FormPatientMember
              formPatientMessage={formPatientMessage}
              addressSelected={address}
              removeAddressSelect={() => setAddress(null)}
              isShowing={displayFeaturePatient === 'FORM'}
              handlerClose={value => handleCloseFormPatient(value)}
              openAddresses={() => setDisplayFeaturePatient('ADDRESSES')}
              openFormAddress={() => setDisplayFeaturePatient('FORM-ADDRESS')}
              openCheckDataPatient={() =>
                setDisplayFeaturePatient('CHECK-DATA-PATIENT')
              }
            />
          }
          {displayFeaturePatient === 'FORM-ADDRESS' ? (
            <FormAddress
              addressId={addressId}
              isOpenAddresses={isOpenAddresses}
              userId={UserSelectReducer?.data?.id || null}
              handlerClose={value => handleCloseFormAddress(value)}
            />
          ) : (
            ''
          )}
          {
            <Addresses
              addressMessage={addressMessage}
              selectAddress={value => selectAddress(value)}
              isShowing={displayFeaturePatient === 'ADDRESSES'}
              clearAddressMessage={() => setAddressMessage(null)}
              handlerClose={() => setDisplayFeaturePatient('FORM')}
              openFormAddress={params => openFormAddressEdit(params)}
            />
          }
          {displayFeaturePatient === 'CHECK-DATA-PATIENT' ? (
            <FormCheckDataPatient
              handlerClose={() => setDisplayFeaturePatient('FORM')}
              handlerMessage={value => setFormPatientMessage(value)}
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      {/* {
        sectionDataPatientSearch
          ? (
            <>
              <div className="fixed w-full h-full z-10 left-0 top-0" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}></div>
              <div className="absolute w-full bottom-0 left-0 bg-white z-20" style={{ height: sectionHeight+"px"}}>
                <DataPatientSearch
                  userId={UserSelectReducer && UserSelectReducer.data ? UserSelectReducer.data.id : ""}
                  type="call"
                  counterFillAddress={(value) => handleFillAddress(value)}
                />
              </div>
            </>
          ) : ''
      } */}
      {modalCanceled.status ? (
        <Canceled
          type="cancel"
          appointmentId={modalCanceled.appointmentId}
          counterWithFormNote={value => handleCounterWithFormNote(value)}
          counter={value => handleCounterModalCanceled(value)}
          counterCloseModal={() => handleCloseModalCancel()}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default SectionFormPatient;
