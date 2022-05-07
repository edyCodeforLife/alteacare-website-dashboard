// CRUD document helper
import { Api, ApiFile } from 'helpers/api';
import { LocalStorage } from 'helpers/localStorage';

/**
 * upload document helper
 * @param {int} appointmentID
 * @param {obj} formData (uploaded file)
 * @param {event} onUploadProgress (for progress bar)
 */
export const uploadDocument = async (appointmentID, formData, onUploadProgress) => {
  try {
    // 1st request to get file ID from uploaded file
    const resp1 = await ApiFile.post('/file/v1/file/upload', formData, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      onUploadProgress,
    });

    // 2nd request to add doc based on file ID
    return await Api.post(
      '/appointment/v1/document/add',
      {
        appointment_id: appointmentID,
        file: resp1.data.data.id,
      },
      {
        headers: {
          Authorization: `Bearer ${LocalStorage('access_token')}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * delete document helper
 * @param {int} appointmentID
 * @param {string} fileID
 */
export const deleteDocument = async (appointmentID, docID) => {
  try {
    await Api.post(
      '/appointment/v1/document/remove',
      {
        appointment_id: appointmentID,
        document_id: docID,
      },
      {
        headers: {
          Authorization: `Bearer ${LocalStorage('access_token')}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {int} bytes : document size
 */
export const convertBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Byte';
  }
  var k = 1024; //Or 1 kilo = 1000
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + sizes[i];
};
