import Video from 'twilio-video';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux'
import { WrapChat } from '../molecules/chat';
import { Template } from '../molecules/layout';
import { ModalWindow } from '../molecules/modal';
import { SectionFormPatient } from '../molecules/patient';
import { useState, useEffect, useParams, Prompt } from '../../libraries';
import TwilioSignal from '../../hooks/twilio-signal/TwilioSignal';
import Signal from '../molecules/video/Signal';
import LoaderPatientCall from '../molecules/video/LoaderPatientCall';
import Notification from '../molecules/video/Notification';
import TwilioNotification from '../organisms/twilio-notification/Screen';

import AppointmentDetail from '../../hooks/appointment/AppointmentDetail';

import {
  RoomData,
  UserDataSelected,
  PatientSelectAction,
  CleanParamsAppointment,
  CreateParamsAppointment,
} from '../../modules/actions'

import {
  ChatIcon,
  ChevronRight,
  ChevronLeft,
  // ThreeDots,
} from '../../assets/images'

import {
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

const Call = (props) => {
  const { TwilioSignalReducer } = TwilioSignal();

  const { getAppointmentDetail } = AppointmentDetail();

  const {
    // signal,
    RoomData,
    RoomReducer,
    // TriggerReducer,
    UserDataSelected,
    PatientSelectAction,
    parentHeight,
    CreateParamsAppointment,
  } = props;

  const { token } = useParams();
  const [modal, setModal] = useState('');
  const [chat, setChat] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [notif, setNotif] = useState(false);
  const [isEnded, setEnded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [highElement, sethighElement] = useState('');
  const [footerHeight, setfooterHeight] = useState('');
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [localState, setLocalState] = useState({
    localParticipantSignal: '', // LOW, MEDIUM, HIGH
    localParticipantConnected: '', // CONNECTED, RECONNECTING, RECONECTED, DISCONNECTED
    localParticipantVideo: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
    localParticipantAudio: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
    localParticipantShareScreen: false,
  });
  const [remoteState, setRemoteState] = useState({
    remoteParticipantSignal: '', // LOW, MEDIUM, HIGH
    remoteParticipantConnected: '', // CONNECTED, RECONNECTING, RECONECTED, DISCONNECTED
    remoteParticipantVideo: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
    remoteParticipantAudio: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
    remoteParticipantShareScreen: false,
  });
  const [resetLocalState] = useState(localState);
  const [resetRemoteState] = useState(remoteState);

  // devvice handler
  navigator.mediaDevices.ondevicechange = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    const room = RoomReducer?.room;

    if (audioDevices[0] && room) {
      const track = await Video.createLocalAudioTrack({ deviceId: { exact: audioDevices[0].deviceId } });

      room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      if (room.localParticipant.tracks.has(track.id)) room.localParticipant.publishTrack(track);

      setModal('Your Microphone Has Change');
    }
  }


  // signal handler
  window.addEventListener('online',  () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));
  window.addEventListener('beforeunload', () => {
    const room = RoomReducer?.room;
    if (room) room.disconnect();
    else RoomData({ reset: true });
  });

  useEffect(() => {
    if (parentHeight) {
      const footerVideo = document.getElementById('footer-video').clientHeight
      sethighElement(parentHeight.heightElement)
      setfooterHeight(parseInt(parentHeight.heightElement)-parseInt(footerVideo))
    }
  }, [parentHeight])

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

      room.data = twilio;

      RoomData({ ...RoomReducer, room });
      setModal('');
      setLocalState({
        ...localState,
        localParticipantAudio: 'ENABLE',
        localParticipantConnected: 'CONNECTED',
      });
    } catch (error) {
      if (error?.message.includes('Access Token expired')) setModal('Sesi Video Call Telah Berakhir');
      else if (error?.message.includes('Signaling connection error')) setModal('Anda Tidak Memiliki Koneksi Internet')
      else setModal(error?.message);

      RoomData({ reset: true });

      setLocalState({
        ...localState,
        localParticipantConnected: 'DISCONNECTED',
      })

      setRemoteState({
        ...remoteState,
        remoteParticipantConnected: 'DISCONNECTED',
      })
    }
  }

  const setReduxForAppointment = async (appointmentData) => {
    const appointmentResult = await getAppointmentDetail(appointmentData.appointment_id);
    const patient = appointmentResult?.data?.data?.patient;
    const user = appointmentResult?.data?.data?.user;
    const patientUser = appointmentResult?.data?.data?.parent_user;

    patient.id = appointmentData.patient_id;
    user.id = appointmentData.user_id;

    setAvatar(patientUser?.avatar?.url);
    PatientSelectAction(patient);
    UserDataSelected(user);

    delete appointmentData.user_raw;
    delete appointmentData.user_type;
    CreateParamsAppointment(appointmentData);
  }

  const parameter = () => {
    const restored = token.split('-');

    // twilio
    const twilioParams = restored?.shift().replace(/xMl3Jk/g,'+').replace(/Por21Ld/g,'/').replace(/Ml32/g,'=');
    const twilioRestored  = CryptoJS.AES.decrypt(twilioParams, 'Secret Passphrase');
    const twilio = JSON.parse(twilioRestored.toString(CryptoJS.enc.Utf8));

    // appointment
    const appointmentParams = restored?.pop().replace(/xMl3Jk/g,'+').replace(/Por21Ld/g,'/').replace(/Ml32/g,'=');
    const appointmentRestored  = CryptoJS.AES.decrypt(appointmentParams, 'Secret Passphrase');
    const appointment = JSON.parse(appointmentRestored.toString(CryptoJS.enc.Utf8));

    return {
      twilio,
      appointment
    }
  }

  useEffect(() => {
    const { twilio, appointment } = parameter();

    connectRoom(twilio);
    setReduxForAppointment(appointment);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isOnline]);

  useEffect(() => {
    if (localState.localParticipantConnected === 'RECONNECTING') {
      const { twilio } = parameter();
      connectRoom(twilio);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localState])

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
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'CONNECTED'
        })
      });

      room.on('participantConnected', (participant) => {
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'CONNECTED'
        })
      });

      room.on('participantReconnected', (remoteParticipant) => {
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'RECONNECTED'
        })
      });

      room.on('participantReconnecting', (remoteParticipant, error) => {
        // try to get how long patient try to connect, when patient took to long connection until 2 min or more change to disconnected
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'RECONNECTING'
        })
      });

      room.once('participantDisconnected', (participant) => {
        setModal(`Pasien ${participant.identity} telah meninggalkan ruangan`);
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'DISCONNECTED'
        })
      });

      room.on('reconnected', () => {
        setLocalState({
          ...localState,
          localParticipantConnected: 'RECONECTED',
          localParticipantVideo: 'ENABLE',
        })
      });

      room.on('reconnecting', (error) => {
        if (error.code === 53001) {
          console.log('remote');
          setRemoteState({
            ...remoteState,
            remoteParticipantConnected: 'RECONNECTING',
            remoteParticipantVideo: 'DISABLE',
          })
        } else if (error.code === 53405) {
          console.log('local');
          setLocalState({
            ...localState,
            localParticipantConnected: 'RECONNECTING',
            localParticipantVideo: 'DISABLE',
          })
        }
        /* Update the application UI here */
      });

      room.on('disconnected', (room, error) => {
        setRemoteState({
          ...remoteState,
          remoteParticipantConnected: 'DISCONNECTED'
        })

        setLocalState({
          ...localState,
          localParticipantConnected: 'DISCONNECTED'
        })
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RoomReducer]);

  useEffect(() => console.log(remoteState), [remoteState])

  // clear state
  useEffect(() => () => {
    setModal('');
    setAvatar('');
    setChat(false);
    setNotif(false);
    setEnded(false);
    sethighElement('');
    setfooterHeight('');
    setSideBarToggle(false);
    RoomData({ reset: true });
    setLocalState(resetLocalState);
    setRemoteState(resetRemoteState);
  }, [resetLocalState, resetRemoteState, RoomData]);

  return (
    <Template HeightElement={highElement}>
      <Prompt message={location => {}} />
      {
        modal !== ''
          ? <ModalWindow text={modal} counterClose={() => setModal('')} />
          : ''
      }
      <div style={{ transition: 'all 0.5s ease' }} className={`${!sideBarToggle ? 'lg:w-8/12' : 'lg:w-full'} w-full`}>
        <div className="flex flex-wrap bg-black relative" style={{ height: `${footerHeight}px` }}>
          <RemoteMicrophoneInfo
            handler={(value) => setRemoteState({ ...remoteState, remoteParticipantAudio: value })}
          />
          <div className="w-8/12 h-full">
            <div className="w-full absolute top-0 left-0 z-20">
              <div className="flex flex-wrap px-5 py-3" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="flex w-1/3 items-center">
                  <RoomInfo />
                  <Signal twilioSignal={TwilioSignalReducer} />
                </div>
                <TimeCounter isEnded={isEnded} />
                <EndCall endedHandler={(value) => setEnded(value)} />
              </div>
              <TwilioNotification />
              {
                localState.localParticipantConnected === ''
                  ? <Notification text="Sedang Menghubungkan Anda" />
                  : ''
              }
              {
                localState.localParticipantConnected === 'CONNECTED'
                && remoteState.remoteParticipantConnected === ''
                  ? <Notification error text="Pasien Tidak Dapat Terhubung" />
                  : ''
              }
              {
                localState.localParticipantConnected === 'CONNECTED'
                && remoteState.remoteParticipantConnected === 'CONNECTED'
                  ? <Notification info text="Pasien Telah Terhubung" />
                  : ''
              }
              {
                localState.localParticipantConnected === 'CONNECTED'
                && remoteState.remoteParticipantConnected === 'RECONNECTING'
                  ? <Notification text="Terjadi Kesalahan Pada Pasien, Pasien Sedang Menghubungkan Kembali" />
                  : ''
              }
              {
                localState.localParticipantConnected === 'CONNECTED'
                && remoteState.remoteParticipantConnected === 'RECONNECTED'
                  ? <Notification info text="Pasien Telah Kembali Ke Ruangan" />
                  : ''
              }
              {
                localState.localParticipantConnected === 'CONNECTED'
                && remoteState.remoteParticipantConnected === 'DISCONNECTED'
                  ? <Notification info text="Pasien Telah Meninggalkan Ruangan" />
                  : ''
              }
              {
                localState.localParticipantConnected === 'RECONNECTING'
                && remoteState.remoteParticipantConnected === 'CONNECTED'
                  ? <Notification info text="Sinyal Anda Tidak Stabil, Mencoba Menghubungkan Kembali" />
                  : ''
              }
              {
                localState.localParticipantConnected === 'RECONNECTED'
                && remoteState.remoteParticipantConnected === 'CONNECTED'
                  ? <Notification info text="Anda Telah Kembali Ke Ruangan" />
                  : ''
              }
              {
                localState.localParticipantConnected === 'DISCONNECTED'
                && remoteState.remoteParticipantConnected === 'DISCONNECTED'
                  ? <Notification info text="Konversasi Telah Berakhir, Silahkan Akhiri Panggilan" />
                  : ''
              }
            </div>
            <div className="relative h-full w-full relative">
              {
                localState.localParticipantConnected === ''
                && remoteState.remoteParticipantConnected === ''
                  ? <LoaderPatientCall isReconect />
                  : (
                    <RemoteParticipantTrack
                      avatar={avatar}
                      shareScreen={(value) => setRemoteState({ ...remoteState, remoteParticipantShareScreen: value })}
                      handler={(value) => setRemoteState({ ...remoteState, remoteParticipantVideo: value })}
                      error={(error) => setModal(error)}
                    />
                  )
              }
              {
                localState.localParticipantConnected === 'RECONNECTING'
                && remoteState.remoteParticipantConnected === 'CONNECTED'
                  ? <LoaderPatientCall isReconect />
                  : ''
              }
            </div>
          </div>
          <div className="w-2/12 px-3 py-3 flex flex-wrap items-end">
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
        <div id="footer-video" className="w-full bg-red-200 flex flex-wrap items-center px-5 py-3" style={{ backgroundColor: "#3A3A3C" }}>
          <div className="w-1/3 text-left">
            <div className="flex flex-wrap items-center justify-start">
              <Microphone
                muted={localState.localParticipantAudio === 'DISABLE'}
                handler={(value) => setLocalState({ ...localState, localParticipantAudio: value })}
              />
              <Camera
                muted={localState.localParticipantVideo  === 'DISABLE'}
                handler={(value) => setLocalState({ ...localState, localParticipantVideo: value})}
              />
            </div>
          </div>
          <div className="w-1/3 flex flex-wrap items-center justify-center">
            <ShareScreen
              shared={(value) => setLocalState({ ...localState, localParticipantShareScreen: value })}
              permission={(value) => {
                if (!value) setModal('You Cancel To Share Your Screen')
              }}
            />
          </div>
          <div className="w-1/3 text-right">
            <div className="flex flex-wrap items-center justify-end">
              <div
                className="inline-block text-center mr-5 cursor-pointer"
                tabIndex="0"
                role="button"
                onClick={() => setSideBarToggle(!sideBarToggle)}
                onKeyPress={() => setSideBarToggle(!sideBarToggle)}
              >
                <img
                  src={!sideBarToggle ? ChevronRight : ChevronLeft}
                  alt="Three Dots Icon"
                  className="mb-3 mt-2 mx-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <p className="w-full text-white text-xs">
                  {!sideBarToggle ? 'Full Screen' : 'Exit Full Screen'}
                </p>
              </div>
              <div className="inline-block text-center ml-5 cursor-pointer relative" onClick={() => setChat(!chat)}>
                {
                  notif && !chat
                    ? (
                      <div
                        className={`
                          absolute right-0 top-0 z-10 bg-red-400 text-white text-xxs
                          rounded-full w-5 h-5 flex justify-center items-center -mt-3
                        `}
                      />
                    ) : ''
                }
                <img src={ChatIcon} alt="Chat Icon" className="mb-2 mx-auto" />
                <p className="w-full text-white text-xs">Message</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ transition: 'all 0.5s ease' }}
        className={`${!sideBarToggle ? 'lg:w-4/12 opacity-1' : 'lg:w-0 opacity-0'} w-full bg-white relative`}
      >
        <div className="w-full flex flex-wrap items-start bg-white">
          <div className={`w-full h-full absolute left-0 bottom-0 bg-white z-20 ${!chat ? 'hidden' : ''}`}>
            <WrapChat
              error={(error) => setModal(error)}
              HeightElement={highElement}
              counterHeightWrapChat={(value) => setChat(value)}
              closeChat={() => setChat(false)}
              notif={(value) => setNotif(value)}
              visibility={chat}
            />
          </div>
          <div className="w-full" style={{ display: !chat ? 'block' : 'none' }}>
            <SectionFormPatient
              type="call"
              buttonBack={false}
              hiddenButtonChevronLeft={true}
              // isEnableUpdateAppointment={true}
            />
          </div>
        </div>
      </div>
    </Template>
  )
}

const reducer = (state) => ({
  parentHeight: state.HeightElementReducer.data,
  TriggerReducer: state.TriggerReducer.data,
  RoomReducer: state.RoomReducer.data,
  signal: state.TwilioSignalReducer,
})

const props = {
  RoomData,
  UserDataSelected,
  PatientSelectAction,
  CleanParamsAppointment,
  CreateParamsAppointment,
}

export default connect(reducer, props)(Call)
