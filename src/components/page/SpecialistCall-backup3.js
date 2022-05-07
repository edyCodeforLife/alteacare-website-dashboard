
import Video from 'twilio-video';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { WrapChat } from '../molecules/chat';
import { Template } from '../molecules/layout';
import { ModalWindow } from '../molecules/modal';
import Notification from '../molecules/video/Notification';
import { socketSpecialistCall } from '../../helpers/socket';
import TwilioSignal from '../../hooks/twilio-signal/TwilioSignal';
import LoaderPatientCall from '../molecules/video/LoaderPatientCall';
import { useState, useEffect, useParams, Prompt } from '../../libraries';

import { ThreeDots, ChatIcon } from '../../assets/images';

import {
  RoomData,
} from '../../modules/actions'

import {
  Signal,
  Camera,
  EndCall,
  RoomInfo,
  Microphone,
  TimeCounter,
  ShareScreen,
  LocalMicrophoneInfo,
  RemoteMicrophoneInfo,
  LocalParticipantTrack,
  RemoteParticipantTrack,
} from '../molecules/video';

const SpecialistCall = (props) => {
  const { token } = useParams();

  const { TwilioSignalReducer } = TwilioSignal();

  const [chat, setChat] = useState(false);

  // const [modal, setModal] = useState('');
  const [notif, setNotif] = useState(false);

  const [userId, setUserId] = useState(null);
  // const [userId] = useState(null);

  const [avatar, setAvatar] = useState('');
  // const [loaded, setLoaded] = useState(false);
  const [isEnded, setEnded] = useState(false);
  // const [firstInit, setFirstInit] = useState(true);
  const [highElement, setHighElement] = useState('');
  // const [footerHeight, setfooterHeight] = useState('');

  const [appointmentId, setAppointmentId] = useState(null);
  // const [appointmentId] = useState(null);

  // const [backgroundLocal, setBackgroundLocal] = useState(null);
  // const [sectionWrapChat, setSectionWrapChat] = useState(false);

  const [modalWindowData, setModalWindowData] = useState({
    text: "",
    visibility: false,
    isButtonRefreshPage: false,
  });

  const [remoteParticipantJoin, setRemoteParticipantJoin] = useState(false);

  const [localState, setLocalState] = useState({
    localParticipantSignal: '', // LOW, MEDIUM, HIGH
    localParticipantConnected: '', // CONNECTED, RECONECTING, RECONECTED, DISCONNECTED
    localParticipantVideo: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
    localParticipantAudio: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
    localParticipantShareScreen: false,
  });

  const [remoteState, setRemoteState] = useState({
    remoteParticipantSignal: '', // LOW, MEDIUM, HIGH
    remoteParticipantConnected: '', // CONNECTED, RECONECTING, RECONECTED, DISCONNECTED
    remoteParticipantVideo: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
    remoteParticipantAudio: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
    remoteParticipantShareScreen: false,
  });

  const [resetLocalState] = useState(localState);
  const [resetRemoteState] = useState(remoteState);

  // const [state, setState] = useState({
  //   localShareScreen: null,
  //   muteVideoLocal: null,
  //   muteAudioLocal: null,
  //   muteVideoRemote: null,
  //   muteAudioRemote: null,
  // });

  // const [resetState] = useState(state);

  const {
    RoomData,
    RoomReducer,
    ParentHeight,
  } = props;

  navigator.mediaDevices.ondevicechange = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const room = RoomReducer?.room;

    if (audioDevices[0] && room) {
      const track = await Video.createLocalAudioTrack({ deviceId: { exact: audioDevices[0].deviceId } });

      room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      room.localParticipant.publishTrack(track);

      setModalWindowData({
        text: 'Your Microphone Has Change',
        visibility: true,
        isButtonRefreshPage: false,
      });
    }

    if (videoDevices[0] && room) {
      const track = await Video.createLocalVideoTrack({ deviceId: { exact: videoDevices[0].deviceId } });

      room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      room.localParticipant.publishTrack(track);

      setModalWindowData({
        text: 'Your Webcam Has Change',
        visibility: true,
        isButtonRefreshPage: false,
      });
    }
  };

  const specialistConnectCall = (appointment) => {
    const socket = socketSpecialistCall(appointment?.appointment_id);
    socket.connect()

    socket.on("connect_error", (err) => {
      // if(window.confirm('Koneksi tidak stabil, silahkan refresh halaman')) window.location.reload();
      setModalWindowData({
        visibility: true,
        isButtonRefreshPage: true,
        text: "Koneksi tidak stabil, silahkan refresh halaman",
      });
    });

    socket.on('CONSULTATION_STARTED', (data) => {
      console.log(data);
    })

    return () => {
      socket.disconnect();
    }
  }

  const connectRoom = async (twilio, appointment) => {
    try {
      const {
        token,
        room_code,
        identity,
      } = twilio;

      const room = await Video.connect(token, {
        region: 'sg1',
        name: room_code,
        video: {
          height: 640,
          width: 480,
          frameRate: 24,
          name: `${identity}-video`
        },
        audio: {
          name: `${identity}-audio`,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      room.data = twilio;

      RoomData({ ...RoomReducer, room });
      closeModalWindow();
      setLocalState({
        ...localState,
        localParticipantAudio: 'ENABLE',
        localParticipantConnected: 'CONNECTED',
      });

      specialistConnectCall(appointment);

      // setLoaded(true);
    } catch (error) {
      if (!error?.message.includes('Access Token expired')) {
        setModalWindowData({
          text: error?.message,
          visibility: true,
          isButtonRefreshPage: false,
        });
      } else {
        setModalWindowData({
          text: 'Sesi Video Call Telah Berakhir',
          visibility: true,
          isButtonRefreshPage: false,
        });
      }

      setLocalState({
        ...localState,
        localParticipantSignal: 'LOW',
        localParticipantConnected: 'DISCONNECTED',
        localParticipantVideo: 'DISABLE',
        localParticipantAudio: 'DISABLE',
        localParticipantShareScreen: false,
      })
    }
  }

  useEffect(() => {
    const room = RoomReducer?.room;

    if (room) {
      const participants = [...room.participants.values()];
      const participant = participants.shift();
      
      setRemoteState({
        ...remoteState,
        remoteParticipantConnected: participant?.state?.toUpperCase() || ''
      })

      room.once('participantConnected', participant => {
        setRemoteParticipantJoin(true);
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'CONNECTED'
        })
      });

      room.on('participantConnected', participant => {
        setRemoteParticipantJoin(true);
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'CONNECTED',
        })
      });

      room.on('participantReconnected', remoteParticipant => {
        setRemoteParticipantJoin(true);
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'CONNECTED'
        })
      });

      room.on('participantReconnecting', remoteParticipant => {
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'RECONNECTING'
        })
      });

      room.once('participantDisconnected', participant => {
        setModalWindowData({
          text: `Pasien ${participant.identity} telah meninggalkan ruangan`,
          visibility: true,
          isButtonRefreshPage: false,
        });
      });

      room.on('reconnecting', error => {
        if (error.code === 53001) {
          console.log('reconnecting');
          setLocalState({
            ...localState,
            localParticipantConnected: 'RECONNECTING',
          })
        } else if (error.code === 53405) {
          console.log('Reconnecting your media connection!', error.message);
        }
        /* Update the application UI here */
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RoomReducer]);

  const closeModalWindow = () => {
    setModalWindowData({
      text: "",
      visibility: false,
      isButtonRefreshPage: false,
    })
  }

  useEffect(() => {
    const restored = token.split('-');

    // twilio
    const twilioParams = restored?.shift().replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
    const twilioRestored = CryptoJS.AES.decrypt(twilioParams, 'Secret Passphrase');
    const twilio = JSON.parse(twilioRestored.toString(CryptoJS.enc.Utf8));

    const appointment = twilio.appointment_detail;
    delete twilio.appointment_detail;
    delete twilio.user_id;

    connectRoom(twilio, appointment);

    setAppointmentId(appointment.appointment_id)
    setUserId(appointment.user_id)

    // setReduxForAppointment(appointment);

  }, [token]);

  useEffect(() => {
    if (ParentHeight) {
      // const footerVideo = document.getElementById('footer-video').clientHeight
      setHighElement(ParentHeight.heightElement)
      // setfooterHeight(parseInt(ParentHeight.heightElement)-parseInt(footerVideo))
    }
  }, [ParentHeight]);

  // end call finish appointment
  // useEffect(() => {
  //   if (isEnded) 
  // }, [isEnded]);

  useEffect(() => () => {
    setModalWindowData('');
    setAvatar('');
    setChat(false);
    setNotif(false);
    setEnded(false);
    // sethighElement('');
    // setfooterHeight('');
    // setSideBarToggle(false);
    setLocalState(resetLocalState);
    setRemoteState(resetRemoteState);
  }, [resetLocalState, resetRemoteState])

  // useEffect(() => () => {
  //   setEnded(false);
  //   setNotif(false);
  //   setLoaded(false);
  //   setFirstInit(false);
  //   setState(resetState);
  //   setSectionWrapChat(false);
  // }, [resetState])

  useEffect(() => {
    console.log('remoteState', remoteState);
  }, [remoteState]);

  return (
    <Template isHiddenSide={true} HeightElement={highElement}>
      <Prompt message={location => { }} />
      {
        modalWindowData.visibility
          ? (
            <ModalWindow
              text={modalWindowData.text}
              counterClose={() => closeModalWindow()}
              isButtonRefreshPage={modalWindowData.isButtonRefreshPage}
            />
          )
          : ''
      }
      <div className={`${chat ? 'lg:w-8/12' : 'lg:w-12/12'} w-full lg:flex-none lg:flex-nowrap flex flex-col`}>
        <div className="flex flex-wrap bg-black relative flex-1 relative">
          <div className="w-full h-full absolute inset-0 flex flex-row relative">
            <RemoteMicrophoneInfo
              handler={(value) => setRemoteState({ ...remoteState, remoteParticipantAudio: value })}
            />
            <div className="w-8/12">
              <div className="w-full absolute top-0 left-0 z-20">
                <div className="flex flex-wrap px-5 py-3" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                  <div className="w-1/3 flex items-center">
                    {
                      <RoomInfo
                        // Load={loaded}
                        isSpesialist={true}
                        data={{ userId: userId, appointmentId: appointmentId }}
                      />
                    }
                  </div>
                  {<TimeCounter isEnded={isEnded} />}
                  {<EndCall endedHandler={(value) => setEnded(value)} />}
                </div>
                <div className="px-3 inline-block">
                  <Signal twilioSignal={TwilioSignalReducer} />
                </div>
                {
                  localState.localParticipantConnected === '' 
                  && remoteParticipantJoin
                    ? <Notification text="Sedang Menghubungkan" />
                    : ''
                }
                {
                  remoteState.remoteParticipantConnected === '' 
                  && !remoteParticipantJoin
                    ? <Notification info text="Pasien Belum Bergabung" />
                    : ''
                }
                {
                  localState.localParticipantConnected === 'CONNECTED'
                  && remoteState.remoteParticipantConnected === 'CONNECTED'
                    ? <Notification success text="Pasien Telah Terhubung" />
                    : ''
                }
                {
                  localState.localParticipantConnected === 'CONNECTED'
                  && remoteState.remoteParticipantConnected === 'RECONNECTING'
                    ? <Notification text="Terjadi Kesalahan Pada Pasien, Sedang Menghubungkan Kembali" />
                    : ''
                }
                {
                  localState.localParticipantConnected === 'RECONNECTING'
                  && remoteState.remoteParticipantConnected === 'CONNECTED'
                    ? <Notification info text="Sinyal Anda Tidak Stabil, Mencoba Menghubungkan Kembali" />
                    : ''
                }
                {
                  localState.localParticipantConnected === 'CONNECTED'
                  && remoteParticipantJoin
                  && (
                    remoteState.remoteParticipantConnected === 'DISCONNECTED'
                    || remoteState.remoteParticipantConnected === ''
                  )
                    ? <Notification error text="Pasien Tidak Dapat Terhubung" />
                    : ''
                }
              </div>
              <div className="relative h-full w-full relative">
                {
                  localState.localParticipantConnected === ''
                  && remoteState.remoteParticipantConnected === ''
                    ? <LoaderPatientCall isReconect />
                    : ''
                }
                {
                  remoteState.remoteParticipantConnected === ''
                  && localState.localParticipantConnected === 'CONNECTED'
                    ? <LoaderPatientCall isNotJoin />
                    : (
                      <RemoteParticipantTrack
                        avatar={avatar}
                        shareScreen={(value) => setRemoteState({ ...remoteState, remoteParticipantShareScreen: value })}
                        handler={(value) => setRemoteState({ ...remoteState, remoteParticipantVideo: value })}
                        error={(error) => setModalWindowData({
                          text: error,
                          visibility: true,
                          isButtonRefreshPage: false,
                        })}
                      />
                    )
                }
              </div>
            </div>
            <div className="w-2/12 px-3 py-3 flex items-end">
              <div className="w-full h-28 relative bottom-0 mb-5">
                {
                  localState.localParticipantAudio !== ''
                    ? (
                      <LocalMicrophoneInfo
                        muted={localState.localParticipantAudio === 'DISABLE'}
                      />
                    ) : ''
                }
                <LocalParticipantTrack
                  muted={localState.localParticipantVideo === 'DISABLE'}
                  handler={(value) => setLocalState({ ...localState, localParticipantVideo: value })}
                />
              </div>
            </div>
          </div>
        </div>
        <div id="footer-video" className="w-full flex flex-wrap items-center px-5 py-3 bg-dark1">
          <div className="w-1/3 text-left">
            <div className="flex flex-wrap items-center justify-start">
              <Microphone
                muted={localState.localParticipantAudio === 'DISABLE'}
                handler={(value) => setLocalState({ ...localState, localParticipantAudio: value })}
              />
              <Camera
                muted={localState.localParticipantVideo === 'DISABLE'}
                handler={(value) => setLocalState({ ...localState, localParticipantVideo: value })}
              />
            </div>
          </div>
          <div className="w-1/3 flex flex-wrap items-center justify-center">
            <ShareScreen
              shared={(value) => setLocalState({ ...localState, localParticipantShareScreen: value })}
              permission={(value) => {
                if (!value) {
                  setModalWindowData({
                    text: 'You Cancel To Share Your Screen',
                    visibility: true,
                    isButtonRefreshPage: false,
                  });
                }
              }}
            />
          </div>
          <div className="w-1/3 text-right">
            <div className="flex flex-wrap items-center justify-end">
              <div className="inline-block text-center mr-5">
                <img src={ThreeDots} alt="Three Dots Icon" className="mb-3 mt-2 mx-auto" />
                <p className="w-full text-white text-xs">Other</p>
              </div>
              <div className="inline-block text-center ml-5 cursor-pointer relative" onClick={() => setChat(!chat)}>
                {
                  notif && !chat ?
                    <div
                      className={`absolute right-0 top-0 z-10 bg-red-400 
                      text-white text-xxs rounded-full w-5 h-5 flex justify-center 
                      items-center -mt-3`}
                    />
                    : ""
                }
                <img src={ChatIcon} alt="Chat Icon" className="mb-2 mx-auto" />
                <p className="w-full text-white text-xs">Message</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-4/12 w-full lg:h-auto h-full bg-white lg:relative fixed z-20" style={{ display: chat ? 'block' : 'none' }}>
        <div
          className="w-full h-full"
        >
          <WrapChat
            error={(error) => setModalWindowData({
              text: error,
              visibility: true,
              isButtonRefreshPage: false,
            })}
            HeightElement={highElement}
            counterHeightWrapChat={(value) => setChat(value)}
            closeChat={() => setChat(false)}
            notif={(value) => setNotif(value)}
            visibility={chat}
          />
        </div>
      </div>
    </Template>
  );
};

const reducer = (state) => ({
  ParentHeight: state.HeightElementReducer.data,
  // TriggerReducer: state.TriggerReducer.data,
  RoomReducer: state.RoomReducer.data,
})

const props = {
  RoomData,
  // UserDataSelected,
  // CreateParamsAppointment
}

export default connect(reducer, props)(SpecialistCall)
