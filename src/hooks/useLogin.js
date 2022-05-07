import { batch, useDispatch } from 'react-redux'
import { SetLoggedIn, SetAccessToken, SetRefreshToken, SetRole } from '../modules/actions'
import useShallowEqualSelector from '../helpers/useShallowEqualSelector'
import { Api } from '../helpers/api'
import { useState } from 'react'
import { useHistory } from 'react-router'

const useLogin = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const { loggedIn, accessToken, refreshToken, role } = useShallowEqualSelector((state) => state.TokenReducer)

  const loginUser = ({ email, password, role = 'PATIENT', redirectToRoot = false }) => {
    const payload = {
      email,
      password,
      role
    }
    Api.post('/user/auth/login', payload)
      .then(res => {
        batch(() => {
          dispatch(SetAccessToken(res.data.data.access_token))
          dispatch(SetRefreshToken(res.data.data.refresh_token))
          dispatch(SetRole(role));
          dispatch(SetLoggedIn(true));
        })
        if (redirectToRoot) {
          history.push(`/${role === "PRO" || role === "DOCTOR" ? "appointment" : ""}`)
        }
      })
      .catch(function (error) {
        setError(error?.response?.data?.message || 'Terjadi Kesalahan')
      })
  }

  const closeError = () => {
    setError(null)
  }

  return {
    error,
    loggedIn,
    accessToken,
    role,
    refreshToken,
    loginUser,
    closeError,
  }
}

export default useLogin;
