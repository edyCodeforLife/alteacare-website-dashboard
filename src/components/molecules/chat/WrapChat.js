import { connect } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import LoadingComponent from '../loader/LoadingComponent';
import { LocalStorage } from '../../../helpers/localStorage';
import { TriggerUpdate, RoomData } from '../../../modules/actions';
import {
  FileIcon,
  FileUpload,
  AlertCloseWhite,
  PhotoCameraIcon,
} from '../../../assets/images';

const WrapChat = (props) => {
  const {
    error,
    notif,
    RoomData,
    closeChat,
    visibility,
    RoomReducer,
    HeightElement,
  } = props

  const inputMessage = useRef(null);
  const identityLocal = useRef(null);
  const identityRemote = useRef(null);
  const [messages, setMessage] = useState([]);
  const [heightChat, setHeightChat] = useState(0)
  const [localUpload, setLocalUpload] = useState(false);
  const [remoteUpload, setRemoteUpload] = useState(false);

  useEffect(() => {
    const heightHeader = document.getElementById('header-top-chat').clientHeight
    const heightFooter = document.getElementById('footer-chat').clientHeight
    setHeightChat(HeightElement - parseInt(heightFooter) - parseInt(heightHeader))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibility]);

  const submitSendMessage = async (event) => {
    event.preventDefault()
    const channel = RoomReducer?.channel;

    if (channel && await channel.channelState.status === "joined") {
      const value = inputMessage.current.value;
      await channel.sendMessage(value);
      inputMessage.current.value = '';
    } else {
      error('Please wait, currently we try to connect your chat with patient');
    }
  }

  const handleChangeFile = async (event) => {
    const room = RoomReducer?.room;
    const channel = RoomReducer?.channel;

    if (!room || !channel) {
      error('Please wait, currently we try to connect your chat with patient');
      return false;
    }

    if (event.target.files[0] !== undefined  && event.target.files[0] !== '') {
      const file = event.target.files[0]
      const fileType = file.type;
      const fileSize = file.size;
      const validImageTypes = [
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];

      if (fileSize >= 10240000) {
        error('File hanya bisa di upload maximum 10 mb')
        event.target.value = ''
        return false;
      }

      if (validImageTypes.indexOf(fileType) === -1) {
        error('File hanya bisa gambar atau pdf')
        // event.target.value = ''
        return false;
      }

      event.preventDefault();
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      await channel.sendMessage(formData);
    }
  }

  const handleMessage = async (message) => {
    try {
      const room = RoomReducer?.room?.data;
      const { identity } = room;

      if (message.type === 'media') {

        if (message.author === identity) {
          identityLocal.current.innerHTML = message.author;
          setLocalUpload(true);
        } else {
          identityRemote.current.innerHTML = message.author;
          setRemoteUpload(true);
        }

        const condition = (
          message.media.contentType === 'application/pdf'
          || message.media.contentType === 'application/*'
        );

        message.contentType = condition ? 'pdf' : 'image';
        const url = await message.media.getContentTemporaryUrl();

        message.url = url
        setMessage(messages => messages.concat(message));

        if (message.author === identity) setLocalUpload(false);
        else setRemoteUpload(false);
      }else {
        setMessage((msg) => msg.concat(message));
      }
    } catch (err) {
      error(`Error while getting the chat, ${err?.message}`)
    }
  }

  const joinChannel = async (channel) => {
    try {
      if (await channel.channelState.status !== 'joined') await channel.join();

      if (await channel.channelState.status === 'joined') {

        await channel.on("messageAdded", (messages) => {
          handleMessage(messages)
          notif(true)
        });

        await channel.on('memberJoined', (member) => {
          error('Pasien Sudah Bisa Melakukan Chat');
        })
      }
    } catch (err) {
      error(`Error while try to join channel chat ${err?.message}`);
    }
  };

  const getChannel = async (client) => {
    let channel
    const room = RoomReducer?.room;
    const roomChannel = RoomReducer?.channel;
    const { identity, room_code } = room.data;

    try {
      channel = await client.getChannelByUniqueName(room_code)
    } catch (err) {
      channel = await client.createChannel({ uniqueName: room_code, friendlyName: identity });
      error(`Error When Join Channel Chat ${err?.message}`);
    }

    if (!roomChannel) {
      RoomData({ ...RoomReducer, channel });
      await joinChannel(channel)
    }
  }

  const connectChat = async () => {
    try {
      const room = RoomReducer?.room;

      if (room) {
        const { token } = room.data;
        const Chat = require('twilio-chat');
        const client = await Chat.Client.create(token)

        await client.on('tokenExpired', () => {
          error('Sesi Video Call Atau Chat Telah Berakhir');
        })

        await getChannel(client)
      }
    } catch (err) {
      error(`Error Connect to Chat ${err?.message}`);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => connectChat(), [RoomReducer]);

  return (
    <div className={`w-full ${LocalStorage('role') === 'DOCTOR' ? 'h-full flex flex-col' : ''}`}>
      <div
        id="header-top-chat"
        className="flex flex-wrap items-start justify-center px-3 py-2 text-white rounded-t-lg relative"
        style={{ backgroundColor: "#87CDE9" }}
      >
        <p className="text-lg font-bold">Chat</p>
        <img
          src={AlertCloseWhite}
          alt="Alert Close White Icon"
          className="absolute z-10 inset-y-0 right-0 mr-5 my-auto cursor-pointer"
          onClick={() => {
            closeChat()
            notif(false);
          }}
        />
      </div>
      <div
        className={`wrap-detail-chat ${LocalStorage('role') === 'DOCTOR' ? 'flex-1' : ''} flex flex-wrap content-start p-5 overflow-y-scroll scroll-small lg:shadow-none shadow-sm lg:pb-0 pb-10`}
        style={
          LocalStorage('role') !== 'DOCTOR' 
            ? { height: `${heightChat}px`}
            : {}
        }
      >
        {
          messages.map((message, index) => {
            if (RoomReducer?.room) {
              const { identity } = RoomReducer.room.data;
              return message.author === identity
                ? (
                  <div className="w-full flex flex-wrap justify-end inline-block" key={index}>
                    {
                      message.contentType === 'image' ?
                        <>
                          <p className="w-full text-right font-bold">{ message.author }</p>
                          <span className="text-sm w-1/2 text-right px-3 py-1 rounded-xl my-1 inline-block" style={{ color: "#3E8CB9", backgroundColor: "#D6EDF6" }}>
                            <img src={ message.url } alt="unique" />
                          </span>
                        </>
                      : ''
                    }
                    {
                      message.contentType === 'pdf' ?
                        <>
                          <p className="w-full text-right font-bold">{ message.author }</p>
                          <a href={message.url} target="_blank" rel="noreferrer">
                            <span className="text-sm text-right px-3 py-1 rounded-xl my-1 inline-block" style={{ color: "#3E8CB9", backgroundColor: "#D6EDF6" }}>
                              <p><img src={ FileIcon } alt="file" />{ message.media.filename }</p>
                            </span>
                          </a>
                        </>
                      : ''
                    }
                    {
                      message.contentType !== 'pdf' && message.contentType !== 'image' ?
                        <>
                          <p className="w-full text-right font-bold">{ message.author }</p>
                          <p className="text-sm text-right px-3 py-1 rounded-xl my-1 inline-block" style={{ color: "#3E8CB9", backgroundColor: "#D6EDF6" }}>
                            { message.body }
                          </p>
                        </> : ''
                    }
                  </div>
                ) : (
                  <div className="w-full flex flex-wrap justify-start inline-block mb-5" key={index}>
                    {
                      message.contentType === 'image' ?
                        <>
                          <p className="w-full text-left font-bold">{ message.author }</p>
                          <span className="text-sm w-1/2 text-left px-3 py-1 rounded-xl my-1 inline-block" style={{ color: "#3E8CB9", backgroundColor: "#D6EDF6" }}>
                            <img src={ message.url } alt="unique" />
                          </span>
                        </>
                      : ''
                    }
                    {
                      message.contentType === 'pdf' ?
                        <>
                          <p className="w-full text-left font-bold">{ message.author }</p>
                          <a href={message.url} target="_blank" rel="noreferrer">
                            <span className="text-sm text-left px-3 py-1 rounded-xl my-1 inline-block" style={{ color: "#3E8CB9", backgroundColor: "#D6EDF6" }}>
                              <p><img src={ FileIcon } alt="file" />{ message.media.filename }</p>
                            </span>
                          </a>
                        </>
                      : ''
                    }
                    {
                      message.contentType !== 'pdf' && message.contentType !== 'image' ?
                      <>
                        <p className="w-full text-left font-bold">{ message.author }</p>
                        <p className="text-sm text-left px-3 py-1 rounded-xl my-1 inline-block" style={{ color: "#3E8CB9", backgroundColor: "#D6EDF6" }}>
                          { message.body }
                        </p>
                      </> : ''
                    }
                  </div>
                )
            }

            return '';
          })
        }
        <div className={`w-full flex flex-wrap justify-end inline-block ${localUpload ? 'block' : 'hidden'}`}>
          <p className="w-full text-right font-bold" ref={identityLocal}></p>
          <span className="text-sm w-1/2 border-2 border-blue-100 text-right px-3 py-1 rounded-xl my-1 inline-block">
            <LoadingComponent />
          </span>
        </div>
        <div className={`w-full flex flex-wrap justify-start inline-block mb-5 ${remoteUpload ? 'block' : 'hidden'}`}>
          <p className="w-full text-left font-bold" ref={identityRemote}></p>
          <span className="text-sm w-1/2 border-2 border-blue-100 text-left px-3 py-1 rounded-xl my-1 inline-block">
            <LoadingComponent />
          </span>
        </div>
      </div>
      <div id="footer-chat" className={`${LocalStorage('role') === 'DOCTOR' ? 'h-36' : ''} px-3 pt-3 pb-6 rounded-t-lg relative bg-white`}>
        <form onSubmit={submitSendMessage} className="flex flex-wrap items-center">
          <input
            type="text"
            required={true}
            className="w-4/6 py-1 px-3 rounded-full"
            placeholder="Ketik pesan disini..."
            style={{ backgroundColor: "#F2F2F2" }}
            ref={inputMessage}
          />
          <div className="w-2/6 flex flex-wrap items-center">
            <div className="w-6/12 px-2 flex content-center">
              <button
                type="submit"
                className="bg-mainColor text-xs rounded-full w-full text-white active:bg-gray-500"
                style={{ padding: "5px 10px" }}>send</button>
            </div>
            <div className="w-3/12 px-2 flex content-center">
              <div className="overflow-hidden h-5 relative w-full">
                <button type="button" className="w-full inline-flex items-center justify-center">
                  <img src={FileUpload} alt="File Upload Icon" className="inline" />
                </button>
                <input
                  className="cursor-pointer absolute block w-full opacity-0 top-0 left-0"
                  type="file"
                  onChange={(event) => handleChangeFile(event)}
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
  )
}

WrapChat.defaultProps = {
  HeightElement: 'auto',
  counterCloseChat: ''
};

const mapStateToProps = (state) => ({
  RoomReducer: state.RoomReducer.data,
});

const mapDispatchToProps = {
  TriggerUpdate,
  RoomData,
};

export default connect(mapStateToProps, mapDispatchToProps)(WrapChat);
