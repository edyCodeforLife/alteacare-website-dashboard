import { Api } from '../../helpers/api';
import { LocalStorage } from '../../helpers/localStorage';

const AppointmentDetail = () => {
  const getAppointmentDetail = (id) => new Promise((resolve, reject) => {
    Api.get(`/appointment/v1/consultation/${id}`, {
      headers: { Authorization : `Bearer ${LocalStorage('access_token')}` }
    }).then(response => {
      resolve(response);
    }).catch((error) => {
      reject(error);
    });
  });

  const getAppointmentDetailFinish = (id) => new Promise((resolve, reject) => {
    Api.get(`/appointment/v1/consultation/${id}/finish-meet-specialist`, {
      headers: { Authorization : `Bearer ${LocalStorage('access_token')}` }
    }).then(response => {
      resolve(response);
    }).catch((error) => {
      reject(error);
    });
  });

  return {
    getAppointmentDetail,
    getAppointmentDetailFinish,
  }
}

export default AppointmentDetail;
