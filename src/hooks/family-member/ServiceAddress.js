import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '../../helpers/api';
import { LocalStorage } from '../../helpers/localStorage';
import { AddressAction } from '../../modules/actions/family-member/Address__Action';

const ServiceAddress = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [address, setAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isCloseFormAddress, setIsCloseFormAddress] = useState(null);

  const proccessApi = payload =>
    new Promise(resolve => {
      setLoader(true);
      payload.method
        .then(response => {
          resolve(response);
          setLoader(false);
        })
        .catch(error => {
          resolve(error);
          setLoader(false);
        });
    });

  const setRedux = params => {
    dispatch(AddressAction(params));
  };

  const clearRedux = () => {
    dispatch(AddressAction({ reset: true }));
  };

  const close = () => setMessage(null);

  const camelToSnakeCase = payload =>
    new Promise(resolve => {
      if (
        payload &&
        typeof payload === 'object' &&
        Object.keys(payload).length > 0
      ) {
        const result = {};
        for (const item in payload) {
          if (payload.hasOwnProperty(item)) {
            const convert = item.replace(
              /[A-Z]/g,
              letter => `_${letter.toLowerCase()}`
            );
            result[convert] = payload[item];
          }
        }
        resolve(result);
      }
    });

  const addAddress = async payload => {
    if (payload.userId === '') return;
    if (payload.street === '') {
      setMessage('Silahkan Masukan Alamat');
      return;
    }
    if (payload.country === '') {
      setMessage('Silahkan Pilih Negara');
      return;
    }
    if (payload.province === '') {
      setMessage('Silahkan Pilih Provinsi');
      return;
    }
    if (payload.city === '') {
      setMessage('Silahkan Pilih Kota');
      return;
    }
    if (payload.district === '') {
      setMessage('Silahkan Pilih Kecamatan');
      return;
    }
    if (payload.subDistrict === '') {
      setMessage('Silahkan Pilih Keluarahan');
      return;
    }
    if (payload.rtRw === '') {
      setMessage('Silahkan Masukan RT/RW');
      return;
    }
    const params = await camelToSnakeCase(payload);
    if (payload.addressId) delete params.user_id;
    delete params.address_id;
    const process = await proccessApi({
      method: Api.post(
        `/user/address${payload.addressId ? '/' + payload.addressId : ''}`,
        params,
        {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        }
      ),
    });
    if (process?.data?.status) {
      getAddresses(payload.userId);
      setIsCloseFormAddress({
        status: true,
        message: payload.addressId
          ? 'Berhasil memperbarui alamat'
          : 'Berhasil menambah alamat',
      });
    }
  };

  /**
   * get user default address
   * @param {string} payload -> user id
   * @returns response result
   */
  const getDefaultAddress = async payload => {
    const result = await Api.get(`/user/address/default?user_id=${payload}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    });
    return result;
  };

  const getAddress = async payload => {
    if (payload && payload.addressId) {
      const params = {
        method: Api.get(`/user/address/${payload.addressId}`, {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        }),
      };
      const response = await proccessApi(params);
      setAddress(response?.data?.data || null);
    }
  };

  const getAddresses = async payload => {
    if (payload && payload.userId) {
      const params = {
        method: Api.get('/user/address', {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
          params: {
            user_id: payload.userId,
          },
        }),
      };
      const response = await proccessApi(params);
      const result =
        response?.data?.data?.address?.length > 0
          ? response.data.data.address
          : [];
      setAddresses(result);
    }
  };

  const selectPrimaryAddress = async payload => {
    if (payload && payload.addressId) {
      const params = {
        method: Api.get(`/user/address/${payload.addressId}/set-primary`, {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
          params: {
            user_id: payload.userId,
          },
        }),
      };
      const response = await proccessApi(params);
      if (response?.data?.status) {
        getAddresses({ userId: payload.userId });
      }
    }
  };

  return {
    close,
    loader,
    address,
    message,
    setRedux,
    addresses,
    addAddress,
    getAddress,
    clearRedux,
    getDefaultAddress,
    getAddresses,
    isCloseFormAddress,
    selectPrimaryAddress,
    setIsCloseFormAddress,
  };
};

export default ServiceAddress;
