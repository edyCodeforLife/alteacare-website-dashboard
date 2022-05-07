/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState } from '../../libraries';
import { connect, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import moment from 'moment';
import { UserDataSelected, TriggerUpdate } from '../../modules/actions';
import { LocalStorage } from '../../helpers/localStorage';
import { Api } from '../../helpers/api';
import { Template } from '../molecules/layout';
import { InputSearchWithIcon, LoadingComponent, EmptyData } from '../molecules';
import { AlertMessagePanel } from '../molecules/modal';
import { FormPatient } from '../molecules/patient';
import { LabelTitle, ButtonTextAndBorderBlue } from '../atoms';
import { ArrowRight, Users } from '../../assets/images';
import { SimpleBio } from '../molecules/bio';
import FormPatientMember from '../molecules/formPatient/FormPatient';
import FormCheckDataPatient from '../molecules/formPatient/FormCheckDataPatient';
import Addresses from '../molecules/address/Addresses';
import FormAddress from '../molecules/formPatient/FormAddress';
import useShallowEqualSelector from '../../helpers/useShallowEqualSelector';
import { MemberAction } from '../../modules/actions/family-member/Member__Action';
import sortFamilyMembers from 'helpers/sortFamilyMembers';

const DataPatientPage = ({
  HeightElementReducer,
  TriggerReducer,
  TriggerUpdate,
  UserDataSelected,
}) => {
  const dispatch = useDispatch();
  const role = LocalStorage('role');
  const [HeightElement, setHeightElement] = useState('');
  const [sectionHeaderHeight, setSectionHeaderHeight] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [biodata, setBiodata] = useState(null);
  const [messageAlert, setMessageAlert] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [refreshData, setRefreshData] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingDataUserDetail, setLoadingDataUserDetail] = useState(false);
  const [totalData, setTotalData] = useState(null);
  const [listUser, setListUser] = useState([]);
  const [patients, setPatients] = useState([]);
  const [displayFeaturePatient, setDisplayFeaturePatient] = useState(null);
  const [formPatientMessage, setFormPatientMessage] = useState(null);
  const [patientMessage, setPatientMessage] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [address, setAddress] = useState(null);
  const [isOpenAddresses, setIsOpenAddresses] = useState(false);
  const [addressMessage, setAddressMessage] = useState(null);

  const { UserSelectReducer, PatientSelectReducer } = useShallowEqualSelector(state => state);

  useEffect(() => {
    if (HeightElementReducer !== null) {
      const heightHeader = document.getElementById('header-top-list-patient').clientHeight;
      setHeightElement(HeightElementReducer.heightElement);
      setSectionHeaderHeight(parseInt(HeightElementReducer.heightElement) - parseInt(heightHeader));
    }
  }, [HeightElementReducer]);

  useEffect(() => {
    if (TriggerReducer !== null && TriggerReducer.cancelEdit) {
      setIsEdit(false);
      TriggerUpdate(null);
    }

    if (TriggerReducer !== null && TriggerReducer.triggerSuccessEditUser) {
      setMessageAlert({
        text: TriggerReducer.text,
      });
      setIsEdit(false);
      TriggerUpdate(null);
    }
  }, [TriggerReducer]);

  // Get patients/family members of a user
  const userId = biodata?.id;
  useEffect(() => {
    if (userId) {
      const getPatients = async () => {
        const url = `/user/patient?user_id=${userId}`;
        const token = `Bearer ${LocalStorage('access_token')}`;
        const options = { headers: { Authorization: token } };
        const response = await Api.get(url, options);
        const patients = response.data?.data?.patient ?? [];

        // Sort patients/family members by family relation type of name
        const sortedPatients = sortFamilyMembers(patients);

        setPatients(sortedPatients);
      };

      getPatients();
    }
  }, [messageAlert, userId]);

  useEffect(() => {
    setLoadingData(true);
    Api.get(`/user/users?keyword=${keyword}&page=${page}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(res => {
        setTotalData(res.data.data.totalData);
        if (page > 1) {
          setListUser(listUser => [...listUser, ...res.data.data.users]);
        } else {
          setListUser(res.data.data.users);
        }
        setLoadingData(false);
      })
      .catch(function (error) {
        if (page < 2) {
          setListUser([]);
        }
        setLoadingData(false);
      });
  }, [refreshData, TriggerReducer?.triggerSuccessEditUser]);

  const handleCounterGroupUser = value => {
    setIsEdit(false);
    setBiodata(value);
    UserDataSelected(value);
  };

  const handleCounterKeyword = debounce(value => {
    setLoadingData(true);
    setKeyword(value);
    setPage(1);
    setRefreshData(!refreshData);
  }, 700);

  const handleCounterPaggination = value => {
    setKeyword(value.keyword);
    setPage(value.page);
    setRefreshData(!refreshData);
  };

  const handleCounterDetailuser = value => {
    setLoadingDataUserDetail(value);
  };

  const handleCloseFormPatient = value => {
    if (value) setPatientMessage(value.message);
    setDisplayFeaturePatient('');
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

  const openFormAddressEdit = param => {
    setAddressId(param);
    setIsOpenAddresses(true);
    setDisplayFeaturePatient('FORM-ADDRESS');
  };

  useEffect(() => {
    if (patientMessage || (TriggerReducer?.triggerSuccessEditUser && TriggerReducer?.text)) {
      setMessageAlert({
        text: patientMessage || TriggerReducer?.text,
        type: 'success',
        direction: 'bottom',
      });
    }
  }, [patientMessage, TriggerReducer]);

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
          insuranceNumber: item.insurance ? item.insurance.insurance_number : '',
          insuranceCompanyId: item.insurance ? item.insurance.insurance_company_id : '',
          insurancePlafonGroup: item.insurance ? item.insurance.insurance_plafon_group : '',
          familyRelationType: item.family_relation_type ? item.family_relation_type.id : '',
          contactEmail: item.contact_email,
          contactPhone: item.contact_phone,
        })
      );
      setDisplayFeaturePatient('FORM');
    }
  };

  // Render detail user and patients/family members
  const renderDetail = () => {
    if (!biodata) return null;

    const renderPatient = patient => (
      <div
        key={patient.id}
        className="w-full flex items-start justify-between gap-3 px-5 py-5 border-b border-solid border-light1"
      >
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-dark2 font-bold">{patient.family_relation_type?.name}</p>
          <SimpleBio data={patient} />
        </div>
        {role === 'MA' && (
          <button
            className="border border-solid border-mainColor text-mainColor p-2 rounded text-sm"
            onClick={() => openFormEditPatient(PatientSelectReducer?.data || patient)}
          >
            Edit Data
          </button>
        )}
      </div>
    );

    const renderNoPatient = () => (
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 px-5 py-5">
        <img src={Users} alt="Users icon" />
        <p className="text-xs xl:text-sm text-dark3">Tidak ada daftar keluarga saat ini</p>
      </div>
    );

    return (
      <>
        <LabelTitle text="" buttonBack={() => setBiodata(null)} />
        <div className="w-full flex items-start justify-between gap-3 px-5 py-5">
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-dark2 font-bold">User ID : {`${biodata.id}`}</p>
            <p className="text-dark2 font-bold">Pribadi</p>
            <SimpleBio data={biodata} image={true} />
          </div>
          <button
            className="border border-solid border-mainColor text-mainColor p-2 rounded text-sm"
            onClick={() => setIsEdit(true)}
          >
            Edit Data
          </button>
        </div>
        {/* Patients/Family members section */}
        <div className="flex items-center justify-between w-full bg-light3 py-2 px-5">
          <h2 className="text-darker text-sm font-semibold">Daftar Keluarga</h2>
          <button
            className="text-mainColor text-xs font-semibold uppercase"
            onClick={() => setDisplayFeaturePatient('FORM')}
          >
            + Tambah
          </button>
        </div>
        {patients.length ? patients.map(patient => renderPatient(patient)) : renderNoPatient()}
      </>
    );
  };

  // Render form for update user and patients/family members data
  const renderForm = () => <FormPatient />;

  return (
    <Template enableCallMA={role === 'MA'} active="dataUser" HeightElement={HeightElement}>
      <div className="w-full flex flex-wrap">
        <div className="w-1/2 bg-white">
          <GroupUser
            data={listUser}
            totalData={totalData}
            sectionHeaderHeight={sectionHeaderHeight}
            counterKeyword={value => handleCounterKeyword(value)}
            counter={value => handleCounterGroupUser(value)}
            counterLoading={value => handleCounterDetailuser(value)}
            loadingData={loadingData}
            counterPaggination={value => handleCounterPaggination(value)}
            isUserUpdated={TriggerReducer?.triggerSuccessEditUser}
          />
        </div>
        <div className="w-1/2 bg-white relative">
          {messageAlert !== null && (
            <AlertMessagePanel
              text={messageAlert.text}
              counter={value => {
                setPatientMessage(value);
                setMessageAlert(value);
              }}
              direction={messageAlert.direction}
            />
          )}
          {displayFeaturePatient && (
            <div className="w-full h-full absolute z-10 top-0 bg-white">
              <FormPatientMember
                formPatientMessage={formPatientMessage}
                addressSelected={address}
                removeAddressSelect={() => setAddress(null)}
                isShowing={displayFeaturePatient === 'FORM'}
                handlerClose={value => handleCloseFormPatient(value)}
                openAddresses={() => setDisplayFeaturePatient('ADDRESSES')}
                openFormAddress={() => setDisplayFeaturePatient('FORM-ADDRESS')}
                openCheckDataPatient={() => setDisplayFeaturePatient('CHECK-DATA-PATIENT')}
              />
              {displayFeaturePatient === 'FORM-ADDRESS' && (
                <FormAddress
                  addressId={addressId}
                  isOpenAddresses={isOpenAddresses}
                  userId={UserSelectReducer?.data?.id || null}
                  handlerClose={value => handleCloseFormAddress(value)}
                />
              )}
              <Addresses
                addressMessage={addressMessage}
                selectAddress={value => selectAddress(value)}
                isShowing={displayFeaturePatient === 'ADDRESSES'}
                clearAddressMessage={() => setAddressMessage(null)}
                handlerClose={() => setDisplayFeaturePatient('FORM')}
                openFormAddress={params => openFormAddressEdit(params)}
              />
              {displayFeaturePatient === 'CHECK-DATA-PATIENT' && (
                <FormCheckDataPatient
                  handlerClose={() => setDisplayFeaturePatient('FORM')}
                  handlerMessage={value => setFormPatientMessage(value)}
                />
              )}
            </div>
          )}
          <div
            className="flex flex-col overflow-y-auto scroll-small border-l border-solid content-start"
            style={{
              height: HeightElement !== '' ? HeightElement + 'px' : '',
              borderColor: '#F2F2F5',
            }}
          >
            {!isEdit && !loadingDataUserDetail ? renderDetail() : renderForm()}
            {loadingDataUserDetail && (
              <div className="absolute w-full h-full inset-0 bg-white z-10">
                <LoadingComponent />
              </div>
            )}
          </div>
        </div>
      </div>
    </Template>
  );
};

const GroupUser = ({
  sectionHeaderHeight,
  counter,
  counterKeyword,
  counterLoading,
  counterPaggination,
  data,
  loadingData,
  totalData,
  isUserUpdated,
}) => {
  const [dataIndex, setDataIndex] = useState('');
  const [filterParam, setFilterParam] = useState({
    page: 1,
    keyword: '',
  });

  const handleCounter = value => {
    setFilterParam({
      ...filterParam,
      keyword: value,
      page: 0,
    });
    counterKeyword(value);
  };

  const handleSelectUser = value => {
    setDataIndex(value);
  };

  useEffect(() => {
    counterLoading(true);
    if (dataIndex !== '') {
      const listData = [...data];
      Api.get(`/user/users/${listData[dataIndex].id}`, {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      })
        .then(res => {
          counter(res.data.data);
          counterLoading(false);
        })
        .catch(function (error) {
          counterLoading(false);
        });
    } else {
      counter(null);
      counterLoading(false);
    }
  }, [dataIndex, isUserUpdated]);

  const handleLoadMore = () => {
    let pageUpdate = parseInt(filterParam.page) + 1;
    setFilterParam({
      ...filterParam,
      page: pageUpdate,
    });

    counterPaggination({ page: pageUpdate, keyword: filterParam.keyword });
  };

  return (
    <div className="flex flex-wrap items-start border-r border-solid border-light2">
      <div id="header-top-list-patient" className="w-full py-4">
        <div className="px-4 pb-4">
          <InputSearchWithIcon
            placeholder="Tulis nama/No.KTP/Tanggal lahir"
            counter={value => handleCounter(value)}
          />
        </div>
        <LabelTitle text="Data Pasien terbaru" />
        <div className="flex flex-wrap items-center text-dark3 py-4 px-5">
          <div className="w-3/12 pr-2 text-dark2 font-bold">Nama</div>
          <div className="w-3/12 pr-2">KTP</div>
          <div className="w-2/12 pr-2">Tanggal lahir</div>
          <div className="w-4/12 px-5"></div>
        </div>
      </div>
      <div
        className="w-full overflow-y-auto scroll-small px-5 pb-4 relative"
        style={{
          height: sectionHeaderHeight !== '' ? sectionHeaderHeight + 'px' : '',
        }}
      >
        {data.length > 0 &&
          data.map((res, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center text-dark3 border-t border-solid border-gray-200 py-2 text-sm"
            >
              <div className="w-3/12 truncate text-dark2 font-bold pr-2">{`${res.first_name} ${res.last_name}`}</div>
              <div className="w-3/12 truncate pr-2">{`${res.user_details.id_card}`}</div>
              <div className="w-2/12 truncate pr-2 pl-1">{`${moment(
                res.user_details.birth_date
              ).format('DD/MM/YYYY')}`}</div>
              <div className="w-4/12 truncate pr-2 px-5 flex justify-between items-center">
                <ButtonTextAndBorderBlue
                  text="Lihat detail"
                  dimesion="py-1 px-6"
                  value={idx}
                  counter={value => handleSelectUser(value)}
                />
                <img src={ArrowRight} alt="Arrow Right Icon" />
              </div>
            </div>
          ))}

        {!loadingData && data.length < totalData && (
          <div className="w-full flex justify-center my-3">
            <button className="text-mainColor" onClick={handleLoadMore}>
              Tampilkan lebih
            </button>
          </div>
        )}

        {!loadingData && data.length < 1 && (
          <div className="absolute w-full h-full inset-0 bg-white z-10 flex items-center">
            <EmptyData text="Tidak ada data pasien" />
          </div>
        )}

        {loadingData && parseInt(filterParam.page) < 2 && (
          <div className="absolute w-full h-full m-auto inset-0 bg-white z-10">
            <LoadingComponent />
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  HeightElementReducer: state.HeightElementReducer.data,
  TriggerReducer: state.TriggerReducer.data,
});

const mapDispatchToProps = {
  UserDataSelected,
  TriggerUpdate,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPatientPage);
