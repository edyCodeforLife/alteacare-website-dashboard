import React, { useState, useEffect } from 'react';
import { Api } from '../../helpers/api';
import { LocalStorage } from '../../helpers/localStorage';
import { AlertcloseBlue } from '../../assets/images';
import Loader from './loader/Loader';
import EmptyData from '../molecules/EmptyData';
import AlertMessagePanel from '../molecules/modal/AlertMessagePanel';
import FormCheckDataPatient from '../molecules/formPatient/FormCheckDataPatient';

const CurrentAndCheckMedicalRecord = ({ handleClose, payload }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [medicalRecord, setMedicalRecord] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState(null);
  const classActiveTab =
    'text-info2 border-b-2 border-info2 border-solid font-bold';

  const setMessageAlert = (type, text) => {
    setMessage({ type, text });
  };

  const checkDataPatientApi = (patientId, userId) =>
    new Promise((resolve, reject) => {
      Api.get(`/user/patient/${patientId}?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error?.response || 'Something Wrong!');
        });
    });

  const checkDataPatient = async () => {
    try {
      setIsLoading(true);
      const result = await checkDataPatientApi(
        payload?.patientId,
        payload?.userId
      );
      setMedicalRecord(result?.data?.data?.external_patient_id);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setMedicalRecord({});
      setMessageAlert('failed', error?.data?.message || 'Something Wrong!');
    }
  };

  const updateMedrecApi = params =>
    new Promise((resolve, reject) => {
      Api.post(
        `/user/patient/${params.patientId}`,
        { ...params?.payload },
        {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        }
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error?.response || 'Something Wrong!');
        });
    });

  const actionUpdateMedrec = async params => {
    try {
      setIsLoading(true);
      await updateMedrecApi(params);
      setMessageAlert(
        'success',
        `Pasien ${params?.payload?.first_name} ${params?.payload?.last_name} 
        dengan Medical Record ${params?.payload?.external_patient_id} berhasil diupdate`
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setMessageAlert('failed', error?.data?.message || 'Something Wrong!');
    }
  };

  const updateMedrec = params => {
    const paramsUpdate = {
      patientId: payload?.patientId,
      payload: {
        user_id: payload?.userId,
        first_name: params?.firstName,
        last_name: params?.lastName,
        external_provider: params?.externalProvider,
        external_patient_id: params?.externalPatientId,
      },
    };

    actionUpdateMedrec(paramsUpdate);
  };

  useEffect(() => {
    checkDataPatient(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, activeTab]);

  useEffect(
    () => () => {
      setMedicalRecord({});
      setIsLoading(true);
      setActiveTab(0);
      setMessage(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="flex flex-col items-start content-start absolute z-10 left-0 top-0 w-full h-full bg-white pt-6">
      <div className="w-full flex flex-row items-center justify-between bg-light3">
        <div className="w-full">
          <button
            type="button"
            onClick={() => setActiveTab(0)}
            className={`${
              activeTab === 0 ? classActiveTab : 'text-dark2'
            } py-2 text-sm xl:px-3 px-2 xl:mr-2 mr-1`}
          >
            Current Medical Record
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`${
              activeTab === 1 ? classActiveTab : 'text-dark2'
            } py-2 text-sm xl:px-3 px-2 xl:mr-2 mr-1`}
          >
            Check Medical Record
          </button>
        </div>
        <img
          alt="close"
          src={AlertcloseBlue}
          className="inline mr-4 cursor-pointer"
          onClick={() => handleClose()}
        />
      </div>
      <div className="w-full pt-2 flex-1 flex justify-center items-center overflow-y-auto scroll-small">
        {!isLoading &&
          activeTab === 0 &&
          medicalRecord &&
          Object.keys(medicalRecord).length > 0 && (
            <div className="lg:w-auto md:w-full overflow-x-auto px-4">
              <p className="text-lg font-bold">Current Medical Record</p>
              <div className="table mt-2">
                {Object.keys(medicalRecord).map((row, idx) => (
                  <div key={idx} className="text-sm table-row">
                    <span className="table-cell pt-2">{row}</span>
                    <span className="table-cell pt-2 px-2">:</span>
                    <span className="table-cell pt-2">
                      {medicalRecord[row]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        {!isLoading && activeTab === 1 && (
          <FormCheckDataPatient
            isPanelTitle={false}
            isHospitalField={false}
            payloadAppointmentDetail={payload || null}
            handlerMedicalRecordPro={value => updateMedrec(value)}
          />
        )}
        {!isLoading &&
          activeTab === 0 &&
          medicalRecord &&
          Object.keys(medicalRecord).length < 1 && (
            <div className="w-full h-full flex items-center my-5">
              <EmptyData text="Tidak ada Medical Record" />
            </div>
          )}
        {isLoading && <Loader />}
        {message && (
          <AlertMessagePanel
            counter={() => setMessage(null)}
            direction="bottom"
            type={message?.type}
            text={message?.text}
          />
        )}
      </div>
    </div>
  );
};

export default CurrentAndCheckMedicalRecord;
