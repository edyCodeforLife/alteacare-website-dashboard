import { axios } from '../../libraries'
import { LocalStorage, removeData } from '../localStorage'

const urlApi = process.env.REACT_APP_BASE_ALTEACARE_API || 'https://staging-services.alteacare.com'

export const Api = axios.create({
  baseURL: urlApi,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Language': 'ID'
})

Api.interceptors.request.use(
  config => { return config },
  error => { Promise.reject(error) }
)

Api.interceptors.response.use((response) => {
  return response
}, (error) => {
  const url = LocalStorage('role') === 'DOCTOR' || LocalStorage('role') === 'PRO' ? '/appointment' : '/';
  const condition = (
    (!LocalStorage('access_token') || !LocalStorage('refresh_token') || !LocalStorage('role'))
    && window.location.pathname !== '/login'
    && window.location.pathname !== '/forgot-password'
    && window.location.pathname !== '/select-role'
  )

  if (error && LocalStorage('access_token') && error?.response?.status === 401) {
    removeData('role')
    removeData('access_token')
    removeData('refresh_token')
    removeData(`persist:${process.env.REACT_APP_REDUX_KEY}`)
    window.location.href = '/'
  }

  if (condition) {
    window.location.href = url;
  }

  return Promise.reject(error);
})

export const ApiFile = axios.create({
  baseURL: urlApi,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
    'Accept-Language': 'ID',
  }
})

ApiFile.interceptors.request.use(
  config => { return config },
  error => { Promise.reject(error) }
)

ApiFile.interceptors.response.use((response) => {
  return response
}, function (error) {
  // return error.response
  return Promise.reject(error);
})
