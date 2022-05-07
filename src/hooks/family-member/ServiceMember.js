import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '../../helpers/api';
import { LocalStorage } from '../../helpers/localStorage';
import { MemberAction } from '../../modules/actions/family-member/Member__Action';
import useShallowEqualSelector from '../../helpers/useShallowEqualSelector';
import { PatientSelectAction } from '../../modules/actions/user/userData__Action';
import sortFamilyMembers from 'helpers/sortFamilyMembers';

const ServiceMember = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(null);
  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isCloseFormPatient, setIsCloseFormPatient] = useState(null);
  const [isLoadFamilyMembers, setIsLoadFamilyMembers] = useState(false);
  const [isSetFormPatientFromSap, setIsSetFormPatientFromSap] = useState(null);
  const { PatientSelectReducer, MemberReducer, UserSelectReducer } = useShallowEqualSelector(
    state => state
  );

  const closed = () => setMessage(null);

  useEffect(() => {
    Api.get('/data/hospitals').then(response => {
      const result = response.data.data.map(item => ({
        label: item.name,
        value: item.external_provider.code,
      }));
      setHospitals(result);
    });
  }, []);

  const proccessApi = payload =>
    new Promise(resolve => {
      payload.method
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          resolve(error);
        });
    });

  const checkPatientApi = payload =>
    new Promise(resolve => {
      Api.post('/appointment/v1/medical-record/search', payload, {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          resolve(error.response);
        });
    });

  const camelToSnakeCase = payload => {
    const result = {};
    if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
      for (const item in payload) {
        if (payload.hasOwnProperty(item)) {
          const convert = item.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          result[convert] = payload[item];
        }
      }
    }
    return result;
  };

  const addFamilyMember = async params => {
    if (params.familyRelationType === '') {
      setMessage('Silahkan Pilih Hubungan Keluarga');
      return;
    }
    if (params.firstName === '') {
      setMessage('Silahkan Masukan Nama Depan');
      return;
    }
    if (params.lastName === '') {
      setMessage('Silahkan Masukan Nama Belakang');
      return;
    }
    if (params.gender === '') {
      setMessage('Silahkan Pilih Jenis Kelamin ');
      return;
    }
    if (params.birthDate === '') {
      setMessage('Silahkan Masukan Tanggal Lahir');
      return;
    }
    if (params.birthCountry === '') {
      setMessage('Silahkan Pilih Negara Tempat Lahir');
      return;
    }
    if (params.birthPlace === '') {
      setMessage('Silahkan Pilih Kota Tempat Lahir');
      return;
    }
    if (params.nationality === '') {
      setMessage('Silahkan Pilih Kewarganegaraan');
      return;
    }
    if (params.cardId === '') {
      setMessage('Silahkan Masukan Nomor KTP');
      return;
    }
    if (params.cardPhoto === '' || params.cardPhoto === null) {
      setMessage('Silahkan Unggah Foto KTP');
      return;
    }
    if (params.addressId === '' || params.addressId === null) {
      setMessage('Silahkan Pilih Atau Buat Alamat');
      return;
    }
    if (params.contactPhone === UserSelectReducer.data.phone) {
      setMessage('No. Whatsapp tidak boleh sama dengan Nomor Telepon akun utama');
      return;
    }
    if (params.contactEmail === UserSelectReducer.data.email) {
      setMessage('Email lainnya tidak boleh sama dengan Email di akun utama');
      return;
    }

    if (params.externalPatientId === '') {
      delete params.externalPatientId;
    }
    if (params.externalProvider === '') {
      delete params.externalProvider;
    }

    if (params.insuranceCompanyId) {
      if (params.insurancePlafonGroup === '') {
        setMessage('Silahkan Pilih Plafon Asuransi');
        return;
      }
      if (params.insuranceNumber === '') {
        setMessage('Silahkan Pilih Nomor Asuransi');
        return;
      }
    } else {
      delete params.insuranceCompanyId;
      delete params.insurancePlafonGroup;
      delete params.insuranceNumber;
    }

    const payload = await camelToSnakeCase(params);
    // if (params.patientId) delete payload.user_id;
    delete payload.patient_id;
    const process = await proccessApi({
      method: Api.post(`/user/patient${params.patientId ? `/${params.patientId}` : ''}`, payload, {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      }),
    });
    if (process && process.data && process.data.status) {
      getFamilyMembers({ userId: params.userId });
      setIsCloseFormPatient({
        status: true,
        message: params.patientId
          ? 'Berhasil memperbarui data pasien'
          : 'Berhasil menambah data pasien',
      });
      dispatch(MemberAction({ reset: true }));
    } else {
      setMessage(
        process?.response?.data?.message ||
          'Terjadi Kesalahan dalam Tambah/Ubah data Daftar Keluarga'
      );
      return;
    }
  };

  const getFamilyMembers = async params => {
    const payload = await camelToSnakeCase(params);
    const process = await proccessApi({
      method: Api.get('/user/patient', {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        params: payload,
      }),
    });
    if (process && process.data && process.data.status) {
      const result = [];
      process.data.data.patient.forEach(item => {
        result.push({
          ...item,
          checked: false,
        });
      });

      const index = process.data.data.patient.findIndex(
        item =>
          item.id ===
          (PatientSelectReducer && PatientSelectReducer.data ? PatientSelectReducer.data.id : '')
      );
      if (index > -1) {
        const item = process.data.data.patient[index];
        dispatch(PatientSelectAction(item));
      }

      // Sort patients/family members by family relation type of name
      const sortedFamilyMembers = sortFamilyMembers(result);

      setFamilyMembers(sortedFamilyMembers);
      setIsLoadFamilyMembers(true);
    }
  };

  const getFamilyMember = async params => {
    if (params && params.patientId) {
      const process = await proccessApi({
        method: Api.get(`/user/patient/${params.patientId}`, {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        }),
      });
      if (process.data.status) {
        //
        // console.log(process.data);
        // setFamilyMembers(process.data.data.patient);
      }
    }
  };

  const checkDataPatient = async params => {
    // if (params.cardId === '') { setMessage('Silahkan Cari Berdasarkan Nomor KTP'); return; }
    // if (params.name === '') { setMessage('Silahkan Masukan Nama'); return; }
    // if (params.birthDate === '') { setMessage('Silahkan Masukan Tanggal Lahir'); return; }
    // if (params.gender === '') { setMessage('Silahkan Pilih Jenis Kelamin '); return; }
    if (!params?.appointment_id && params.externalProvider === '') {
      setMessage('Silahkan Pilih Rumah Sakit ');
      return;
    }
    const payload = await camelToSnakeCase(params);
    if (params?.appointment_id) delete payload.external_provider;

    const result = await checkPatientApi(payload);
    if (result && result.data && result.data.status) {
      const dataPatient = [];

      result.data.data.forEach(item => {
        dataPatient.push({
          ...item,
          checked: false,
        });
      });

      setPatients(dataPatient);
    } else {
      setPatients([]);
      setMessage((result && result.data && result.data.message) || '');
      return;
    }
  };

  const setParamsFormFamilyMember = item => {
    dispatch(
      MemberAction({
        ...MemberReducer,
        externalPatientId: item.external_patient_id,
        externalProvider: item.external_provider,
        firstName: item.first_name,
        lastName: item.last_name,
      })
    );

    setPatient({
      externalPatientId: item.external_patient_id,
      externalProvider: item.external_provider,
      name: item.name,
      firstName: item.first_name,
      lastName: item.last_name,
    });

    setIsSetFormPatientFromSap(true);
  };

  return {
    closed,
    message,
    setMessage,
    patient,
    patients,
    hospitals,
    setPatients,
    familyMembers,
    addFamilyMember,
    getFamilyMember,
    setFamilyMembers,
    checkDataPatient,
    getFamilyMembers,
    isCloseFormPatient,
    setIsCloseFormPatient,
    isSetFormPatientFromSap,
    setIsSetFormPatientFromSap,
    setParamsFormFamilyMember,
    isLoadFamilyMembers,
    setIsLoadFamilyMembers,
  };
};

export default ServiceMember;
