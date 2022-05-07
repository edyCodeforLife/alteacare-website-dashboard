import { React, useEffect, useState, useLocation } from '../../libraries'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import { Footer } from '../molecules/layout'
import { TokenCreate } from '../../modules/actions'
import {
  HidePassword,
  ShowPassword,
  ChevronLeft,
  BgFirstPage,
  Logo,
  AlertCloseWhite,
  WarningWhite
} from '../../assets/images'
import useLogin from '../../hooks/useLogin'

const Login = ({ HeightElementReducer, TokenCreate, TokenReducer }) => {
  const location = useLocation()
  const { error: errorLogin, loginUser, closeError } = useLogin()
  const [showPwd, setShowPwd] = useState(false)
  const [disbaled, setDisabled] = useState(true);
  const [HeightElement, setHeightElement] = useState("")
  const [state, setState] = useState({
    email: '',
    password: '',
    role: location.state.role
  })

  useEffect(() => {
    if(HeightElementReducer !== null){
      setHeightElement(parseInt(HeightElementReducer.heightElement))
    }
  }, [HeightElementReducer])

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.getAttribute('name')]: event.target.value
    })
  }

  useEffect(() => {
    const condition = (
      (state.email !== "") && (state.password !== "")
    )

    if (condition) setDisabled(false);
    else setDisabled(true);
  }, [state])

  const showPassword = () => {
    setShowPwd(!showPwd)
  }

  const submit = (event) => {
    event.preventDefault()
    loginUser({
      ...state,
      redirectToRoot: true,
    })
  }

  const duration = 500
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  }
  const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
  };

  return (
    <>
      <div
        className="fixed w-full h-full flex flex-wrap overflow-auto"
        style={{
          backgroundImage: "linear-gradient(#FFFFFF, #FFFFFF, #FFFFFF, #D6EDF6)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div
          className="w-full flex flex-wrap items-center overflow-auto small-scroll lg:px-0 px-5"
          style={{
            height: HeightElement !== "" ? HeightElement+"px" : ""
          }}
        >
          <div className="w-full flex flex-wrap items-start">
            <div className="w-full relative z-10 flex justify-center mb-6">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="relative z-10 inset-x-auto xl:w-1/3 lg:w-1/2 sm:w-3/4 px-8 w-full mx-auto bg-white rounded-lg shadow-lg border border-solid border-grey-200" style={{ boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)" }}>
              <Link to="/" className="text-lg mt-5 font-bold text-info1 flex items-center">
                <img src={ChevronLeft} alt="Chevron Left Icon" className="mr-5" />
                Kembali
              </Link>
              <Transition in={errorLogin} timeout={duration}>
                {state => (
                  <div
                    className="w-full py-3 px-5 text-white bg-error3 self-end absolute bottom-0 left-0 flex items-center justify-between rounded-b"
                    style={{
                      ...defaultStyle,
                      ...transitionStyles[state]
                    }}
                  >
                    <div className="flex items-center">
                      <img src={WarningWhite} className="inline mr-3" alt="" />
                      <p>{errorLogin}</p>
                    </div>
                    <img src={AlertCloseWhite} className="inline cursor-pointer" onClick={() => closeError()} alt=""  />
                  </div>
                )}
              </Transition>
              <div className="mb-12 mt-2 pt-5 pb-16 px-8">
                <p className="text-center text-darker">
                  Anda Masuk sebagai<br />
                  <b>{location && location.state ? location.state.name : ""}</b>
                </p>
                <form className="w-full flex flex-wrap" onSubmit={submit}>
                  <input
                    autoComplete="off"
                    type="text"
                    name="email"
                    className="w-full border border-solid rounded py-3 px-3 mt-6 text-base"
                    value={state.email}
                    onChange={handleChange}
                    onPaste={handleChange}
                    placeholder="Tulis email"
                    style={{ borderColor: "#DDE5E9" }}
                  />
                  <div className="relative w-full mt-6 flex flex-wrap items-center">
                    <img
                      src={showPwd ? ShowPassword : HidePassword}
                      alt="Hide Password Icon"
                      className="cursor-pointer absolute right-0 my-auto mr-3 inset-y-auto z-10"
                      onClick={showPassword} />
                    <input
                      type={showPwd ? "text" : "password"}
                      name="password"
                      className="w-full border border-solid rounded py-3 px-3 text-base"
                      value={state.password}
                      onChange={handleChange}
                      onPaste={handleChange}
                      placeholder="Masukkan Password"
                      style={{ borderColor: "#DDE5E9" }}
                    />
                  </div>
                  <Link to="/forgot-password" className="w-full text-right mt-2 text-sm" style={{ color: "#3868B0" }}>Lupa Password?</Link>
                  <button
                    disbaled={ disbaled.toString() }
                    type="submit"
                    className="w-full border border-solid py-2 px-3 mt-6 text-white text-center lg:text-lg text-base rounded"
                    style={{
                      backgroundColor: disbaled ? '#C7C9D9' : '#61C7B5',
                      cursor: disbaled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Masuk
                  </button>
                </form>
              </div>
            </div>
          </div>
          <img src={BgFirstPage} alt="Bg First Page" className="absolute bottom-0 -inset-x-0 mx-auto" />
        </div>
        <Footer />
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  HeightElementReducer: state.HeightElementReducer.data,
  TokenReducer: state.TokenReducer.data
})

const mapDispatchToProps = {
  TokenCreate
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
