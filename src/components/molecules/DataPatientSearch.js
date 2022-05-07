import { React, useState, useEffect } from '../../libraries';
import { debounce } from 'lodash';
import { connect } from 'react-redux';

import { LabelTitle } from '../atoms';
import { Api } from '../../helpers/api';
import { LocalStorage } from '../../helpers/localStorage';
import { SimpleBio, SimpleBioSap } from '../molecules/bio';
import { CheckBox, UncheckBox } from '../../assets/images';

import { EmptyData, LoadingComponent, InputSearchWithIcon } from '../molecules';

import {
  TriggerUpdate,
  UserDataSelected,
  CreateParamsAppointment,
} from '../../modules/actions';

const DataPatient = ({
  type,
  userId,
  TriggerUpdate,
  UserDataSelected,
  counterFillAddress,
  ParamCreateAppointment,
  CreateParamsAppointment,
}) => {
  const [list, setList] = useState([]);
  const [listSap, setListSap] = useState([]);
  const [loadingListUser, setLoadingListUser] = useState(false);
  const [loadingListUserSap, setLoadingListUserSap] = useState(false);
  const [display] = useState(true);
  const [page] = useState(1);
  const [keyword, setKeyword] = useState('');

  const loadList = () => {
    setList([]);
    setLoadingListUser(true);
    Api.get(
      `/user/users?page=${page}${keyword !== '' ? '&keyword=' + keyword : ''}${
        userId !== '' ? '&user_id' : ''
      }`,
      {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      }
    )
      .then(res => {
        setLoadingListUser(false);
        setList(res.data.data.users);
      })
      .catch(function (error) {
        setLoadingListUser(false);
        setList([]);
      });
  };

  const loadListGetPatient = () => {
    setListSap([]);
    setLoadingListUserSap(true);
    Api.get(`/appointment/check-patient-sap?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(res => {
        setLoadingListUserSap(false);
        setListSap(res.data.data);
      })
      .catch(function (error) {
        setLoadingListUserSap(false);
        setListSap([]);
      });
  };

  useEffect(() => {
    if (keyword !== '') {
      loadList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword]);

  useEffect(() => {
    if (userId !== '') {
      loadListGetPatient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleCounter = debounce(text => {
    if (text) setKeyword(text);
    else setKeyword('');
  }, 700);

  const handleCheckbox = index => {
    const patients = type === 'call' ? [...listSap] : [...list];
    patients.map((patient, idx) => {
      return (patient.check = index === idx);
    });

    if (type === 'call') setListSap(patients);
    else setList(patients);
  };

  const handleClick = (index, value) => {
    if (type !== 'call') {
      // create user_id param for create appoitment
      let ParamCreateAppointmentData = { ...ParamCreateAppointment };
      // ParamCreateAppointmentData.consultation_method = "VIDEO_CALL"
      ParamCreateAppointmentData.user_id = value;
      CreateParamsAppointment(ParamCreateAppointmentData);

      // select user for data
      let listData = [...list];
      UserDataSelected(listData[index]);
      // change section component html
      TriggerUpdate({
        addAppointment: true,
      });
    } else {
      // counterFillAddress
      counterFillAddress(value);
    }
  };

  const counterButtonBack = () => {
    if (type !== 'call') {
      TriggerUpdate({
        closeSectionright: true,
      });
    } else {
      TriggerUpdate({
        closeSectionrightTypeCall: true,
      });
    }
  };

  return (
    <div className="w-full">
      <LabelTitle
        text="Data Patient"
        fontStyle="font-bold"
        buttonBack={() => counterButtonBack()}
      />
      {type !== 'call' ? (
        <div className="w-full px-5 my-3">
          <InputSearchWithIcon
            placeholder="Tulis nama/No.KTP/Tanggal lahir"
            counter={value => handleCounter(value)}
          />
        </div>
      ) : (
        ''
      )}
      {type !== 'call' ? (
        <>
          {list && list.length > 0 ? (
            list.map((res, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-wrap w-full ${
                    display ? 'block' : 'hidden'
                  }`}
                >
                  <div className="w-full px-6 py-5 border-b border-solid border-light1">
                    <SimpleBio data={res} />
                    <div className="flex flex-wrap items-center mt-5">
                      <p
                        className="mr-auto text-sm flex flex-wrap items-center text-dark2 cursor-pointer"
                        onClick={() => handleCheckbox(index)}
                      >
                        <img
                          src={res.check ? CheckBox : UncheckBox}
                          value={res.check}
                          alt="Check Box"
                          className="inline mr-3"
                        />{' '}
                        Pilih
                      </p>
                      <button
                        onClick={() => handleClick(index, res.id)}
                        disabled={!res.check}
                        style={{
                          borderColor: `${res.check ? '#5B8AD0' : '#C7C9D9'}`,
                          color: `${res.check ? '#5B8AD0' : '#C7C9D9'}`,
                        }}
                        className="ml-auto border border-solid rounded bg-white text-xs py-1 px-3"
                      >
                        Tambahkan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {(() => {
                if (
                  list &&
                  list.length < 1 &&
                  !loadingListUser &&
                  keyword.length > 0
                ) {
                  return (
                    <EmptyData
                      text="Data pasien tidak ditemukan!"
                      styleWrap="py-16"
                    />
                  );
                } else if (list && list.length < 1 && loadingListUser) {
                  return <LoadingComponent className="my-20" />;
                }
              })()}
            </>
          )}
        </>
      ) : (
        ''
      )}
      {type === 'call' ? (
        <>
          {listSap && listSap.length > 0 ? (
            listSap.map((res, index) => {
              return (
                <div key={index} className={`flex flex-wrap w-full`}>
                  <div className="w-full px-6 py-5 border-b border-solid border-light1">
                    <SimpleBioSap data={res} />
                    <div className="flex flex-wrap items-center mt-5">
                      <p
                        className="mr-auto text-sm flex flex-wrap items-center text-dark2 cursor-pointer"
                        onClick={() => handleCheckbox(index)}
                      >
                        <img
                          src={res.check ? CheckBox : UncheckBox}
                          value={res.check}
                          alt="Check Box"
                          className="inline mr-3"
                        />{' '}
                        Pilih
                      </p>
                      <button
                        className="ml-auto border border-solid rounded bg-white text-xs py-1 px-3"
                        onClick={() => handleClick(index, res.address)}
                        disabled={!res.check}
                        style={{
                          borderColor: `${res.check ? '#5B8AD0' : '#C7C9D9'}`,
                          color: `${res.check ? '#5B8AD0' : '#C7C9D9'}`,
                        }}
                      >
                        Tambahkan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {(() => {
                if (listSap && listSap.length < 1 && !loadingListUserSap) {
                  return (
                    <EmptyData
                      text="Data pasien tidak ditemukan!"
                      styleWrap="py-16"
                    />
                  );
                } else if (
                  listSap &&
                  listSap.length < 1 &&
                  loadingListUserSap
                ) {
                  return <LoadingComponent className="my-20" />;
                }
              })()}
            </>
          )}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

DataPatient.defaultProps = {
  userId: '',
  counterFillAddress: '',
};

const mapStateToProps = state => ({
  ParamCreateAppointment: state.ParamCreateAppointment.data,
});

const mapDispatchToProps = {
  TriggerUpdate,
  UserDataSelected,
  CreateParamsAppointment,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPatient);
