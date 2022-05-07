import moment from 'moment';
import { connect } from 'react-redux';
import { Api } from '../../../helpers/api';
import { dayFormat } from '../../../helpers/dateFormat';
import { LocalStorage } from '../../../helpers/localStorage';
import { SectionFormPatient } from '../../molecules/patient';
import PatientScreen from '../../molecules/patient/Patient';
import { LabelTitle, ButtonTextAndBorderBlue } from '../../atoms';
import { Canceled, AlertMessagePanel, ModalDefault, ModalWindow } from '../../molecules/modal';
import { PatientSelectAction } from '../../../modules/actions/user/userData__Action';

import { React, useState, useEffect } from '../../../libraries';

import {
  TriggerUpdate,
  DocumentUpdate,
  UserDataSelected,
  CleanParamsAppointment,
  CreateParamsAppointment,
} from '../../../modules/actions';

import {
  StatusList,
  LoadingComponent,
  EmptyData,
  MedicalResume,
  DoctorSpesialistList,
  ScheduleSpesialist,
  CurrentAndCheckMedicalRecord,
} from '../../molecules';

import { ClockIcon, CalenderIcon } from '../../../assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertBytes, deleteDocument, uploadDocument } from 'helpers/document';
import { truncateString } from 'helpers/stringManipulation';

