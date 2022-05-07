import { useState } from 'react';
import { ApiFile } from '../helpers/api';
import { LocalStorage } from '../helpers/localStorage';

const ServiceFileUpload = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [idCard, setIdCard] = useState({ id: '', url: '', beforeUpload: '' });
  const [progressBar, setProgressBar] = useState({ percent: 0, total: 0, name: '' });

  const uploadFileApi = (params, file) => new Promise((resolve) => {
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
        setProgressBar({
          ...progressBar,
          name: file.name,
          total,
          percent,
        });
      },
      headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
    };

    ApiFile.post(`/file/v1/file/upload`, params, options)
      .then((response) => {
        setProgressBar({ ...file, total: 0, percent: 0 });
        resolve(response.data.data);
      }).catch(() => {
        setProgressBar({ ...file, total: 0, percent: 0 });
        resolve({});
      });
  });

  const uploadPhotoId = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    const fileType = file.type;
    const fileSize = file.size;
    const validImageTypes = [
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (fileSize >= 10240000) {
      setErrorMessage({
        text: 'File hanya bisa di upload maximum 10 mb',
      });
    } else if (validImageTypes.indexOf(fileType) === -1) {
      setErrorMessage({
        text: 'File hanya bisa gambar',
      });
    }

    formData.append(
      'file',
      file,
      file.name,
    );

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setIdCard({
        ...idCard,
        beforeUpload: reader.result,
      });
    });
    reader.readAsDataURL(file);

    const result = await uploadFileApi(formData, file);
    const url = result.formats ? result.formats.small : result.url;

    setIdCard({
      id: result.id,
      url,
      beforeUpload: '',
    });
  };

  const removePhotoId = () => {
    setIdCard({
      id: '',
      url: '',
      beforeUpload: '',
    });
  };

  return {
    idCard,
    setIdCard,
    progressBar,
    errorMessage,
    removePhotoId,
    uploadPhotoId,
  };
};

export default ServiceFileUpload;
