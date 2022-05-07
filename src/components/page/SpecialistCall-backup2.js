
import Video from 'twilio-video';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { Template } from '../molecules/layout';
import { ModalWindow } from '../molecules/modal';
// import Notification from '../molecules/video/Notification';
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

  // const [modal, setModal] = useState('');
  const [notif, setNotif] = useState(false);

  const [userId, setUserId] = useState(null);
  // const [userId] = useState(null);

  const [avatar, setAvatar] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [isEnded, setEnded] = useState(false);
  // const [firstInit, setFirstInit] = useState(true);
  const [highElement, setHighElement] = useState('');
  // const [footerHeight, setfooterHeight] = useState('');

  const [appointmentId, setAppointmentId] = useState(null);
  // const [appointmentId] = useState(null);

  // const [backgroundLocal, setBackgroundLocal] = useState(null);
  const [sectionWrapChat, setSectionWrapChat] = useState(false);

  const [modalWindowData, setModalWindowData] = useState({
    text: "",
    visibility: false,
    isButtonRefreshPage: false,
  });

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

  const [state, setState] = useState({
    localShareScreen: null,
    muteVideoLocal: null,
    muteAudioLocal: null,
    muteVideoRemote: null,
    muteAudioRemote: null,
  });

  const [resetState] = useState(state);

  const {
    RoomData,
    RoomReducer,
    ParentHeight,
  } = props;

  const connectRoom = async (twilio) => {
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

      console.log('room', room);

      RoomData({ ...RoomReducer, room });

      setLocalState({
        ...localState,
        localParticipantAudio: 'ENABLE',
        localParticipantConnected: 'CONNECTED',
      });

      setLoaded(true);
    } catch (error) {
      // if (!error?.message.includes('Access Token expired')) setModal(error?.message);
      // else setModal('Sesi Video Call Telah Berakhir');

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

  const closeModalWindow = () => {
    setModalWindowData({
      text: "",
      visibility: false,
      isButtonRefreshPage: false,
    })
  }

  const toggleChat = () => {
    setNotif(false);
    setSectionWrapChat(true);
  }

  // const handleCloseChat = () => {
  //   setSectionWrapChat(false)
  // }

  useEffect(() => {
    const restored = token.split('-');

    // twilio
    const twilioParams = restored?.shift().replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
    const twilioRestored = CryptoJS.AES.decrypt(twilioParams, 'Secret Passphrase');
    const twilio = JSON.parse(twilioRestored.toString(CryptoJS.enc.Utf8));

    const appointment = twilio.appointment_detail;
    delete twilio.appointment_detail;
    delete twilio.user_id;

    connectRoom(twilio);

    setAppointmentId(appointment.appointment_id)
    setUserId(appointment.user_id)

    // setReduxForAppointment(appointment);

    return () => RoomData({ reset: true });
  }, [token]);

  useEffect(() => {
    if (ParentHeight) {
      // const footerVideo = document.getElementById('footer-video').clientHeight
      setHighElement(ParentHeight.heightElement)
      // setfooterHeight(parseInt(ParentHeight.heightElement)-parseInt(footerVideo))
    }
  }, [ParentHeight]);

  useEffect(() => () => {
    // setEnded(false);
    setNotif(false);
    setLoaded(false);
    // setFirstInit(false);
    setState(resetState);
    setSectionWrapChat(false);
  }, [resetState])

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
      <div className={`${sectionWrapChat ? 'lg:w-8/12' : 'lg:w-12/12'} w-full lg:flex-none lg:flex-nowrap flex flex-col`}>
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
                  {<TimeCounter Load={loaded} isEnded={isEnded} />}
                  {<EndCall endedHandler={(value) => setEnded(value)} Load={loaded} />}
                </div>
                <div className="px-3 inline-block">
                  <Signal twilioSignal={TwilioSignalReducer} />
                </div>
                {/* <Notification /> */}
              </div>
              <div className="relative h-full w-full relative">
                {
                  remoteState.remoteParticipantConnected === ''
                    ? <LoaderPatientCall />
                    : (
                      <RemoteParticipantTrack
                        avatar={avatar}
                        handler={(value) => setRemoteState({ ...remoteState, remoteParticipantVideo: value })}
                        muted={remoteState.remoteParticipantVideo === 'DISABLE'}
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
                console.log(value);
                // if (!value) setModal('You Cancel To Share Your Screen')
              }}
            />
          </div>
          <div className="w-1/3 text-right">
            <div className="flex flex-wrap items-center justify-end">
              <div className="inline-block text-center mr-5">
                <img src={ThreeDots} alt="Three Dots Icon" className="mb-3 mt-2 mx-auto" />
                <p className="w-full text-white text-xs">Other</p>
              </div>
              <div className="inline-block text-center ml-5 cursor-pointer relative" onClick={toggleChat}>
                {
                  notif && !sectionWrapChat ?
                    <div className="absolute right-0 top-0 z-10 bg-red-400 text-white text-xxs rounded-full w-5 h-5 flex justify-center items-center -mt-3"></div>
                    : ""
                }
                <img src={ChatIcon} alt="Chat Icon" className="mb-2 mx-auto" />
                <p className="w-full text-white text-xs">Message</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="lg:w-4/12 w-full bg-white relative"></div> */}
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
