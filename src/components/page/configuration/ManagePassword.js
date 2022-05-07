import { React, useEffect, useState, useLocation } from '../../../libraries';
import { connect } from 'react-redux';
import { LocalStorage } from '../../../helpers/localStorage';
import { Api } from '../../../helpers/api';
import { Template } from '../../molecules/layout';
import { AddNewPassword } from '.';
import { AlertMessagePanel } from '../../molecules/modal';
import { HidePassword, ShowPassword } from '../../../assets/images';

const ManagePassword = ({ HeightElementReducer, type }) => {
  let location = useLocation();
  const role = LocalStorage('role');
  const [sectionAddNewPass, setSectionAddNewPass] = useState(false);
  const [sectionVerifyOtp, setSectionVerifyOtp] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState(null);
  const [HeightElement, setHeightElement] = useState('');
  const [disbaled, setDisabled] = useState(true);
  const [messageAlert, setMessageAlert] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [responseVerifyOtpForgot, setResponseVerifyOtpForgot] = useState(null);
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  let pathname = location.pathname;

  useEffect(() => {
    if (HeightElementReducer !== null) {
      setHeightElement(HeightElementReducer.heightElement);
    }
  }, [HeightElementReducer]);

  const handleChange = event => {
    if (event.target.value !== '') setDisabled(false);
    else setDisabled(true);

    setState({
      ...state,
      [event.target.getAttribute('name')]: event.target.value,
    });
  };

  const showPassword = () => {
    setShowPwd(!showPwd);
  };

  const handleSubmit = event => {
    event.preventDefault();
    let url;
    let stateUpate;
    if (pathname === '/forgot-password') {
      url = '/user/password/forgot';
      stateUpate = { email: state.email };
    } else {
      url = '/user/password/check';
      stateUpate = { password: state.password };
    }

    Api.post(`${url}`, stateUpate, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(response => {
        if (pathname === '/forgot-password') {
          setEmailForOtp(state.email);
          setSectionVerifyOtp(true);
        } else {
          setSectionAddNewPass(true);
        }
      })
      .catch(error => {
        event.target.value = '';
        setMessageAlert({
          text: error.response.data.message,
          type: 'failed',
        });
      });
  };

  const handleCounter = message => {
    // if(message){
    setMessageAlert(message);
    // }
    setState({
      password: '',
    });
    setSectionAddNewPass(false);
  };

  const handleCounterSuccesQuery = data => {
    setSectionVerifyOtp(false);
    setSectionAddNewPass(true);
    setResponseVerifyOtpForgot(data);
  };

  return (
    <Template
      enableCallMA={role === 'MA'}
      active="home"
      type="configuration"
      HeightElement={HeightElement}
    >
      <div
        className="w-full flex flex-wrap h-full overflow-y-auto"
        style={{ height: HeightElement !== '' ? HeightElement + 'px' : '' }}
      >
        {!sectionAddNewPass && !sectionVerifyOtp ? (
          <div className="w-full flex flex-wrap bg-white">
            <div className="xl:w-1/3 md:w-2/3 w-full px-10 py-10 relative">
              <p className="text-xl text-dark1 mb-2">
                {`${pathname === '/forgot-password' ? 'Lupa' : 'Ubah'}`}{' '}
                password
              </p>
              <p className="text-dark1">
                Masukkan{' '}
                {`${pathname === '/forgot-password' ? 'Email' : 'password'}`}{' '}
                untuk membuat
                <br />
                password baru
              </p>
              <form
                autoComplete="off"
                className="relative w-full mt-6 flex flex-wrap items-center relative"
                onSubmit={handleSubmit}
              >
                {pathname !== '/forgot-password' ? (
                  <img
                    src={showPwd ? ShowPassword : HidePassword}
                    alt="Hide Password Icon"
                    className="cursor-pointer absolute right-0 top-0 my-auto mt-4 mr-3 inset-y-auto z-10"
                    onClick={showPassword}
                  />
                ) : (
                  ''
                )}
                <input
                  type={
                    pathname === '/forgot-password'
                      ? 'text'
                      : showPwd
                      ? 'text'
                      : 'password'
                  }
                  name={pathname === '/forgot-password' ? 'email' : 'password'}
                  className="w-full border border-solid border-light1 rounded py-3 pl-3 pr-10 text-base"
                  value={
                    pathname === '/forgot-password'
                      ? state.email
                      : state.password
                  }
                  onChange={handleChange}
                  placeholder={`Masukkan ${
                    pathname === '/forgot-password' ? 'Email' : 'password'
                  }`}
                  autoComplete="off"
                  required={true}
                />
                <button
                  className="active:bg-dark3 text-white font-bold px-3 py-2 rounded-lg mt-8"
                  style={{ backgroundColor: disbaled ? '#C7C9D9' : '#61C7B5' }}
                >
                  {`${
                    pathname === '/forgot-password'
                      ? 'Submit Email'
                      : 'Buat password baru'
                  }`}
                </button>
              </form>
              {messageAlert ? (
                <AlertMessagePanel
                  text={messageAlert.text}
                  direction="bottom"
                  type={messageAlert.type}
                  counter={value => setMessageAlert(value)}
                />
              ) : (
                ''
              )}
            </div>
          </div>
        ) : (
          ''
        )}
        {sectionVerifyOtp ? (
          <VerifyOtp
            emailForOtp={emailForOtp}
            counterSuccessQuery={value => handleCounterSuccesQuery(value)}
          />
        ) : (
          ''
        )}
        {sectionAddNewPass ? (
          <AddNewPassword
            counter={value => handleCounter(value)}
            responseVerifyOtpForgot={responseVerifyOtpForgot}
          />
        ) : (
          ''
        )}
      </div>
    </Template>
  );
};

const VerifyOtp = ({ emailForOtp, counterSuccessQuery }) => {
  const [disbaled, setDisabled] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const [params, setParams] = useState({
    email: emailForOtp,
    otp: '',
  });

  const handleSubmit = event => {
    event.preventDefault();
    setDisabled(true);

    Api.post(`/user/password/verify`, params)
      .then(res => {
        counterSuccessQuery(res.data.data);
        // console.log(res)
        setDisabled(false);
      })
      .catch(function (error) {
        setMessageAlert({
          text: error.response.data.message,
          type: 'failed',
        });
        setDisabled(false);
      });
  };

  const handleChange = event => {
    setParams({
      ...params,
      otp: event.target.value,
    });
  };

  return (
    <div className="w-full flex flex-wrap bg-white">
      <div className="xl:w-1/3 md:w-2/3 w-full px-10 py-10 relative">
        <p className="text-xl text-dark1 mb-2">
          Cek email untuk melihat kode OTP
        </p>
        <p className="text-dark1">
          Masukkan kode OTP untuk membuat
          <br />
          password baru
        </p>
        <form
          className="relative w-full mt-6 flex flex-wrap items-center relative"
          onSubmit={handleSubmit}
        >
          <p className="w-full py-3 text-lg">{emailForOtp}</p>
          <input
            type="text"
            name="otp"
            className="w-full border border-solid border-light1 rounded py-3 pl-3 pr-10 text-base"
            value={params.otp}
            onChange={handleChange}
            placeholder={`Masukkan Kode OTP`}
            required={true}
          />
          <button
            disabled={disbaled}
            className="active:bg-dark3 text-white font-bold px-3 py-2 rounded-lg mt-8"
            style={{ backgroundColor: disbaled ? '#C7C9D9' : '#61C7B5' }}
          >
            Submit
          </button>
        </form>
        {messageAlert !== null ? (
          <AlertMessagePanel
            text={messageAlert.text}
            direction="bottom"
            type={messageAlert.type}
            counter={value => setMessageAlert(value)}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

ManagePassword.defaultProps = {
  type: 'change-password',
};

const mapStateToProps = state => ({
  HeightElementReducer: state.HeightElementReducer.data,
});

export default connect(mapStateToProps, null)(ManagePassword);
