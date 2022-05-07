/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'react-redux';

import services from './services';
import LoadingComponent from '../../../molecules/loader/LoadingComponent';
import { ModalWindow } from '../../../molecules/modal';
import {
  FileIcon,
  FileUpload,
  AlertCloseWhite,
  PhotoCameraIcon,
} from '../../../../assets/images';
import { LocalStorage } from '../../../../helpers/localStorage';
import {
  setChatNotification,
  setChatOpen,
  setVideoFullscreen,
} from '../../../../modules/actions';

const Screen = () => {
  const dispatch = useDispatch();
  const role = LocalStorage('role');
  const isDoctor = role === 'DOCTOR';

  const {
    modal,
    setModal,
    messages,
    inputMessage,
    RoomReducer,
    localUpload,
    remoteUpload,
    identityLocal,
    identityRemote,
    submitHandler,
    handleChangeFile,
    identity,
  } = services();

  const handleCloseChat = function () {
    dispatch(setChatOpen(false));
    dispatch(setChatNotification(false));

    if (isDoctor) {
      dispatch(setVideoFullscreen(true));
    }
  };

  return (
    <>
      {modal !== '' && (
        <ModalWindow text={modal} counterClose={() => setModal('')} />
      )}
      <div className="w-full h-full flex flex-col">
        <div
          id="header-top-chat"
          className="flex items-start justify-center px-3 py-2 text-white rounded-t-lg relative"
          style={{ backgroundColor: '#87CDE9' }}
        >
          <p className="text-lg font-bold">Chat</p>
          <img
            src={AlertCloseWhite}
            alt="Alert Close White Icon"
            className="absolute z-10 inset-y-0 right-0 mr-5 my-auto cursor-pointer"
            onClick={handleCloseChat}
          />
        </div>
        <div className="flex flex-col content-start p-5 overflow-y-scroll scroll-small lg:shadow-none shadow-sm lg:pb-0 pb-10 flex-1 gap-6 bg-white">
          {messages.map((message, index) => {
            if (RoomReducer?.data?.channel) {
              return message.author === identity ? (
                <div
                  className="w-full flex flex-col gap-1 items-end justify-end"
                  key={index}
                >
                  {message.contentType === 'image' && (
                    <>
                      <p className="w-full text-right font-bold">
                        {message.author}
                      </p>
                      <span className="text-sm w-1/2 text-right px-3 py-1 rounded-xl inline-block text-darker bg-subtle">
                        <img src={message.url} alt="unique" />
                      </span>
                    </>
                  )}
                  {message.contentType === 'pdf' && (
                    <>
                      <p className="w-full text-right font-bold">
                        {message.author}
                      </p>
                      <a href={message.url} target="_blank" rel="noreferrer">
                        <span className="text-sm text-right px-3 py-1 rounded-xl inline-block text-darker bg-subtle">
                          <p>
                            <img src={FileIcon} alt="file" />
                            {message.media.filename}
                          </p>
                        </span>
                      </a>
                    </>
                  )}
                  {message.contentType !== 'pdf' &&
                    message.contentType !== 'image' && (
                      <>
                        <p className="w-full text-right font-bold">
                          {message.author}
                        </p>
                        <p className="text-sm text-right px-3 py-1 rounded-xl inline-block text-darker bg-subtle break-all">
                          {message.body}
                        </p>
                      </>
                    )}
                </div>
              ) : (
                <div
                  className="w-full flex flex-col gap-1 items-start justify-start"
                  key={index}
                >
                  {message.contentType === 'image' && (
                    <>
                      <p className="w-full text-left font-bold">
                        {message.author}
                      </p>
                      <span className="text-sm w-1/2 text-left px-3 py-1 rounded-xl inline-block text-darker bg-subtle">
                        <img src={message.url} alt="unique" />
                      </span>
                    </>
                  )}
                  {message.contentType === 'pdf' && (
                    <>
                      <p className="w-full text-left font-bold">
                        {message.author}
                      </p>
                      <a href={message.url} target="_blank" rel="noreferrer">
                        <span className="text-sm text-left px-3 py-1 rounded-xl inline-block text-darker bg-subtle">
                          <p>
                            <img src={FileIcon} alt="file" />
                            {message.media.filename}
                          </p>
                        </span>
                      </a>
                    </>
                  )}
                  {message.contentType !== 'pdf' &&
                    message.contentType !== 'image' && (
                      <>
                        <p className="w-full text-left font-bold">
                          {message.author}
                        </p>
                        <p className="text-sm text-left px-3 py-1 rounded-xl inline-block text-darker bg-subtle break-all">
                          {message.body}
                        </p>
                      </>
                    )}
                </div>
              );
            }

            return null;
          })}
          <div
            className={`w-full flex flex-wrap justify-end ${
              localUpload ? '' : 'hidden'
            }`}
          >
            <p className="w-full text-right font-bold" ref={identityLocal}></p>
            <span className="text-sm w-1/2 border-2 border-blue-100 text-right px-3 py-1 rounded-xl inline-block">
              <LoadingComponent />
            </span>
          </div>
          <div
            className={`w-full flex flex-wrap justify-start mb-5 ${
              remoteUpload ? '' : 'hidden'
            }`}
          >
            <p className="w-full text-left font-bold" ref={identityRemote}></p>
            <span className="text-sm w-1/2 border-2 border-blue-100 text-left px-3 py-1 rounded-xl inline-block">
              <LoadingComponent />
            </span>
          </div>
        </div>
        <div
          id="footer-chat"
          className="px-3 pt-3 pb-6 lg:rounded-t-lg relative bg-white"
        >
          <form
            onSubmit={submitHandler}
            className="flex flex-wrap items-center"
          >
            <input
              type="text"
              required={true}
              className="w-4/6 py-1 px-3 rounded-full"
              placeholder="Ketik pesan disini..."
              style={{ backgroundColor: '#F2F2F2' }}
              ref={inputMessage}
            />
            <div className="w-2/6 flex flex-wrap items-center">
              <div className="w-6/12 px-2 flex content-center">
                <button
                  type="submit"
                  className="bg-mainColor text-xs rounded-full w-full text-white active:bg-gray-500"
                  style={{ padding: '5px 10px' }}
                >
                  send
                </button>
              </div>
              <div className="w-3/12 px-2 flex content-center">
                <div className="overflow-hidden h-5 relative w-full">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center"
                  >
                    <img
                      src={FileUpload}
                      alt="File Upload Icon"
                      className="inline"
                    />
                  </button>
                  <input
                    className="cursor-pointer absolute block w-full opacity-0 top-0 left-0"
                    type="file"
                    onChange={event => handleChangeFile(event)}
                  />
                </div>
              </div>
              <div className="w-3/12 flex justify-center">
                <img src={PhotoCameraIcon} alt="Camera Icon" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Screen;