const OrderedConsultation = props => {
  const {
    enableRefund,
    refferenceId,
    TriggerUpdate,
    TriggerReducer,
    DocumentUpdate,
    UserDataSelected,
    counterReloadList,
    HeightElementReducer,
    CreateParamsAppointment,
    CleanParamsAppointment,
    ParamCreateAppointment,
    PatientSelectAction,
    type,
    isEnableUpdateAppointment = false,
  } = props;

  const storedRole = LocalStorage('role');
  const [role, setRole] = useState(storedRole);
  useEffect(() => setRole(storedRole), [storedRole]);

  const [loadData, setLoadData] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [heightContent, setHeightContent] = useState(0);
  const [appointmentId, setAppointmentId] = useState('');
  const [sectionThirdHeight, setSectionThirdHeight] = useState(0);
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const [sectionUpdateData, setSectionUpdateData] = useState(false);
  const [sectionMedicalResume, setSectionMedicalResume] = useState(false);
  const [sectionChangeSchedule, setSectionChangeSchedule] = useState(false);
  const [sectionCheckMedicalRecord, setSectionCheckMedicalRecord] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [sectionChangeSpesialis, setSectionChangeSpesialis] = useState(false);
  const [modal, setModal] = useState(null);
  const [actionMenus, setActionMenus] = useState([]);
  const [enableUpdateAppointment, setEnableUpdateAppointment] = useState(isEnableUpdateAppointment);
  const [modalWindowData, setModalWindowData] = useState({
    visibility: false,
    text: '',
  });

  const [modalCanceled, setModalCanceled] = useState({
    status: false,
    appointmentId: null,
  });

  // upload document state
  const [uploadedFile, setUploadedFile] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [enableCRUD, setEnableCRUD] = useState(false); // for conditional validation on CRUD feature

  useEffect(() => {
    if (HeightElementReducer) {
      const heightHeaderThird = document.getElementById('panel-header-third').clientHeight;
      setHeightContent(HeightElementReducer.heightElement);
      setSectionThirdHeight(
        parseInt(HeightElementReducer.heightElement) - parseInt(heightHeaderThird)
      );
    }
  }, [HeightElementReducer]);

  useEffect(() => {
    if (TriggerReducer !== null && TriggerReducer.appointmentStatus) {
      setEnableUpdateAppointment(
        ['WAITING_FOR_PAYMENT', 'PAID'].includes(TriggerReducer.appointmentStatus)
      );
    }

    if (TriggerReducer !== null && TriggerReducer.AppointmentId) {
      setAppointmentId(TriggerReducer.AppointmentId);
      TriggerUpdate(null);
    }

    if (TriggerReducer !== null && TriggerReducer.updateAppointmentTrigger) {
      Api.patch(
        `/appointment/v1/consultation/${ParamCreateAppointment.appointment_id}`,
        ParamCreateAppointment,
        {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        }
      )
        .then(res => {
          if (counterReloadList) {
            counterReloadList();
          }
          setLoadData(!loadData);
          TriggerUpdate({ refreshListAppointment: true });
          TriggerUpdate({ refreshAppointmentTemporary: true });
        })
        .catch(function (error) {
          if (error.response) {
            setMessageAlert({
              text: error.response.data.message,
              type: 'failed',
            });
          }
        });
      if (TriggerReducer.closeSpesialistListOrdered) {
        setSectionChangeSpesialis(false);
      }
      TriggerUpdate(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer]);

  useEffect(() => {
    setLoadingDetail(true);
    let id = '';
    if (appointmentId !== '') {
      id = appointmentId;
    } else if (refferenceId !== '') {
      id = refferenceId;
    }
    if (id) {
      Api.get(`/appointment/v1/consultation/${id}`, {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      })
        .then(res => {
          setAppointmentDetail(res.data.data);

          // check patient order status
          const status = res.data.data.status;
          if (
            status.includes('WAITING_FOR_PAYMENT') ||
            status.includes('PAID') ||
            status.includes('MEET_SPECIALIST')
          ) {
            // if conditions is valid, PRO able to CRUD for medical document
            setEnableCRUD(true);
          } else {
            setEnableCRUD(false);
          }
          setLoadingDetail(false);
        })
        .catch(function (error) {
          setLoadingDetail(false);
        });

      return;
    }

    setAppointmentDetail(null);
    setLoadingDetail(false);
  }, [appointmentId, refferenceId, loadData]);

  useEffect(() => {
    if (appointmentDetail) {
      PatientSelectAction(appointmentDetail.patient ? appointmentDetail.patient : null);
      UserDataSelected(appointmentDetail.parent_user ? appointmentDetail.parent_user : null);
      configureActionMenu();

      if (appointmentDetail.patient) {
        const birthDate =
          appointmentDetail.patient.birthdate || appointmentDetail.patient.birth_date;
        const phone = appointmentDetail.patient.phone_number || appointmentDetail.patient.phone;
        let addressData = appointmentDetail.patient.address_raw
          ? appointmentDetail.patient.address_raw[0]
          : null;

        if (!addressData) {
          addressData = {
            street: appointmentDetail.patient.street,
            rt_rw: appointmentDetail.patient.rt_rw,
            sub_district: appointmentDetail.patient.sub_district,
            district: appointmentDetail.patient.district,
            city: appointmentDetail.patient.city,
            province: appointmentDetail.patient.province,
          };
        }

        setPatientData({
          id: appointmentDetail.patient.id,
          age: appointmentDetail.patient.age,
          email: appointmentDetail.patient.email,
          phone: phone,
          cardId: appointmentDetail.patient.card_id,
          lastName: appointmentDetail.patient.last_name,
          birthDate: birthDate,
          firstName: appointmentDetail.patient.first_name,
          gender: appointmentDetail.patient.gender === 'MALE' ? 'Laki-laki' : 'Perempuan',
          photo: appointmentDetail.patient.card_photo
            ? appointmentDetail.patient.card_photo.url
            : '',
          address: `${addressData.street},
            Blok RT/RW ${addressData.rt_rw}
            kel.${addressData.sub_district ? addressData.sub_district.name : ''}
            Kec.${addressData.district ? addressData.district.name : ''}
            ${addressData.city ? addressData.city.name : ''}
            ${addressData.province ? addressData.province.name : ''}`,
          contactEmail: appointmentDetail.patient.contact_email,
          contactPhone: appointmentDetail.patient.contact_phone,
        });
      } else {
        setPatientData(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentDetail]);

  const counterButtonBack = () => {
    setAppointmentDetail(null);
    setAppointmentId('');
  };

  const configureActionMenu = () => {
    setActionMenus([]);
    const tempActionMenus = [];
    if (role === 'PRO') {
      tempActionMenus.push({
        title: 'Check Medical Record',
        action: () => handleCounterCheckMedicalRecord(),
      });
    }

    if (
      ['PAID', 'ON_GOING', 'WAITING_FOR_MEDICAL_RESUME'].includes(appointmentDetail.status) &&
      role === 'PRO'
    ) {
      tempActionMenus.push({
        title: 'Set Meet Specialist',
        action: () => {
          setModal({
            title: 'Set Meet Specialist',
            description: 'Apakah PRO yakin untuk melakukan Set Meet Specialist?',
            cancelButton: 'Batal',
            actionButton: 'Ya',
            action: () => processSetMeetSpecialist(),
          });
        },
      });
    }

    if (
      ['PAID', 'MEET_SPECIALIST'].includes(appointmentDetail.status) &&
      (role === 'MA' || role === 'PRO')
    ) {
      tempActionMenus.push({
        title: 'Ubah Jadwal',
        action: () => handleCounterChangeSchedule(true),
      });
      tempActionMenus.push({
        title: 'Ubah Spesialis',
        action: () => handleCounterChangeSpesialis(true),
      });
    }

    if (appointmentDetail.status === 'ON_GOING' && role === 'PRO') {
      tempActionMenus.push({
        title: 'Selesai',
        action: () => {
          setModal({
            description: 'Apakah Anda yakin yang ingin menyelesaikan konsultasi ini?',
            cancelButton: 'Batal',
            actionButton: 'Yakin',
            action: () => processFinishMeetSpecialist(),
          });
        },
      });
    }

    if (
      ['PAID', 'MEET_SPECIALIST', 'ON_GOING', 'WAITING_FOR_MEDICAL_RESUME'].includes(
        appointmentDetail.status
      ) &&
      role === 'PRO'
    ) {
      tempActionMenus.push({
        title: 'Create Appointment External',
        action: () => {
          setModal({
            title: 'Create Appointment External',
            description: 'Apakah PRO yakin untuk melakukan Create Appointment External?',
            cancelButton: 'Batal',
            actionButton: 'Ya',
            action: () => processCreateAppointmentExternal(),
          });
        },
      });
      tempActionMenus.push({
        title: 'Create Case External',
        action: () => {
          setModal({
            title: 'Create Case External',
            description: 'Apakah PRO yakin untuk melakukan Create Case External?',
            cancelButton: 'Batal',
            actionButton: 'Ya',
            action: () => processCreateCaseExternal(),
          });
        },
      });
      tempActionMenus.push({
        title: 'Cancel Appointment External',
        action: () => {
          setModal({
            title: 'Cancel Appointment External',
            description: 'Apakah PRO yakin untuk melakukan Cancel Appointment External?',
            cancelButton: 'Batal',
            actionButton: 'Ya',
            action: () => processCancelAppointmentExternal(),
          });
        },
      });
    }

    setActionMenus(tempActionMenus);
  };

  const handleCounterRedButton = value => {
    setModalCanceled({
      status: true,
      appointmentId: value,
    });
  };

  const handleCloseModalCancel = () => {
    setModalCanceled({
      status: false,
      appointmentId: '',
    });
  };

  const handleCounterWithFormNote = () => {};

  const handleCounterModalCanceled = value => {
    if (value.status) {
      let urlProccess;
      if (enableRefund) {
        urlProccess = '/appointment/v1/consultation/refund';
      } else {
        urlProccess = '/appointment/v1/consultation/cancel';
      }
      Api.post(
        `${urlProccess}`,
        { appointment_id: value.appointmentId, note: value.note },
        {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        }
      )
        .then(res => {
          setModalCanceled({
            status: false,
            appointmentId: '',
          });
          setLoadData(!loadData);
          TriggerUpdate({
            refreshAppointmentTemporary: true,
            refreshAppointmentTemporaryCancel: true,
            refreshListAppointment: true,
          });
        })
        .catch(function (error) {
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
      setModalCanceled({
        status: false,
        appointmentId: '',
      });
    }
  };

  const createParamsReducerAppointment = () => {
    if (appointmentDetail !== null) {
      CleanParamsAppointment();
      DocumentUpdate(appointmentDetail.medical_document);
      const medicalDocumentDataUpdate = [];
      if (appointmentDetail.medical_document !== null) {
        appointmentDetail.medical_document.forEach((res, idx) => {
          medicalDocumentDataUpdate[idx] = `${res.file_id}`;
        });
      }
      const symptomNoteData =
        appointmentDetail.symptom_note !== null ? appointmentDetail.symptom_note : '';
      const ParamCreateAppointmentData = {
        appointment_id: appointmentDetail.id,
        doctor_id: appointmentDetail.doctor.id,
        user_id: appointmentDetail.user_id,
        patient_id: appointmentDetail.patient_id,
        symptom_note: symptomNoteData,
        schedules: [
          {
            code: appointmentDetail.schedule.code,
            date: appointmentDetail.schedule.date,
            time_start: moment(appointmentDetail.schedule.time_start, 'HH:mm:ss').format('HH:mm'),
            time_end: moment(appointmentDetail.schedule.time_end, 'HH:mm:ss').format('HH:mm'),
          },
        ],
        document_resume: medicalDocumentDataUpdate,
      };
      CreateParamsAppointment(ParamCreateAppointmentData);
    }
  };

  const handleCounterCheckMedicalRecord = () => {
    // createParamsReducerAppointment();
    setSectionCheckMedicalRecord(true);
  };

  const handleCounterChangeSpesialis = () => {
    createParamsReducerAppointment();
    setSectionChangeSpesialis(true);
  };

  const handleCounterChangeSchedule = () => {
    createParamsReducerAppointment();
    setSectionChangeSchedule(true);
  };

  const handleCounterUpdateData = () => {
    UserDataSelected(null);
    PatientSelectAction(null);
    createParamsReducerAppointment();

    if (appointmentDetail) {
      PatientSelectAction(appointmentDetail.patient ? appointmentDetail.patient : null);
      UserDataSelected(appointmentDetail.parent_user ? appointmentDetail.parent_user : null);
    }
    setSectionUpdateData(true);
  };

  const processSetMeetSpecialist = async () => {
    try {
      const response = await Api.post(
        '/appointment/v1/manual-process/set-meet-specialist',
        { appointment_ref_id: appointmentDetail.order_code },
        {
          headers: {
            Authorization: `Bearer ${LocalStorage('access_token')}`,
          },
        }
      );

      setLoadData(!loadData);
      setMessageAlert({ text: response.data.message, type: 'success' });
      setModal(null);
      TriggerUpdate({ refreshListAppointment: true });
    } catch (error) {
      setMessageAlert({ text: error.response.data.message, type: 'failed' });
      setModal(false);
    }
  };

  const processCreateAppointmentExternal = async () => {
    try {
      const response = await Api.post(
        '/appointment/v1/manual-process/create-appointment-external',
        { appointment_ref_id: appointmentDetail.order_code },
        {
          headers: {
            Authorization: `Bearer ${LocalStorage('access_token')}`,
          },
        }
      );

      setLoadData(!loadData);
      setMessageAlert({ text: response.data.message, type: 'success' });
      setModal(null);
      TriggerUpdate({ refreshListAppointment: true });
    } catch (error) {
      setMessageAlert({ text: error.response.data.message, type: 'failed' });
      setModal(false);
    }
  };

  const processCreateCaseExternal = async () => {
    try {
      const response = await Api.post(
        '/appointment/v1/manual-process/create-case-external',
        { appointment_ref_id: appointmentDetail.order_code },
        {
          headers: {
            Authorization: `Bearer ${LocalStorage('access_token')}`,
          },
        }
      );

      setLoadData(!loadData);
      setMessageAlert({ text: response.data.message, type: 'success' });
      setModal(null);
      TriggerUpdate({ refreshListAppointment: true });
    } catch (error) {
      setMessageAlert({ text: error.response.data.message, type: 'failed' });
      setModal(false);
    }
  };

  const processCancelAppointmentExternal = async () => {
    try {
      const response = await Api.post(
        '/appointment/v1/manual-process/cancel-appointment-external',
        { appointment_ref_id: appointmentDetail.order_code },
        {
          headers: {
            Authorization: `Bearer ${LocalStorage('access_token')}`,
          },
        }
      );

      setLoadData(!loadData);
      setMessageAlert({ text: response.data.message, type: 'success' });
      setModal(null);
      TriggerUpdate({ refreshListAppointment: true });
    } catch (error) {
      setMessageAlert({ text: error.response.data.message, type: 'failed' });
      setModal(false);
    }
  };

  const processFinishMeetSpecialist = value => {
    Api.get(`/appointment/v1/consultation/${appointmentId}/finish-meet-specialist`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(res => {
        endProsessCounterDefault(true, 'Berhasil mengubah status', 'success');
      })
      .catch(function (error) {
        endProsessCounterDefault(false, error.response.data.message, 'failed');
      });
  };

  const endProsessCounterDefault = (status, message, type) => {
    if (status) setLoadData(!loadData);
    setMessageAlert({ text: message, type: type });
    setModal(null);
  };

  // get medical document
  const getMedicalDocument = async () => {
    await Api.get(`/appointment/v1/consultation/${appointmentId}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(res => {
        setAppointmentDetail(res.data.data);
      })
      .catch(error => {
        throw error;
      });
  };

  // open doc file
  const handleViewFile = value => {
    window.open(value, '_blank');
  };

  // upload doc file
  const uploadDocFile = () => {
    document.getElementById('uploadDocument').click();
  };

  // onchange input type file
  const handleUploadFile = async e => {
    let file = e.target.files[0];
    if (file === undefined) return; // if user not selected any file
    const fileType = file.type;
    const fileSize = file.size;
    const validFileFormat = [
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];

    // file size exceed limit
    if (fileSize >= 10240000) {
      setMessageAlert({
        type: 'failed',
        text: 'File hanya bisa di upload maximum 10 MB',
      });
      return false;
    }
    // file format invalid
    if (validFileFormat.indexOf(fileType) === -1) {
      setMessageAlert({
        type: 'failed',
        text: 'File hanya dapat berbentuk gambar atau PDF',
      });
      return false;
    }

    // file valid
    const formData = new FormData();
    formData.append('file', file, file.name);
    // start uploading file
    setUploadProgress(0);
    setUploadedFile(file);
    await uploadDocument(appointmentId, formData, event => {
      const progress = Math.round((100 * event.loaded) / event.total);
      setUploadProgress(progress);
    });
    setUploadProgress(0);
    // re-fetch doc after upload file
    getMedicalDocument();
  };

  // delete document
  const handleDeleteDocument = async docID => {
    await deleteDocument(appointmentId, docID);
    // re-fetch doc after upload file
    getMedicalDocument();
  };

  const closeModalWindow = () => {
    setModalWindowData({ visibility: false, text: '' });
  };

  return (
    <div
      className="justify-self-start relative"
      style={{ height: !!heightContent ? `${heightContent}px` : '' }}
    >
      {modal && (
        <ModalDefault
          heading={modal?.title}
          text={modal?.description}
          buttonText={modal?.cancelButton}
          buttontextwhite={modal?.actionButton}
          counter={value => {
            if (!value) {
              setModal(null);
              return;
            }
            modal?.action?.();
          }}
        />
      )}
      {modalWindowData?.visibility && (
        <ModalWindow text={modalWindowData.text} counterClose={() => closeModalWindow()} />
      )}
      <div id="panel-header-third" className="w-full">
        <LabelTitle
          text={`Order ID : ${appointmentDetail?.order_code || ''}`}
          label={`${appointmentDetail?.status_detail?.label || ''}`}
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
          redButton={{
            text: 'Batal',
            appointmentId: appointmentDetail?.id || '',
          }}
          counterRedButton={value => handleCounterRedButton(value)}
          status={appointmentDetail?.status || ''}
          fontStyle="font-bold"
          buttonBack={() => counterButtonBack()}
        />
      </div>
      {!loadingDetail && appointmentDetail && (
        <div
          className="w-full overflow-y-auto scroll-small relative"
          style={{
            height: !!sectionThirdHeight ? `${sectionThirdHeight}px` : '',
          }}
        >
          <div className="overflow-y-auto scroll-small w-full">
            {/* Appointment detail */}
            <div className="flex justify-between">
              {/* Left section */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex mb-2">
                  <div className="w-1/6 h-20 bg-gray-300 rounded-sm mr-5">
                    {appointmentDetail?.doctor?.photo?.formats?.small && (
                      <img
                        src={appointmentDetail?.doctor?.photo?.formats?.small}
                        alt="Doctor Profile"
                        className="object-cover w-full h-full rounded-sm"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-xs mb-1">
                      {appointmentDetail?.doctor?.hospital && (
                        <>
                          <img
                            src={appointmentDetail?.doctor?.hospital?.logo}
                            alt="Logo Hospital"
                            className="w-8 inline mr-2"
                          />
                          {appointmentDetail?.doctor?.hospital?.name}
                        </>
                      )}
                    </p>
                    <p className="font-bold mb-1">{appointmentDetail?.doctor?.name || ''}</p>
                    <p className="text-sm mb-1">
                      Sp. {appointmentDetail?.doctor?.specialist?.name || ''}
                    </p>
                  </div>
                </div>
                <div>
                  {appointmentDetail?.schedule && (
                    <div className="w-full py-1 text-sm bg-white" style={{ color: '#6B7588' }}>
                      <img src={CalenderIcon} alt="Calender Icon" className="inline mr-3" />
                      {appointmentDetail.schedule
                        ? `${dayFormat(moment(appointmentDetail.schedule.date).day())}, ${moment(
                            appointmentDetail.schedule.date
                          ).format('DD MMM Y')}`
                        : 'Schedule Tidak Ditemukan'}
                    </div>
                  )}
                  {appointmentDetail?.schedule && (
                    <div className="w-full py-1 text-sm bg-white" style={{ color: '#6B7588' }}>
                      <img src={ClockIcon} alt="Calender Icon" className="inline mr-3" />
                      {`${moment(appointmentDetail.schedule.time_start, 'HH:mm:ss').format(
                        'HH:mm'
                      )} - ${moment(appointmentDetail.schedule.time_end, 'HH:mm:ss').format(
                        'HH:mm'
                      )}`}
                    </div>
                  )}
                </div>
              </div>
              {/* Right section */}
              <div className="flex flex-col py-2">
                {actionMenus.length > 0 && (
                  <div className="text-sm font-bold text-dark1 py-2 px-6">Action Menu</div>
                )}
                {actionMenus.map((actionMenu, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-info1 py-2 px-6 cursor-pointer"
                    onClick={() => actionMenu?.action?.()}
                  >
                    {actionMenu.title}
                  </div>
                ))}
                {sectionChangeSpesialis && (
                  <div
                    className="fixed w-full h-full inset-0 z-10"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <div
                      className="w-2/6 h-full absolute right-0 bottom-0 bg-white"
                      style={{
                        height: !!heightContent ? `${heightContent}px` : '',
                      }}
                    >
                      <DoctorSpesialistList
                        sectionHeight={heightContent}
                        disabledFromOrdered={true}
                        counterCloseFromOrderedDoctorSpesialistList={() =>
                          setSectionChangeSpesialis(false)
                        }
                      />
                    </div>
                  </div>
                )}
                {sectionCheckMedicalRecord && (
                  <div
                    className="fixed w-full h-full inset-0 z-10"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <div
                      className="w-2/6 h-full absolute right-0 bottom-0 bg-white"
                      style={{
                        height: !!heightContent ? `${heightContent}px` : '',
                      }}
                    >
                      <CurrentAndCheckMedicalRecord
                        payload={{
                          userId: appointmentDetail?.user_id,
                          appointmentId: appointmentDetail?.id,
                          patientId: appointmentDetail?.patient?.id,
                          cardId: appointmentDetail?.patient?.card_id,
                          firstName: appointmentDetail?.patient?.first_name,
                          lastName: appointmentDetail?.patient?.last_name,
                          birthDate:
                            appointmentDetail?.patient?.birthdate ||
                            appointmentDetail?.patient?.birth_date,
                          gender: appointmentDetail?.patient?.gender,
                        }}
                        handleClose={() => setSectionCheckMedicalRecord(false)}
                      />
                    </div>
                  </div>
                )}
                {sectionChangeSchedule && (
                  <div
                    className="fixed w-full h-full inset-0 z-10"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <div
                      className="w-2/6 h-full absolute right-0 bottom-0 bg-white"
                      style={{
                        height: !!heightContent ? `${heightContent}px` : '',
                      }}
                    >
                      <ScheduleSpesialist
                        doctorSelect={appointmentDetail?.doctor?.id || ''}
                        disabledFromOrdered={true}
                        counterCloseFromOrderedSchedule={() => setSectionChangeSchedule(false)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Patient detail */}
            <div
              className="w-full py-2 px-5 font-bold text-sm"
              style={{ backgroundColor: '#F2F2F5', color: '#6B7588' }}
            >
              Pasien
            </div>
            {appointmentDetail?.user && (
              <div className="w-full p-5 flex flex-wrap items-start">
                <div className="w-4/6">
                  <PatientScreen
                    age={patientData.age}
                    photo={patientData.photo}
                    email={patientData.email}
                    phone={patientData.phone}
                    gender={patientData.gender}
                    cardId={patientData.cardId}
                    address={patientData.address}
                    lastName={patientData.lastName}
                    birthDate={patientData.birthDate}
                    firstName={patientData.firstName}
                    contactEmail={patientData.contactEmail}
                    contactPhone={patientData.contactPhone}
                  />
                  {/* <SimpleBioAppointment data={appointmentDetail.user} /> */}
                </div>
                <div className="w-2/6 flex flex-wrap items-center justify-end relative">
                  {['PAID'].includes(appointmentDetail.status) && (
                    <ButtonTextAndBorderBlue
                      text="Edit Data"
                      dimesion="w-40 p-2"
                      value={true}
                      counter={() => handleCounterUpdateData()}
                    />
                  )}
                  {sectionUpdateData && (
                    <div
                      className="fixed w-full h-full inset-0 z-10"
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                      <div
                        className="w-2/6 h-full absolute right-0 bottom-0 bg-white"
                        style={{
                          height: !!heightContent ? `${heightContent}px` : '',
                        }}
                      >
                        <SectionFormPatient
                          counterCloseFromOrderedFormPatien={() => setSectionUpdateData(false)}
                          disabledFromOrdered={true}
                          isEnableUpdateAppointment={enableUpdateAppointment}
                        />
                      </div>
                    </div>
                  )}
                  {(appointmentDetail?.status === 'WAITING_FOR_MEDICAL_RESUME' ||
                    appointmentDetail?.status === 'COMPLETED') && (
                    <>
                      <ButtonTextAndBorderBlue
                        text={type ? 'Lihat Resume Medis' : 'Check memo Altea'}
                        dimesion="p-2 mb-5"
                        value={true}
                        counter={() => setSectionMedicalResume(true)}
                      />
                      {sectionMedicalResume && (
                        <MedicalResume
                          open={sectionMedicalResume}
                          counterClose={value => setSectionMedicalResume(value)}
                          heightContent={heightContent}
                          appointmentId={appointmentId}
                        />
                      )}
                      {/* <div className="w-full flex justify-end text-sm">
                           <a href={`mailto:${appointmentDetail.user.email}`}><img src={MailIcon} alt="Mail Icon" className="inline mr-2" />Kirim Email</a>
                         </div> */}
                    </>
                  )}
                </div>
              </div>
            )}
            <LabelTitle text="Catatan" fontStyle="font-bold" />
            <div className="w-full px-5 lg:py-5 pt-5 flex flex-wrap items-start">
              <div className="flex flex-wrap items-start text-sm mb-2 text-dark3">
                <div className="w-full mb-2">Note :</div>
                <div className="w-full h-full">
                  {appointmentDetail && appointmentDetail.symptom_note ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: appointmentDetail?.symptom_note?.replace(
                          /(?:\r\n|\r|\n)/g,
                          '<br/>'
                        ),
                      }}
                    ></span>
                  ) : (
                    'Tidak ada catatan'
                  )}
                </div>
              </div>
            </div>
            {appointmentDetail && (
              <div className="w-full">
                <LabelTitle text="Informasi" fontStyle="font-bold" />
                <div className="w-full px-5 py-4">
                  <div
                    className="flex flex-wrap items-start text-sm mb-2"
                    style={{ color: '#8F90A6' }}
                  >
                    <div className="w-4/12 flex">
                      Patient ID <span className="ml-auto">:</span>
                    </div>
                    <div className="w-8/12 px-3 break-words">
                      {appointmentDetail.external_patient_id || '-'}
                    </div>
                  </div>
                  <div
                    className="flex flex-wrap items-start text-sm mb-2"
                    style={{ color: '#8F90A6' }}
                  >
                    <div className="w-4/12 flex">
                      Appointment ID <span className="ml-auto">:</span>
                    </div>
                    <div className="w-8/12 px-3 break-words">
                      {appointmentDetail.external_appointment_id || '-'}
                    </div>
                  </div>
                  <div
                    className="flex flex-wrap items-start text-sm mb-2"
                    style={{ color: '#8F90A6' }}
                  >
                    <div className="w-4/12 flex">
                      Case No <span className="ml-auto">:</span>
                    </div>
                    <div className="w-8/12 px-3 break-words">
                      {appointmentDetail.external_case_no || '-'}
                    </div>
                  </div>
                  <div
                    className="flex flex-wrap items-start text-sm mb-2"
                    style={{ color: '#8F90A6' }}
                  >
                    <div className="w-4/12 flex">
                      Appointment Error <span className="ml-auto">:</span>
                    </div>
                    <div className="w-8/12 px-3 break-words">
                      {appointmentDetail.external_appointment_error || '-'}
                    </div>
                  </div>
                  <div
                    className="flex flex-wrap items-start text-sm mb-2"
                    style={{ color: '#8F90A6' }}
                  >
                    <div className="w-4/12 flex">
                      Case Error <span className="ml-auto">:</span>
                    </div>
                    <div className="w-8/12 px-3 break-words">
                      {appointmentDetail.external_case_error || '-'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <LabelTitle text="Dokumen Lampiran" fontStyle="font-bold" />
            <div className="w-full py-3 px-8">
              <div className="w-full flex flex-col text-sm my-2">
                {appointmentDetail !== null &&
                  appointmentDetail.medical_document.length > 0 &&
                  // data available
                  appointmentDetail.medical_document.map((res, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex flex-row justify-between border-b py-4 border-gray-100 text-xs"
                      >
                        <p className="font-semibold">{truncateString(res.original_name)}</p>
                        <div className="flex flex-row items-center gap-x-5">
                          <p className="text-right text-dark3">{res.size}</p>
                          <button
                            className="text-sm text-mainColor"
                            onClick={() => handleViewFile(res.url)}
                          >
                            Lihat
                          </button>
                          {/* conditional rendering */}
                          {enableCRUD && (
                            <button
                              className="font-semibold text-sm text-error1"
                              onClick={() => handleDeleteDocument(res.id)}
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {/* uploading document progress */}
                {uploadProgress > 0 && (
                  <div className="flex flex-row justify-between border-b py-4 border-gray-100 text-xs">
                    <p className="font-semibold">{uploadedFile.name}</p>
                    <p className="text-right text-dark3">{convertBytes(uploadedFile.size)}</p>
                    <div className="flex flex-row items-center gap-x-3">
                      <p className="text-dark3">{uploadProgress}%</p>
                      {/* progress bar */}
                      <div className="bg-lighter w-36 h-1">
                        <div
                          className="bg-darker h-1"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* upload document btn */}
              <div className="flex flex-row w-full justify-between text-xs my-3">
                <div className="flex flex-col gap-y-1">
                  <p className="font-semibold">Unggah Berkas</p>
                  <p className="text-xxs">Pemeriksaan penunjang</p>
                </div>
                <button
                  className={`flex flex-row items-center gap-x-2 ${
                    enableCRUD ? 'text-mainColor cursor-pointer' : 'text-dark4 cursor-not-allowed'
                  }`}
                  onClick={() => uploadDocFile()}
                  disabled={!enableCRUD}
                >
                  <input id="uploadDocument" type="file" onChange={handleUploadFile} hidden />
                  <FontAwesomeIcon icon="paperclip" transform={{ rotate: -45 }} size="lg" />
                  <p className="font-semibold">Unggah</p>
                </button>
              </div>
            </div>

            {appointmentDetail?.history && <StatusList data={appointmentDetail.history} />}
          </div>
        </div>
      )}
      {!loadingDetail && !appointmentDetail && (
        <div className="absolute w-full h-full inset-0 bg-white z-10 flex items-center">
          <EmptyData text="Pilih untuk melihat detail konsultasi" />
        </div>
      )}
      {loadingDetail && (
        <div className="absolute w-full h-full inset-0 bg-white z-10">
          <LoadingComponent />
        </div>
      )}
      {messageAlert && (
        <AlertMessagePanel
          text={messageAlert.text}
          direction="bottom"
          type={messageAlert.type}
          counter={value => setMessageAlert(value)}
        />
      )}
      {modalCanceled?.status && (
        <Canceled
          type={enableRefund ? 'refund' : 'cancel'}
          appointmentId={modalCanceled.appointmentId}
          counterWithFormNote={value => handleCounterWithFormNote(value)}
          counter={value => handleCounterModalCanceled(value)}
          counterCloseModal={() => handleCloseModalCancel()}
        />
      )}
    </div>
  );
};

OrderedConsultation.defaultProps = {
  enableRefund: false,
  refferenceId: '',
};

const mapStateToProps = state => ({
  HeightElementReducer: state.HeightElementReducer.data,
  TriggerReducer: state.TriggerReducer.data,
  ParamCreateAppointment: state.ParamCreateAppointment.data,
});

const mapDispatchToProps = {
  TriggerUpdate,
  CreateParamsAppointment,
  CleanParamsAppointment,
  UserDataSelected,
  DocumentUpdate,
  PatientSelectAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderedConsultation);
