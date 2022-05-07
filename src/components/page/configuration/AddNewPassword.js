import { React, useEffect, useState } from '../../../libraries'
import { connect } from 'react-redux'
import { LocalStorage } from '../../../helpers/localStorage'
import { Api } from '../../../helpers/api'
import { AlertMessagePanel } from '../../molecules/modal'

const AddNewPassword = ({ counter, HeightElementReducer, responseVerifyOtpForgot }) => {
  const [, setHeightElement] = useState("")
  const [messageAlert, setMessageAlert] = useState(null)
  const [disbaled, setDisabled] = useState(true)
  const [state, setState] = useState({
    password: '',
    password_confirmation: ''
  })

  useEffect(() => {
    if (HeightElementReducer !== null) {
      setHeightElement(HeightElementReducer.heightElement)
    }
  }, [HeightElementReducer])

  // change state param
  const handleChange = (event) => {
    const value = event.target.value;
    const condition = (
      (state.password && value !== "") &&
      (state.password_confirmation && value !== "")
    )

    if (condition) setDisabled(false);
    else setDisabled(true);

    setState({
      ...state,
      [event.target.getAttribute('name')]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    let access_token
    if(responseVerifyOtpForgot){
      access_token = responseVerifyOtpForgot.access_token
    } else {
      access_token = LocalStorage('access_token')
    }
    Api.post(`/user/password/change`, state, {
      headers: { "Authorization" : `Bearer ${access_token}` }
    })
    .then(res => {
      if(responseVerifyOtpForgot){
        counter({
          text: "Berhasil membuat password baru, silahkan login kembali",
          type: "success"
        })
      } else {
        counter({
          text: "Berhasil membuat password baru",
          type: "success"
        })
      }
    })
    .catch(function (error) {
      console.log(error.response.data.message)
      setMessageAlert(
        {
          text: error.response.data.message,
          type: "failed"
        }
      )
    })
  }

  return (
    <div className="w-full flex flex-wrap bg-white">
      <div className="xl:w-1/3 md:w-2/3 w-full px-10 py-10 flex flex-wrap content-start relative">
        <p className="w-full text-xl text-dark1 mb-2">Buat password baru</p>
        <p className="w-full text-dark1">Password digunakan untuk masuk ke aplikasi</p>
        <form className="w-full mt-6 flex flex-wrap" onSubmit={handleSubmit}>
          <p className="font-bold">Masukkan password baru</p>
          <input
            type={"password"}
            name="password"
            className="w-full border border-solid border-light1 rounded py-3 px-3 text-base mb-5"
            value={state.password}
            onChange={handleChange}
            required={true}
            placeholder="buat password baru"
          />
          <p className="font-bold">Masukkan Kembali Password</p>
          <input
            type={"password"}
            name="password_confirmation"
            className="w-full border border-solid border-light1 rounded py-3 px-3 text-base mb-5"
            value={state.confirmPassword}
            onChange={handleChange}
            required={true}
            placeholder="masukkan kembali password"
          />
          <button className="bg-dark4 active:bg-dark3 text-white font-bold px-3 py-2 rounded-lg mt-8"
            style={{ backgroundColor: disbaled ? '#C7C9D9' : '#61C7B5', }}
          >
            Simpan
          </button>
        </form>
        {messageAlert !== null ?
          <AlertMessagePanel text={messageAlert.text} direction="bottom" type={messageAlert.type} counter={(value) => setMessageAlert(value)} />
        : ""}
      </div>
    </div>
  )
}

AddNewPassword.defaultProps = {
  responseVerifyOtpForgot: null
}

const mapStateToProps = (state) => ({
  HeightElementReducer: state.HeightElementReducer.data
})

export default connect(mapStateToProps, null)(AddNewPassword)
