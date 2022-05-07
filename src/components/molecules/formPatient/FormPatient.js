import { React, useEffect, useState } from '../../../libraries';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import { CheckBox, UncheckBox } from '../../../assets/images';

import ServiceFileUpload from '../../../hooks/ServiceFileUpload';
import ServiceComboBox from '../../../hooks/location/ServiceComboBox';
import ServiceMember from '../../../hooks/family-member/ServiceMember';
import ServiceAddress from '../../../hooks/family-member/ServiceAddress';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

import AlertMessagePanel from '../modal/AlertMessagePanel';
import { MemberAction } from '../../../modules/actions/family-member/Member__Action';

import { ArrowDown, AlertClose, FileUpload } from '../../../assets/images';
import getToday from 'helpers/getToday';

const FormPatient = props => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [addressValue, setAddressValue] = useState(null);
  const [emailSame, setEmailSame] = useState(false);
  const [phoneSame, setPhoneSame] = useState(false);
  const { getDefaultAddress, getAddress, address } = ServiceAddress();

  const {
    isShowing,
    handlerClose,
    openAddresses,
    openFormAddress,
    addressSelected,
    removeAddressSelect,
    openCheckDataPatient,
    formPatientMessage,
  } = props;

  const { idCard, setIdCard, progressBar, uploadPhotoId, removePhotoId } = ServiceFileUpload();

  const { MemberReducer, UserSelectReducer } = useShallowEqualSelector(state => state);

  const {
    closed,
    message,
    setMessage,
    addFamilyMember,
    isCloseFormPatient,
    setIsCloseFormPatient,
  } = ServiceMember();

  useEffect(() => {
    if (formPatientMessage) {
      setMessage(formPatientMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPatientMessage]);

  const [params, setParams] = useState({
    userId: UserSelectReducer?.data?.id,
    patientId: MemberReducer?.patientId,
    familyRelationType: MemberReducer?.familyRelationType,
    firstName: MemberReducer?.firstName,
    lastName: MemberReducer?.lastName,
    gender: MemberReducer?.gender,
    birthDate: MemberReducer?.birthDate,
    birthPlace: MemberReducer?.birthPlace,
    birthCountry: MemberReducer?.birthCountry,
    nationality: MemberReducer?.nationality,
    cardId: MemberReducer?.cardId,
    cardPhoto: MemberReducer?.cardPhoto?.id || MemberReducer?.cardPhoto || null,
    addressId: MemberReducer?.addressId,
    insuranceCompanyId: MemberReducer?.insuranceCompanyId,
    insurancePlafonGroup: MemberReducer?.insurancePlafonGroup,
    insuranceNumber: MemberReducer?.insuranceNumber,
    externalPatientId: MemberReducer?.externalPatientId || '',
    externalProvider: MemberReducer?.externalProvider || '',
    contactEmail: MemberReducer?.contactEmail,
    contactPhone: MemberReducer?.contactPhone,
  });

  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      firstName: MemberReducer.firstName,
      lastName: MemberReducer.lastName,
      externalPatientId: MemberReducer.externalPatientId || '',
      externalProvider: MemberReducer.externalProvider || '',
      userId: UserSelectReducer?.data?.id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    MemberReducer.firstName,
    MemberReducer.lastName,
    MemberReducer.externalPatientId,
    MemberReducer.externalProvider,
    UserSelectReducer?.data?.id,
  ]);

  const {
    getFamilyTypes,
    familyTypes,
    familyType,
    selectFamilyType,

    gender,
    selectGender,
    genders,

    getCountryById,
    getBirthCountries,
    getBirthCountriesKeyword,
    birthCountry,
    selectBirthCountry,
    birthCountries,

    getNationalities,
    getNationalitiesKeyword,
    nationality,
    selectNationality,
    nationalities,

    getCompanies,
    company,
    selectCompany,
    companies,

    plafones,
    plafon,
    selectPlafon,
    setPlafones,
  } = ServiceComboBox();

  const customStylesSelect = {
    control: base => ({
      ...base,
      height: 50,
      minHeight: 50,
    }),
  };

  useEffect(() => {
    // autofill on page load
    if (!MemberReducer.birthCountry || !MemberReducer.nationality) {
      autofillField(birthCountries, nationalities);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthCountries, nationalities, MemberReducer]);

  useEffect(() => {
    if (MemberReducer.familyRelationType !== '' && familyTypes.length > 0) {
      const familyTypesSelected = familyTypes.find(
        item => item.value === MemberReducer.familyRelationType
      );
      setParams(prevParams => ({
        ...prevParams,
        familyRelationType: familyTypesSelected.value,
      }));
      selectFamilyType(familyTypesSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberReducer.familyRelationType, familyTypes]);

  useEffect(() => {
    if (MemberReducer.gender !== '' && genders.length > 0) {
      const genderSelected = genders.find(item => item.value === MemberReducer.gender);
      if (genderSelected) {
        selectGender(genderSelected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberReducer.gender, genders]);

  useEffect(() => {
    // birth country data is available
    if (MemberReducer.birthCountry !== '' && birthCountries.length > 0) {
      const birthCountrySelected = birthCountries.find(
        item => item.value === MemberReducer.birthCountry
      );
      if (!birthCountrySelected) {
        getCountryById(MemberReducer.birthCountry).then(result => {
          setParams(prevParams => ({
            ...prevParams,
            birthCountry: result.value,
          }));
          selectBirthCountry(result);
        });
      } else {
        setParams(prevParams => ({
          ...prevParams,
          birthCountry: birthCountrySelected.value,
        }));
        selectBirthCountry(birthCountrySelected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberReducer.birthCountry, birthCountries]);

  useEffect(() => {
    // nationality data available
    if (MemberReducer.nationality !== '' && nationalities.length > 0) {
      const nationalitySelected = nationalities.find(
        item => item.value === MemberReducer.nationality
      );
      if (!nationalitySelected) {
        getCountryById(MemberReducer.nationality).then(result => {
          setParams(prevParams => ({
            ...prevParams,
            nationality: result.value,
          }));
          selectNationality(result);
        });
      } else {
        setParams(prevParams => ({
          ...prevParams,
          nationality: nationalitySelected.value,
        }));
        selectNationality(nationalitySelected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberReducer.nationality, nationalities]);

  useEffect(() => {
    if (MemberReducer.insuranceCompanyId !== '' && companies.length > 0) {
      const companySelected = companies.find(
        item => item.value === MemberReducer.insuranceCompanyId
      );
      selectCompany(companySelected);

      let plafonSelected;
      if (MemberReducer.insurancePlafonGroup !== '' && companySelected.plafones.length > 0) {
        plafonSelected = companySelected.plafones.find(
          item => item.value === MemberReducer.insurancePlafonGroup
        );
        setPlafones(companySelected.plafones);
        selectPlafon(plafonSelected);
      }
      setParams(prevParams => ({
        ...prevParams,
        insuranceCompanyId: companySelected.value,
        insurancePlafonGroup: plafonSelected.value,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberReducer.insuranceCompanyId, plafones, companies]);

  useEffect(() => {
    if (MemberReducer.addressId) {
      getAddress({ addressId: MemberReducer.addressId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberReducer.addressId]);

  useEffect(() => {
    if (MemberReducer.cardPhoto && MemberReducer.cardPhoto.id && MemberReducer.cardPhoto.url) {
      setIdCard({
        ...idCard,
        id: MemberReducer.cardPhoto.id,
        url: MemberReducer.cardPhoto.url,
      });
      setParams(prevParams => ({
        ...prevParams,
        cardPhoto: MemberReducer.cardPhoto.id,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberReducer.cardPhoto]);

  useEffect(() => {
    if (idCard && idCard.id !== '') {
      setParams(prevParams => ({
        ...prevParams,
        cardPhoto: idCard.id,
      }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCard]);

  useEffect(() => {
    if (address && !addressSelected) {
      const addressConverted = convertAddress(address);
      setAddressValue(addressConverted);
    }
    // autofill address by default value (PRIMARY or index[0])
    else {
      getDefaultAddress(params.userId).then(resp => {
        let result = resp.data.data;
        if (result) {
          setAddressValue(convertAddress(result));
          setParams(prevParams => ({
            ...prevParams,
            addressId: result.id,
          }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (addressSelected) {
      const addressConverted = convertAddress(addressSelected);
      setAddressValue(addressConverted);
      setParams(prevParams => ({
        ...prevParams,
        addressId: addressSelected ? addressSelected.id : '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressSelected]);

  useEffect(() => {
    if (isCloseFormPatient && isCloseFormPatient.status) {
      handlerClose({ message: isCloseFormPatient.message });
      setIsCloseFormPatient(null);
      removeAddressSelect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCloseFormPatient]);

  useEffect(() => {
    getFamilyTypes();
    getBirthCountries();
    getNationalities();
    getCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // autofill for defaul birth country and nationality
  const autofillField = (countries, nationalities) => {
    let defaultCountry = countries[0];
    let defaultNationality = nationalities[0];
    // autofill for birth country and nationality (default value)
    if (defaultCountry && defaultNationality) {
      setParams(prevParams => ({
        ...prevParams,
        birthCountry: defaultCountry.value,
        nationality: defaultNationality.value,
      }));
      selectBirthCountry(defaultCountry);
      selectNationality(defaultNationality);
    }
  };

  const applyParamsFirst = from => {
    dispatch(MemberAction(MemberReducer));
    if (from === 'SELECT_ADDRESS') openAddresses();
    if (from === 'CREATE_ADDRESS') openFormAddress();
  };

  const applyParams = (param, from) => {
    if (from === 'FAMILY_RELATION_TYPE') {
      selectFamilyType(param);
      setParams(prevParams => ({
        ...prevParams,
        familyRelationType: param.value,
      }));
    }

    if (from === 'GENDER') {
      selectGender(param);
      setParams(prevParams => ({
        ...prevParams,
        gender: param.value,
      }));
    }

    if (from === 'BIRTH_PLACE') {
      selectBirthCountry(param);
      setParams(prevParams => ({
        ...prevParams,
        birthCountry: param.value,
      }));
    }

    if (from === 'NATIONALITY') {
      selectNationality(param);
      setParams(prevParams => ({
        ...prevParams,
        nationality: param.value,
      }));
    }

    if (from === 'INSURANCE_COMPANY') {
      selectCompany(param);
      setParams(prevParams => ({
        ...prevParams,
        insurancePlafonGroup: '',
        insuranceCompanyId: param.value,
      }));
    }

    if (from === 'INSURANCE_PLAFON') {
      selectPlafon(param);
      setParams(prevParams => ({
        ...prevParams,
        insurancePlafonGroup: param.value,
      }));
    }
  };

  const removePhotoIdfunction = () => {
    const paramsUpdate = { ...params };
    if (paramsUpdate.cardPhoto && paramsUpdate.cardPhoto !== '') paramsUpdate.cardPhoto = '';
    removePhotoId();
    setParams(paramsUpdate);
  };

  const close = () => {
    setError(null);
    removeAddressSelect();
    closed();
  };

  const handlerCloseResetMemberReducer = () => {
    dispatch(MemberAction({ reset: true }));
    removeAddressSelect();
    handlerClose();
  };

  const cardIdProcessing = cardId => {
    if (cardId.length > 25) {
      setError('Nomor KTP maksimal hanya 25 karakter');
      return;
    }
    if (cardId.length < 7) {
      setError('Nomor KTP minimal 7 karakter');
    }
    setParams(prevParams => ({
      ...prevParams,
      cardId,
    }));
  };

  const convertAddress = address => {
    if (!address) return '';

    return `${address.street}, Blok RT/RW ${address.rt_rw} kel.${address.sub_district.name} Kec.${address.district.name} ${address.city.name} ${address.province.name}`;
  };

  useEffect(() => {
    setEmailSame(!MemberReducer.contactEmail);
  }, [MemberReducer.contactEmail]);

  useEffect(() => {
    setPhoneSame(!MemberReducer.contactPhone);
  }, [MemberReducer.contactPhone]);

  const today = getToday();

  return (
    <div className={`w-full h-full relative flex flex-col ${!isShowing ? 'hidden' : ''}`}>
      <div className="px-4 py-2 font-bold flex items-center justify-between bg-light3 text-mainColor">
        <div className="w-7/12 text-sm">{`${
          params.patientId ? 'Ubah Daftar Keluarga' : 'Tambah Daftar Keluarga Baru'
        }`}</div>
        <div className="w-5/12 flex justify-between">
          <button
            onClick={() => openCheckDataPatient()}
            className="border border-solid border-mainColor text-mainColor rounded py-1 px-2 text-xs"
          >
            Check Data Pasien
          </button>
          <button onClick={() => handlerCloseResetMemberReducer()}>
            <img alt="close" src={AlertClose} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto small-scroll">
        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Hubungan Keluarga<span className="text-error1">*</span>
          </p>
          <Select
            value={familyType}
            isSearchable={false}
            options={familyTypes}
            styles={customStylesSelect}
            placeholder="Pilih hubungan keluarga"
            onChange={value => applyParams(value, 'FAMILY_RELATION_TYPE')}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Nama Depan<span className="text-error1">*</span>
          </p>
          <input
            type="text"
            value={params.firstName}
            placeholder="Isi nama depan"
            onChange={event => setParams({ ...params, firstName: event.target.value })}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Nama Belakang<span className="text-error1">*</span>
          </p>
          <input
            type="text"
            value={params.lastName}
            placeholder="Isi nama belakang"
            onChange={event => setParams({ ...params, lastName: event.target.value })}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Jenis Kelamin<span className="text-error1">*</span>
          </p>
          <Select
            value={gender}
            options={genders}
            isSearchable={false}
            styles={customStylesSelect}
            placeholder="Pilih jenis kelamin"
            onChange={value => applyParams(value, 'GENDER')}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Tanggal Lahir<span className="text-error1">*</span>
          </p>
          <input
            type="date"
            value={params.birthDate}
            max={today}
            onChange={event => setParams({ ...params, birthDate: event.target.value })}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Tempat Lahir<span className="text-error1">*</span>
          </p>
          <Select
            value={birthCountry}
            options={birthCountries}
            placeholder="Pilih negara"
            styles={customStylesSelect}
            onChange={value => applyParams(value, 'BIRTH_PLACE')}
            onInputChange={value => getBirthCountriesKeyword({ keyword: value })}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <input
            type="text"
            placeholder="Tulis kota kelahiran..."
            value={params.birthPlace}
            onChange={event => setParams({ ...params, birthPlace: event.target.value })}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Kewarganegaraan<span className="text-error1">*</span>
          </p>
          <Select
            value={nationality}
            options={nationalities}
            styles={customStylesSelect}
            placeholder="Pilih kewarganegaraan"
            onChange={value => applyParams(value, 'NATIONALITY')}
            onInputChange={value => getNationalitiesKeyword({ keyword: value })}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Nomor KTP<span className="text-error1">*</span>
          </p>
          <input
            type="text"
            value={params.cardId}
            onChange={event => cardIdProcessing(event.target.value)}
          />
        </div>

        <div className="py-4 px-8 wrap-form-edit">
          <p>
            Alamat<span className="text-error1">*</span>
          </p>
          <button
            onClick={() => applyParamsFirst('SELECT_ADDRESS')}
            className="w-full relative leading-tight py-2 px-4 mb-4 h-12 text-sm text-mainColor text-left border border-solid border-light1 rounded bg-white"
          >
            {addressValue
              ? addressValue.length > 60
                ? `${addressValue.substring(0, 60)}...`
                : addressValue
              : 'Pilih dari daftar alamat'}
            <img alt="arrow" src={ArrowDown} className="absolute inset-y-0 my-auto mr-2 right-0" />
          </button>
          <button
            onClick={() => applyParamsFirst('CREATE_ADDRESS')}
            className="w-full py-3 px-4 text-sm text-mainColor text-left border border-solid border-light1 rounded bg-white"
          >
            + Tambah Alamat baru
          </button>
        </div>
        <div className={`py-4 px-8 wrap-form-edit${phoneSame ? '-disabled' : ''}`}>
          <p>No. Whatsapp</p>
          <input
            type="text"
            value={params.contactPhone}
            disabled={phoneSame}
            onChange={event => setParams({ ...params, contactPhone: event.target.value })}
            placeholder={
              phoneSame
                ? UserSelectReducer.data.phone || UserSelectReducer.data.phone_number
                : 'Tulis no HP yang tersambung Whatsapp'
            }
          />
          <div
            className="flex cursor-pointer mt-2 items-center"
            onClick={() => {
              setPhoneSame(!phoneSame);
              setParams({ ...params, contactPhone: '' });
            }}
          >
            <span className="flex flex-1 text-xs">Sama dengan no HP yang terdaftar</span>
            <img src={phoneSame ? CheckBox : UncheckBox} alt="Check Box" className="w-4 h-4 mr-2" />
          </div>
        </div>
        <div className={`py-4 px-8 wrap-form-edit${emailSame ? '-disabled' : ''}`}>
          <p>Email Lainnya</p>
          <input
            type="email"
            value={params.contactEmail}
            disabled={emailSame}
            onChange={event => setParams({ ...params, contactEmail: event.target.value })}
            placeholder={emailSame ? UserSelectReducer.data.email : 'Tulis email lainnya'}
          />
          <div
            className="flex cursor-pointer mt-2 items-center"
            onClick={() => {
              setEmailSame(!emailSame);
              setParams({ ...params, contactEmail: '' });
            }}
          >
            <span className="flex flex-1 text-xs">Sama dengan email yang terdaftar</span>
            <img src={emailSame ? CheckBox : UncheckBox} alt="Check Box" className="w-4 h-4 mr-2" />
          </div>
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>Nama Perusahaan Asuransi</p>
          <Select
            value={company}
            isSearchable={false}
            styles={customStylesSelect}
            options={companies.map(item => item)}
            getOptionLabel={option => option.label}
            onChange={value => applyParams(value, 'INSURANCE_COMPANY')}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>Plafon Asuransi</p>
          <Select
            value={plafon}
            isSearchable={false}
            options={plafones}
            styles={customStylesSelect}
            onChange={value => applyParams(value, 'INSURANCE_PLAFON')}
          />
        </div>
        <div className="py-4 px-8 wrap-form-edit">
          <p>Nomor Asuransi</p>
          <input
            type="text"
            value={params.insuranceNumber}
            onChange={event => setParams({ ...params, insuranceNumber: event.target.value })}
          />
        </div>
        <div className="py-4 px-8">
          <div className="flex flex-row justify-between">
            <p className="font-bold pb-3 flex-1 text-sm">Foto KTP</p>
            {idCard.beforeUpload === '' && idCard.url === '' && (
              <div className="flex justify-end">
                <div className="relative inline-block">
                  <button className="text-sm flex justify-end right-0 top-0 w-40 text-mainColor">
                    <img src={FileUpload} alt="upload" className="w-3 mr-2 object-contain" /> Unggah
                  </button>
                  <input
                    type="file"
                    onChange={uploadPhotoId}
                    accept="image/*"
                    className="cursor-pointer absolute z-10 block w-full opacity-0 top-0 left-0"
                  />
                </div>
              </div>
            )}
          </div>
          {(idCard.beforeUpload !== '' || idCard.url !== '') && (
            <div className="w-full h-48 my-2 relative rounded">
              <img
                src={idCard.url !== '' ? idCard.url : idCard.beforeUpload}
                alt="ID card"
                className="w-full h-full"
                style={{ objectFit: 'contain' }}
              />
              {idCard.url !== '' && (
                <div className="w-full pl-1 pt-1">
                  <button
                    onClick={() => removePhotoIdfunction()}
                    className="text-sm text-error1 font-bold"
                  >
                    Hapus
                  </button>
                </div>
              )}
              {progressBar.percent > 0 && (
                <>
                  <div
                    className="absolute z-10 left-0 top-0 w-full h-full flex flex-wrap justify-center content-center px-24 rounded"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <p className="w-full text-center text-white mb-2">{`${progressBar.percent}%`}</p>
                    <div className="w-full bg-subtle h-1">
                      <div
                        className="bg-darker transition-all h-1"
                        style={{ width: `${progressBar.percent}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="py-5 flex justify-end px-8 pb-16">
          <button
            className="bg-mainColor text-white rounded py-1 px-4"
            onClick={() => addFamilyMember(params)}
          >
            Simpan
          </button>
        </div>
      </div>
      {(message || error) && (
        <AlertMessagePanel
          counter={() => close()}
          direction="bottom"
          type={message?.type || 'failed'}
          text={message?.text || message || error}
        />
      )}
    </div>
  );
};

export default FormPatient;
