import { batch, useDispatch } from 'react-redux'
import { SetLoggedIn, SetAccessToken, SetRefreshToken, SetRole } from '../modules/actions'
import useShallowEqualSelector from '../helpers/useShallowEqualSelector'
import { Api } from '../helpers/api'
import { useHistory } from 'react-router'
import { useState } from 'react'

const useLogout = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const { accessToken } = useShallowEqualSelector((state) => state.TokenReducer)

  const logoutUser = ({redirectToLogin = false }) => {
      Api.post('/user/auth/logout', "", {
        headers: { "Authorization" : `Bearer ${accessToken}` }
      })
      .then(res => {
        batch(() => {
          dispatch(SetAccessToken(null))
          dispatch(SetRefreshToken(null))
          dispatch(SetRole(null));
          dispatch(SetLoggedIn(false));
        })

        if (redirectToLogin) {
          history.push("/")
        }
      })
      .catch(function (error){
        setError(error?.response?.data?.message || 'Terjadi Kesalahan')
      })
  }

  return {
    error,
    logoutUser,
  }
}
export default useLogout;
