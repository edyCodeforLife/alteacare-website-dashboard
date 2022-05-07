import { connect } from 'react-redux';
import { TriggerUpdate, RoomData } from '../../../modules/actions';
import { React, useEffect, useState, useRef } from '../../../libraries';
import { AlertCloseWhite, FileUpload, PhotoCameraIcon } from '../../../assets/images';
import { FileIcon } from '../../../assets/images';
import LoadingComponent from '../loader/LoadingComponent';
import { ModalWindow, AlertMessagePanel } from '../modal'

const WrapChat = ({ HeightElement, RoomReducer, TriggerUpdate, RoomData, counterCloseChat, notif, Load, visibility }) => {
  const inputMessage = useRef(null);
  const identityLocal = useRef(null);
  const identityRemote = useRef(null);
  const [Messages, setMessage] = useState([]);
  const [localUpload, setLocalUpload] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const [remoteUpload, setRemoteUpload] = useState(false);
  const [HeightElementWrap, setHeightElementWrap] = useState(0)
  const [modalWindowData, setModalWindowData] = useState({ visibility: false, text: "" });

  useEffect(() => {
    if (visibility) {
      const heightHeader = document.getElementById('header-top-chat').clientHeight
      const heightFooter = document.getElementById('footer-chat').clientHeight
      setHeightElementWrap(HeightElement - parseInt(heightFooter) - parseInt(heightHeader))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibility]);

  useEffect(() => {
    if (Load && RoomReducer) connectChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Load]);

  useEffect(() => {
    if (RoomReducer) {
      const total = Messages.filter((item) => item.author !== RoomReducer.data.identity)
      if (total.length !== 0) notif(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Messages])

  const submitSendMessage = async (event) => {
    event.preventDefault()
    if (RoomReducer.data) {
      const { channel } = await RoomReducer.data;
      if (channel) {
        const value = inputMessage.current.value;
        await channel.sendMessage(value);
        inputMessage.current.value = "";
      } else{
        setModalWindowData({ visibility: true, text: "Tunggu sebentar, kami sedang menyambungkan anda" });
      }

    }
  }

  const handleMessage = async (newMessage) => {

    if (newMessage.type === 'media') {
      const {  identity } = await RoomReducer.data;
      if (newMessage.author === identity) {
        identityLocal.current.innerHTML = newMessage.author;
        setLocalUpload(true);
      } else {
        identityRemote.current.innerHTML = newMessage.author;
        setRemoteUpload(true);
      }

      const condition = (
        newMessage.media.contentType === 'application/pdf'
        || newMessage.media.contentType === 'application/*'
      );

      newMessage.contentType = condition ? 'pdf' : 'image';
      newMessage.media.getContentTemporaryUrl().then(url => {
        newMessage.url = url
        setMessage(Messages => Messages.concat(newMessage));

        if (newMessage.author === identity) setLocalUpload(false);
        else setRemoteUpload(false);
      })
    }else {
      setMessage(Messages => Messages.concat(newMessage));
    }
  }

  const connectChat = async () => {
    const { token, identity, roomCode } = await RoomReducer.data;
    const Chat = require("twilio-chat")
    const client = await Chat.Client.create(token)
    const payload = {
      identity: identity,
      room_code: roomCode
    }

    await client.on("tokenAboutToExpire", async () => {
      await refreshToken(payload)
      client.updateToken(token)
    });

    await client.on("tokenExpired", async () => {
      await refreshToken(payload)
      client.updateToken(token)
    });

    await getChannel(client)
  }

  const getChannel = async (client) => {
    const { identity, roomCode } = await RoomReducer.data;
    if (roomCode) {
      try {
        const channel = await client.getChannelByUniqueName(roomCode)
        RoomData({...RoomReducer.data, channel});
        await joinChannel(channel)

      } catch (error) {
        const channel = await client.createChannel({
          uniqueName: roomCode,
          friendlyName: identity,
        });

        RoomData({...RoomReducer.data, channel});
        await joinChannel(channel)
      }
    }
  }

  const joinChannel = async (channel) => {
    if (await channel.channelState.status !== "joined") {
      await channel.join();
    }

    await channel.on("messageAdded", (messages) => {
      handleMessage(messages)
    });
  };

  const refreshToken = (params) => {
    TriggerUpdate({...params, id: 'wrapChat'});
  };

  const handleChangeFile = async (event) => {
    if (!RoomReducer) {
      setModalWindowData({ visibility: true, text: "Tunggu sebentar, kami sedang menyambungkan anda" });
      return;
    }

    if (RoomReducer.data.channel && event.target.files[0] !== undefined  && event.target.files[0] !== "") {
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
        setMessageAlert({
          text: "File hanya bisa di upload maximum 10 mb",
          type: "failed",
          direction: "bottom"
        })
        event.target.value = ''
        return;
      }

      if (validImageTypes.indexOf(fileType) === -1) {
        setMessageAlert({
          text: "File hanya bisa gambar, pdf",
          type: "failed",
          direction: "bottom"
        })
        // event.target.value = ''
        return;
      }

      event.preventDefault();
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      await RoomReducer.data.channel.sendMessage(formData);
    }
  }

  const handleCloseChat = () => {
    counterCloseChat()
  }

  const closeModalWindow = () => {
    setModalWindowData({ visibility: false, text: "" });
  }

  return (
    <div className="w-full">
      {
        modalWindowData.visibility
          ? <ModalWindow text={modalWindowData.text} counterClose={() => closeModalWindow()} />
          : ""
      }
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
          onClick={handleCloseChat}
        />
      </div>
      <div
        className="wrap-detail-chat flex flex-wrap content-start p-5 overflow-y-scroll scroll-small lg:shadow-none shadow-sm lg:pb-0 pb-10"
        style={{
          height: !!HeightElementWrap ? `${HeightElementWrap}px` : ""
        }}
      >
        {
          Messages.map((message, index) => {
            if (RoomReducer) {
              const { identity } = RoomReducer.data;
              return message.author === identity ?
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
                :
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
            } else {
              return <></>
            }
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
      <div
        id="footer-chat"
        className="px-3 pt-3 pb-6 rounded-t-lg relative bg-white"
      >
        <div className="absolute relative z-20">
          {
            messageAlert
              ? (
                <AlertMessagePanel
                  text={messageAlert.text}
                  type={messageAlert.type}
                  direction={messageAlert.direction}
                  counter={(value) => setMessageAlert(value)} />
              ) : ''
          }
        </div>
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
                  onChange={handleChangeFile}
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
  HeightElement: "auto",
  counterCloseChat: ""
};

const mapStateToProps = (state) => ({
  RoomReducer: state.RoomReducer,
});

const mapDispatchToProps = {
  TriggerUpdate,
  RoomData,
};

export default connect(mapStateToProps, mapDispatchToProps)(WrapChat);
