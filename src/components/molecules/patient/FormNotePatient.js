import { React, useEffect, useState } from '../../../libraries';
// import { Link } from 'react-router-dom'
import { LocalStorage } from '../../../helpers/localStorage';
import { connect } from 'react-redux';
import {
  CreateParamsAppointment,
  DocumentUpdate,
  TriggerUpdate,
} from '../../../modules/actions';
import { ButtonTextAndBorderBlue, LabelTitle } from '../../atoms';
import { AlertMessagePanel } from '../../molecules/modal';
import { Api, ApiFile } from '../../../helpers/api';
import { FileUpload } from '../../../assets/images';

const FormNotePatient = ({
  ParamCreateAppointment,
  CreateParamsAppointment,
  DocumentUpdate,
  DocumentReducer,
  TriggerUpdate,
  isEnableUpdateAppointment = false,
  isDisableInput = false,
  isFromMissedCall = false,
  ableButtonProsess = false,
  counterCloseFromOrderedFormPatient,
}) => {
  const padding = window.location.pathname.includes('call') ? 'pb-20' : 'pb-5';
  const [symptom_note, setsymptom_note] = useState('');
  const [messageAlert, setMessageAlert] = useState(null);
  // const [buttonStatus, setButtonStatus] = useState(false);
  // const [documentResume, setDocumentResume] = useState([]);
  const [documentList, setdocumentList] = useState([]);
  // const history = useHistory();
  const [file, setFile] = useState({
    percent: 0,
    total: 0,
    name: '',
  });
  const storedRole = LocalStorage('role');
  const [role, setRole] = useState(storedRole);

  useEffect(() => setRole(storedRole), [storedRole]);

  useEffect(() => {
    if (ParamCreateAppointment.document_resume.length < 1) {
      DocumentUpdate([]);
    }
    let ParamCreateAppointmentData = { ...ParamCreateAppointment };
    setsymptom_note(ParamCreateAppointmentData.symptom_note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ParamCreateAppointment]);

  useEffect(() => {
    setdocumentList(DocumentReducer);
  }, [DocumentReducer]);

  const removeParamFile = value => {
    let documentListData = [...documentList];
    let ParamCreateAppointmentData = { ...ParamCreateAppointment };
    let ParamCreateAppointmentDataDocumentResume = [];
    documentListData.forEach(res => {
      if (res.file_id !== value.fileId) {
        ParamCreateAppointmentDataDocumentResume.push(res.file_id);
      }
    });
    ParamCreateAppointmentData.document_resume =
      ParamCreateAppointmentDataDocumentResume;
    if (!isEnableUpdateAppointment && !ableButtonProsess) {
      DocumentUpdate(
        documentListData.filter(item => item.file_id !== value.fileId)
      );
      CreateParamsAppointment(ParamCreateAppointmentData);
    }

    if (isEnableUpdateAppointment || ableButtonProsess) {
      Api.post(
        '/appointment/v1/document/remove',
        {
          appointment_id: ParamCreateAppointment.appointment_id,
          document_id: value.id,
        },
        {
          headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        }
      )
        .then(res => {
          DocumentUpdate(
            documentListData.filter(item => item.file_id !== value.fileId)
          );
          CreateParamsAppointment(ParamCreateAppointmentData);
        })
        .catch(function (error) {
          console.log(error.response);
          setMessageAlert({
            text: error.response.data.message,
            type: 'failed',
            direction: 'bottom',
          });
        });
    }
  };

  const handleChangeInput = event => {
    let text = event.target.value;
    if (role === 'MA' && text.length <= 500) {
      setsymptom_note(event.target.value);
      let ParamCreateAppointmentData = { ...ParamCreateAppointment };
      ParamCreateAppointmentData.symptom_note = event.target.value;
      CreateParamsAppointment(ParamCreateAppointmentData);
    }
  };

  const handleCounterButtonTextAndBorderBlue = () => {
    let ParamCreateAppointmentData = { ...ParamCreateAppointment };
    ParamCreateAppointmentData.symptom_note = symptom_note;
    CreateParamsAppointment(ParamCreateAppointmentData);
    if (isEnableUpdateAppointment) {
      TriggerUpdate({ updateAppointmentTrigger: true });
      counterCloseFromOrderedFormPatient();
    }
  };

  const handleViewFile = value => {
    window.open(value, '_blank');
  };

  const handleChangeFile = event => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const fileType = file.type;
      const fileSize = file.size;
      const validImageTypes = [
        'image/gif',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
      ];

      if (fileSize >= 10240000) {
        setMessageAlert({
          text: 'File hanya bisa di upload maximum 10 mb',
          type: 'failed',
          direction: 'bottom',
        });
        event.target.value = '';
        return;
      }

      if (validImageTypes.indexOf(fileType) === -1) {
        setMessageAlert({
          text: 'File hanya bisa gambar, pdf',
          type: 'failed',
          direction: 'bottom',
        });
        event.target.value = '';
        return;
      }

      const formData = new FormData();
      formData.append('file', file, file.name);

      setFile({
        ...file,
        name: file.name,
      });

      const options = {
        onUploadProgress: progressEvent => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          // console.log(`loaded : ${loaded}, total: ${total}, percent: ${percent}`)
          setFile({
            ...file,
            total: total,
            percent: percent,
          });
        },
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      };
      ApiFile.post('/file/v1/file/upload', formData, options)
        .then(({ data: dataUploadFile }) => {
          setFile({
            ...file,
            total: 0,
            percent: 0,
          });
          const { data: dataFile } = dataUploadFile;

          if (!isEnableUpdateAppointment) {
            DocumentUpdate([
              ...DocumentReducer,
              {
                file_id: dataFile.id,
                original_name: dataFile.name,
                url: dataFile.url,
                size: `${dataFile.size_formatted}`,
              },
            ]);
            let ParamCreateAppointmentData = { ...ParamCreateAppointment };
            let ParamCreateAppointmentDataDocumentResume = [
              ...ParamCreateAppointment.document_resume,
            ];
            ParamCreateAppointmentDataDocumentResume.push(dataFile.id);
            ParamCreateAppointmentData.document_resume =
              ParamCreateAppointmentDataDocumentResume;
            CreateParamsAppointment(ParamCreateAppointmentData);
          }

          if (isEnableUpdateAppointment) {
            Api.post(
              '/appointment/v1/document/add',
              {
                appointment_id: ParamCreateAppointment.appointment_id,
                file: dataFile.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${LocalStorage('access_token')}`,
                },
              }
            ).then(({ data: dataAddocument }) => {
              const { data: dataAddFile } = dataAddocument;
              DocumentUpdate([...DocumentReducer, dataAddFile]);
              let ParamCreateAppointmentData = { ...ParamCreateAppointment };
              let ParamCreateAppointmentDataDocumentResume = [
                ...ParamCreateAppointment.document_resume,
              ];
              ParamCreateAppointmentDataDocumentResume.push(dataFile.id);
              ParamCreateAppointmentData.document_resume =
                ParamCreateAppointmentDataDocumentResume;
              CreateParamsAppointment(ParamCreateAppointmentData);
            });
          }
        })
        .catch(function (error) {
          console.log(error.response);
          setMessageAlert({
            text: error.response.data.message,
            type: 'failed',
            direction: 'bottom',
          });
        });
    }
  };

  return (
    <div
      className="w-full flex flex-wrap content-start bg-white relative"
      style={{ borderColor: '#F2F2F5' }}
    >
      {messageAlert !== null ? (
        <AlertMessagePanel
          text={messageAlert.text}
          type={messageAlert.type}
          direction={messageAlert.direction}
          counter={value => setMessageAlert(value)}
        />
      ) : (
        ''
      )}
      <div
        className={`w-full ${
          isFromMissedCall ? 'px-2' : 'xl:px-5 px-2'
        } py-3 flex flex-wrap items-start`}
      >
        <p className="w-full font-bold text-sm mb-1">Note</p>
        <textarea
          className={`w-full py-3 px-5 border border-solid rounded h-32 text-sm ${
            isDisableInput || role !== 'MA' ? 'bg-gray-300 text-black' : ''
          }`}
          value={symptom_note}
          placeholder="Type note here"
          onChange={handleChangeInput}
          disabled={isDisableInput || role !== 'MA'}
          style={{ resize: 'none', borderColor: '#DDE5E9' }}
        />
        {role === 'MA' && (
          <div className="w-full text-mainColor text-xs py-1 px-1">
            Karakter yang tersedia {500 - parseInt(symptom_note.length)}
          </div>
        )}
        <div className="w-full flex items-center flex-wrap justify-between">
          {isEnableUpdateAppointment ? (
            <ButtonTextAndBorderBlue
              text="Ubah"
              dimesion="py-2 px-8 mt-3"
              position="right"
              value=""
              counter={value => handleCounterButtonTextAndBorderBlue(value)}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="w-full mt-2">
        <LabelTitle
          text="Dokumen Lampiran"
          fontStyle="font-bold"
          dimension={`py-2 ${isFromMissedCall ? 'px-2' : 'xl:px-5 px-2'}`}
        />
        {documentList.length > 0
          ? documentList.map((res, idx) => {
              return (
                <div
                  key={idx}
                  className={`flex flex-wrap ${
                    isFromMissedCall ? 'px-2' : 'xl:px-5 px-2'
                  } py-4 border-b border-gray-100`}
                >
                  <div className="w-5/12">
                    <p className="font-bold text-sm truncate">
                      {res.original_name}
                    </p>
                  </div>
                  <div className="w-3/12">
                    <p className="text-sm text-center text-dark3">{res.size}</p>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <button
                      className="text-sm text-mainColor"
                      onClick={() => handleViewFile(res.url)}
                    >
                      Lihat
                    </button>
                  </div>
                  <div className="w-2/12 flex justify-end">
                    <button
                      className="text-right text-error1"
                      onClick={() =>
                        removeParamFile({ fileId: res.file_id, id: res.id })
                      }
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })
          : ''}
        {file.percent > 0 ? (
          <div
            className={`flex flex-wrap ${
              isFromMissedCall ? 'px-2' : 'xl:px-5 px-2'
            } py-4 border-b border-gray-100`}
          >
            <div className="w-4/12">
              <p className="font-bold text-sm truncate">{file.name}</p>
            </div>
            <div className="w-2/12 flex justify-center">
              <button className="text-sm text-mainColor">{file.total}</button>
            </div>
            <div className="w-6/12 flex flex-wrap items-center">
              <p className="w-4/12 text-sm text-center text-dark3">
                {file.percent}%
              </p>
              <div className="w-8/12 bg-subtle h-1">
                <div
                  className="bg-darker transition-all h-1"
                  style={{ width: `${file.percent}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        <div
          className={`flex flex-wrap ${
            isFromMissedCall ? 'px-2' : 'xl:px-5 px-2'
          } pt-4 ${padding}`}
        >
          <div className="w-2/3">
            <p className="text-xs">
              <span className="font-bold">Upload file (opsional)</span>Max 10MB
            </p>
            <p className="text-xs">pemeriksaan penunjang</p>
          </div>
          <div
            className={`w-1/3 flex items-center justify-end ${
              isFromMissedCall ? 'pr-0' : 'pr-2'
            }`}
          >
            <div className="overflow-hidden relative w-26">
              <button className="w-full inline-flex items-center">
                <img
                  src={FileUpload}
                  alt="File Upload Icon"
                  className={`inline ${isFromMissedCall ? 'mr-1' : 'mr-2'}`}
                />
                <span className="text-mainColor text-sm">Unggah File</span>
              </button>
              <input
                className="cursor-pointer absolute block px-4 w-full opacity-0 top-0 left-0"
                type="file"
                onChange={handleChangeFile}
                disabled={isDisableInput}
              />
            </div>
            {/* <button className="flex flex-wrap items-center justify-center text-sm" style={{ color: "#61C7B5" }}>
              <input type="file" onChange={handleChangeFile} />
             <img src={FileUpload} alt="File Upload Icon" className="inline mr-2" /> FileUpload
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  ParamCreateAppointment: state.ParamCreateAppointment.data,
  DocumentReducer: state.DocumentReducer.data,
});

const mapDispatchToProps = {
  CreateParamsAppointment,
  DocumentUpdate,
  TriggerUpdate,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormNotePatient);
