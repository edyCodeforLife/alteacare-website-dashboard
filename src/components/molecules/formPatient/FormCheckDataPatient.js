import { React, useState, useEffect } from '../../../libraries';
import Select from 'react-select';
import moment from 'moment';

import ServiceComboBox from '../../../hooks/location/ServiceComboBox';
import ServiceMember from '../../../hooks/family-member/ServiceMember';
import AlertMessagePanel from '../../molecules/modal/AlertMessagePanel';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

import { CheckBox, UncheckBox, AlertClose, ConsultationLg } from '../../../assets/images';
import Loader from '../loader/Loader';
import getToday from 'helpers/getToday';

const FormCheckDataPatient = props => {
  const {
    handlerClose,
    handlerMessage,
    isPanelTitle,
    isHospitalField,
    payloadAppointmentDetail,
    handlerMedicalRecordPro,
  } = props;

  const { genders } = ServiceComboBox();
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultParams = {
    patient_id: '',
    ektp: '',
    name: '',
    birthDate: '',
    gender: '',
    externalProvider: '',
  };

  const [params, setParams] = useState(defaultParams);

  const { MemberReducer } = useShallowEqualSelector(state => state);

  const {
    closed,
    message,
    patient,
    patients,
    hospitals,
    setPatients,
    checkDataPatient,
    isSetFormPatientFromSap,
    setParamsFormFamilyMember,
    setIsSetFormPatientFromSap,
    setMessage,
  } = ServiceMember();

  const handleChange = (param, value) => {
    setParams({
      ...params,
      [`${param}`]: value,
    });
  };

  const handleSelect = index => {
    const dataPatient = [...patients];
    dataPatient[index].checked = !dataPatient[index].checked;
    setPatients(dataPatient);
  };

  const setParamsAction = (from, payload) => {
    const paramsUpdate = {
      ...params,
      patient_id: '',
      ektp: payload?.cardId || '',
      name: `${payload?.firstName || ''} ${payload?.lastName || ''}`,
      birthDate: payload?.birthDate || '',
      gender: payload?.gender || '',
    };

    if (from === 'APPOINTMENT_DETAIL') {
      paramsUpdate.appointment_id = payload?.appointmentId;
    }

    setParams(paramsUpdate);

    if (payload?.gender !== '') {
      setSelectedGender({
        label: payload?.gender === 'MALE' ? 'Laki-laki' : 'Perempuan',
        value: payload?.gender,
      });
    }
  };

  useEffect(() => {
    if (isSetFormPatientFromSap) {
      handlerMessage({
        type: 'success',
        text: `Pasien ${patient.name} dengan Medical Record ${patient.externalPatientId} berhasil ditambahkan`,
      });
      setIsSetFormPatientFromSap(false);
      handlerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetFormPatientFromSap]);

  useEffect(() => {
    setParamsAction('MEMBER_REDUCER', MemberReducer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberReducer]);

  useEffect(() => {
    if (payloadAppointmentDetail) setParamsAction('APPOINTMENT_DETAIL', payloadAppointmentDetail);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadAppointmentDetail]);

  useEffect(
    () => () => {
      setSelectedGender(null);
      setSelectedHospital(null);
      setIsLoading(false);
      setParams(defaultParams);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const processCheckDataPatient = async () => {
    setIsLoading(true);
    await checkDataPatient(params);
    setIsLoading(false);
  };

  const today = getToday();

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className={`text-sm px-4 py-2 font-bold flex items-center justify-between bg-light3 text-mainColor ${
          !isPanelTitle && 'hidden'
        }`}
      >
        <span>Cek Data Pasien</span>
        <button onClick={() => handlerClose()}>
          <img alt="ico" src={AlertClose} />
        </button>
      </div>
      <div className="flex-1 h-full flex flex-col overflow-y-auto small-scroll">
        <div className="xl:px-10 lg:px-6 px-0">
          <div className="py-3 wrap-form-edit">
            <p>Medrec ID/Pasien ID</p>
            <input
              type="text"
              value={params.patient_id}
              onChange={event => handleChange('patient_id', event.target.value)}
            />
          </div>
          <div className="py-3 wrap-form-edit">
            <p>No.KTP/Paspor</p>
            <input
              type="text"
              value={params.ektp}
              onChange={event => handleChange('ektp', event.target.value)}
            />
          </div>
          <div className="py-3 wrap-form-edit">
            <p>Nama</p>
            <input
              type="text"
              value={params.name}
              onChange={event => handleChange('name', event.target.value)}
            />
          </div>
          <div className="py-3 wrap-form-edit">
            <p>Tanggal Lahir</p>
            <input
              type="date"
              value={params.birthDate}
              max={today}
              onChange={event => handleChange('birthDate', event.target.value)}
            />
          </div>
          <div className="py-3 wrap-form-edit">
            <p>Jenis Kelamin</p>
            <Select
              value={selectedGender}
              options={genders}
              isSearchable={false}
              onChange={item => {
                setSelectedGender(item);
                handleChange('gender', item.value);
              }}
            />
          </div>
          {isHospitalField && (
            <div className="py-3 wrap-form-edit">
              <p>Rumah Sakit</p>
              <Select
                menuPlacement="auto"
                value={selectedHospital}
                options={hospitals}
                onChange={item => {
                  setSelectedHospital(item);
                  handleChange('externalProvider', item.value);
                }}
              />
            </div>
          )}
          <div className="py-4 flex justify-end px-8">
            <button
              onClick={() => processCheckDataPatient()}
              className="border border-solid border-mainColor text-mainColor rounded py-1 px-2 text-xs"
            >
              Cari Pasien
            </button>
          </div>
        </div>
        <div className="border-b-2 border-solid border-light3"></div>
        <div className="flex-1 h-full flex flex-wrap items-center justify-center relative">
          {isLoading && (
            <div className="py-5">
              <Loader />
            </div>
          )}
          {patients.length > 0 &&
            !isLoading &&
            patients.map((item, index) => {
              return (
                <div
                  key={index}
                  className="my-4 xl:px-10 px-6 border-b border-solid border-light1 flex flex-wrap justify-between"
                >
                  <p className="flex flex-wrap items-start xl:text-sm text-sm mb-2 text-dark2 font-bold">
                    Patient ID : {item.external_patient_id}
                  </p>
                  <div className="xl:w-11/12 w-11/12 self-start">
                    <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                      <div className="xl:w-2/6 w-5/12 flex">
                        Nama <span className="ml-auto">:</span>
                      </div>
                      <div className="xl:w-4/6 w-7/12 px-3">{item.name}</div>
                    </div>
                    <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                      <div className="xl:w-2/6 w-5/12 flex">
                        Umur <span className="ml-auto">:</span>
                      </div>
                      <div className="xl:w-4/6 w-7/12 px-3">
                        {item.age ? `${item.age.year} Tahun ${item.age.month} Bulan` : ''}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                      <div className="xl:w-2/6 w-5/12 flex">
                        Tanggal Lahir <span className="ml-auto">:</span>
                      </div>
                      <div className="xl:w-4/6 w-7/12 px-3">
                        {moment(item.date_of_birth).format('DD/MM/YYYY')}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                      <div className="xl:w-2/6 w-5/12 flex">
                        Jenis Kelamin <span className="ml-auto">:</span>
                      </div>
                      <div className="xl:w-4/6 w-7/12 px-3">{`${
                        item.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'
                      }`}</div>
                    </div>
                    <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                      <div className="xl:w-2/6 w-5/12 flex">
                        No. Telepon <span className="ml-auto">:</span>
                      </div>
                      <div className="xl:w-4/6 w-7/12 px-3">{item.phone_number}</div>
                    </div>
                    <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                      <div className="xl:w-2/6 w-5/12 flex">
                        No. KTP <span className="ml-auto">:</span>
                      </div>
                      <div className="xl:w-4/6 w-7/12 px-3">{item.ektp}</div>
                    </div>
                    <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                      <div className="xl:w-2/6 w-5/12 flex">
                        Alamat <span className="ml-auto">:</span>
                      </div>
                      <div className="xl:w-4/6 w-7/12 px-3">
                        {`${item.address}, ${item.rt_rw ? 'Blok RT/RW ' + item.rt_rw : ''} ${
                          item.sub_district ? 'Kel.' + item.sub_district : ''
                        } ${item.district ? 'Kec.' + item.district : ''} ${
                          item.city ? item.city : '-'
                        } ${item.province ? item.province : '-'}`}
                      </div>
                    </div>
                  </div>
                  <div className="w-full text-sm flex flex-wrap items-center justify-between text-dark2 cursor-pointer my-4">
                    <div className="inline-block" onClick={() => handleSelect(index)}>
                      <img
                        src={item.checked ? CheckBox : UncheckBox}
                        alt="Check Box"
                        className="inline mr-3"
                      />
                      Pilih sebagai pasien
                    </div>
                    <button
                      onClick={() =>
                        !handlerMedicalRecordPro
                          ? item.checked
                            ? setParamsFormFamilyMember(item)
                            : setMessage('Silahkan pilih sebagai pasien terlebih dahulu!')
                          : handlerMedicalRecordPro({
                              firstName: item?.first_name,
                              lastName: item?.last_name,
                              externalProvider: item?.external_provider,
                              externalPatientId: item?.external_patient_id,
                            })
                      }
                      className={`border border-solid ${
                        item.checked
                          ? 'border-mainColor text-mainColor cursor-pointer'
                          : 'border-gray-400 text-gray-400 cursor-not-allowed'
                      } rounded py-1 px-2 text-sm`}
                    >
                      Tambahkan
                    </button>
                  </div>
                </div>
              );
            })}
          {patients.length === 0 && !isLoading && (
            <div className="inline-block text-center py-10">
              <img src={ConsultationLg} alt="no content" className="mx-auto" />
              <p className="text-dark4">Tidak ada data pasien</p>
            </div>
          )}
          {message && (
            <AlertMessagePanel
              counter={() => closed()}
              direction="bottom"
              type="failed"
              text={message}
            />
          )}
        </div>
      </div>
    </div>
  );
};

FormCheckDataPatient.defaultProps = {
  handlerClose: () => {},
  isPanelTitle: true,
  isHospitalField: true,
  payloadAppointmentDetail: null,
  handlerMedicalRecordPro: null,
};

export default FormCheckDataPatient;
