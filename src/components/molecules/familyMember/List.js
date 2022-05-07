import { React, useEffect } from '../../../libraries';

import moment from 'moment';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

import { CheckBox, UncheckBox } from '../../../assets/images';

import EmptyFamilyMemberList from './Empty';

import { PatientSelectAction } from '../../../modules/actions/user/userData__Action';
// import { MemberAction } from '../../../modules/actions/family-member/Member__Action';
import { CreateParamsAppointment } from '../../../modules/actions/appoitment/ParamsCreate__Action';

import ServiceMember from '../../../hooks/family-member/ServiceMember';
import sortFamilyMembers from 'helpers/sortFamilyMembers';

const FamilyMemberList = (props) => {
  const dispatch = useDispatch();

  const {
    ParamCreateAppointment,
    PatientSelectReducer,
  } = useShallowEqualSelector((state) => state);

  const {
    userId,
    patientMessage,
    disableCheckbox,
    openFormEditPatient,
    clearPatientMessage,
    messageErrorSelect = null,
  } = props;

  const {
    familyMembers,
    getFamilyMembers,
    setFamilyMembers,
    isLoadFamilyMembers,
    setIsLoadFamilyMembers,
  } = ServiceMember();

  const handleCheckbox = (index) => {
    if (!disableCheckbox) {
      const familyMembersData = [...familyMembers];
      const familyMembersUpdate = familyMembersData.findIndex((item) => item.checked === true);

      let ParamCreateAppointmentData = {...ParamCreateAppointment.data}
      if (familyMembersData && familyMembersData[index]){
        if ((familyMembersData[index].address_id && familyMembersData[index].address_id !== '')
          && (familyMembersData[index].card_id && familyMembersData[index].card_id !== '')) {

          // ParamCreateAppointmentData.consultation_method = "VIDEO_CALL"
          ParamCreateAppointmentData.patient_id = familyMembersData[index].id;
          dispatch(CreateParamsAppointment(ParamCreateAppointmentData));

          // select user for data
          dispatch(PatientSelectAction(familyMembersData[index]));

          if (familyMembersUpdate > -1) familyMembersData[familyMembersUpdate].checked = false;
          familyMembersData[index].checked = true;

          // Sort patients/family members by family relation type of name
          const sortedFamilyMembers = sortFamilyMembers(familyMembersData);

          setFamilyMembers(sortedFamilyMembers);
        }

        if (!familyMembersData[index].address_id || familyMembersData[index].address_id === '') {
          messageErrorSelect('Data pasien tidak dapat dipilih, silahkan lengkapi data terlebih dahulu');
        } else if (!familyMembersData[index].card_id || familyMembersData[index].card_id === '') {
          messageErrorSelect('Silahkan lengkapi data KTP terlebih dahulu');
        }
      }
    }
  };

  const editFormFamilyMember = (item) => {
    openFormEditPatient(item);
  }

  useEffect(() => {
    if (userId) getFamilyMembers({ userId: userId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (patientMessage && userId) {
      getFamilyMembers({ userId: userId });
      clearPatientMessage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientMessage, userId]);

  useEffect(() => {
    if (isLoadFamilyMembers && PatientSelectReducer.data) {
      const familyMembersData = [...familyMembers];
      const familyMembersUpdate = familyMembersData.findIndex((item) => item.id === PatientSelectReducer.data.id);
      if (familyMembersUpdate > -1) familyMembersData[familyMembersUpdate].checked = true;

      // Sort patients/family members by family relation type of name
      const sortedFamilyMembers = sortFamilyMembers(familyMembersData);

      setFamilyMembers(sortedFamilyMembers);
      setIsLoadFamilyMembers(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PatientSelectReducer, isLoadFamilyMembers]);

  return (
    <div className="flex flex-wrap w-full h-full bg-white lg:aboslute">
      {
        familyMembers.length > 0
          ? (
            <div className="w-full pt-5 lg:pb-32 pb-10">
              {
                familyMembers.map((item, index) => (
                  <div key={index} className="mb-4 xl:px-5 px-2 border-b border-solid border-light1 flex flex-wrap justify-between">
                    <div className="xl:w-10/12 w-10/12 self-start">
                      <p className="flex flex-wrap items-start xl:text-sm text-sm mb-2 text-dark2 font-bold">
                        {item.family_relation_type ? item.family_relation_type.name : ''}
                      </p>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">Nama <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{`${item.first_name} ${item.last_name}`}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">Umur <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{`${item.age.year} Tahun ${item.age.month} Bulan`}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">Tanggal Lahir <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{moment(item.birth_date).format('DD/MM/YYYY')}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">Jenis Kelamin <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{`${item.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}`}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">No. Telepon <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{item.phone}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">Email <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{item.email}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">No. Whatsapp <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{item.contact_phone || item.phone || '-'}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">Email Lainnya <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{item.contact_email || item.email || '-'}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">No. KTP <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">{item.card_id !== '' ? item.card_id : '-'}</div>
                      </div>
                      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
                        <div className="xl:w-2/6 w-5/12 flex">Alamat <span className="ml-auto">:</span></div>
                        <div className="xl:w-4/6 w-7/12 px-3">
                          {
                            item.address_id
                              ? `${item.street}, Blok RT/RW ${item.rt_rw} kel.${item.sub_district ? item.sub_district.name : ''} Kec.${item.district ? item.district.name : ''} ${item.city ? item.city.name : ''} ${item.province ? item.province.name : ''}`
                              : '-'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="w-2/12 flex justify-end items-start">
                      {
                        !disableCheckbox
                          ? (
                            <button
                              onClick={() => editFormFamilyMember(item)}
                              className="border border-solid border-darker text-darker rounded py-1 px-2 text-sm"
                            >
                                Ubah
                            </button>
                          ) : ''
                      }
                    </div>
                    <div className="w-full text-sm flex flex-wrap items-center justify-between text-dark2 cursor-pointer my-4">
                      <div
                        className="inline-block"
                        onClick={() => handleCheckbox(index)}>
                        <img
                          src={item.checked ? CheckBox : UncheckBox}
                          alt="Check Box"
                          className="inline mr-3" />
                          Pilih sebagai pasien
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : <EmptyFamilyMemberList />
      }
    </div>
  );
};

export default FamilyMemberList;
