import Video from 'twilio-video';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { Api } from '../../helpers/api';
import { WrapChat } from '../molecules/chat';
import { Template } from '../molecules/layout';
import { ModalWindow } from '../molecules/modal';
import { LocalStorage } from '../../helpers/localStorage';
import { useState, useEffect, useParams, Prompt } from '../../libraries';
import { specialistCallFunction } from '../../helpers/socket';
import TwilioSignal from '../../hooks/twilio-signal/TwilioSignal';
import Signal from '../molecules/video/Signal';
// import LoaderPatientCall from '../molecules/loader/LoaderPatientCall';
// import ReconnectedUserCall from '../molecules/loader/ReconnectedUserCall';

import {
  RoomData,
  UserDataSelected,
  CreateParamsAppointment,
} from '../../modules/actions'

import {
  ChatIcon,
  ThreeDots,
} from '../../assets/images'

import {
  Camera,
  EndCall,
  RoomInfo,
  Microphone,
  TimeCounter,
  ShareScreen,
  LocalMuteTrack,
  RemoteMuteTrack,
  LocalShareScreen,
  LocalMicrophoneInfo,
  RemoteMicrophoneInfo,
  LocalParticipantTrack,
  RemoteParticipantTrack,
} from '../molecules/video';

const Call = (props) => {
  const { TwilioSignalReducer } = TwilioSignal();

  const {
    RoomData,
    RoomReducer,
    TriggerReducer,
    HeightElementReducer,
  } = props;
  const { token } = useParams();
  const [userId, setUserId] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [notif, setNotif] = useState(false);
  const [avatar] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isEnded, setEnded] = useState(false);
  const [restart, setRestart] = useState(true);
  const [, setResponse] = useState(null);
  const [HeightElement, setHeightElement] = useState("");
  const [backgroundLocal, setBackgroundLocal] = useState(null);
  const [sectionWrapChat, setSectionWrapChat] = useState(false)
  const [backgroundRemote, setBackgroundRemote] = useState(null);
  const [FooterVideoHeight, setFooterVideoHeight] = useState("");
  const [modalWindowData, setModalWindowData] = useState({ visibility: false, text: "", isButtonRefreshPage: false });
  const [state, setState] = useState({
    localShareScreen: null,
    muteVideoLocal: null,
    muteAudioLocal: null,
    muteVideoRemote: null,
    muteAudioRemote: null,
  });

  useEffect(() => {
    if(appointmentId){
      const socket = specialistCallFunction(appointmentId);
      socket.connect()

      socket.on("connect_error", (err) => {
        // if(window.confirm('Koneksi tidak stabil, silahkan refresh halaman')) window.location.reload();
        setModalWindowData({ visibility: true, text: "Koneksi tidak stabil, silahkan refresh halaman", isButtonRefreshPage: true });
      });

      socket.on('CONSULTATION_STARTED', (data) => {
        console.log(data);
      })

      return () => {
        socket.disconnect();
      }
    }
  }, [appointmentId])

  useEffect(() => {
    if(HeightElementReducer){
      const footerVideo = document.getElementById('footer-video').clientHeight
      setHeightElement(HeightElementReducer.heightElement)
      setFooterVideoHeight(parseInt(HeightElementReducer.heightElement)-parseInt(footerVideo))
    }
  }, [HeightElementReducer])

  useEffect(() => {
    if (TriggerReducer && TriggerReducer.id === 'wrapChat') {
      setRestart(true);
    }
  }, [TriggerReducer]);

  useEffect(() => {
    navigator.mediaDevices.ondevicechange = async (event) => {
      await deviceChanged();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RoomReducer])

  const deviceChanged = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    if (!audioDevices[0]) return;
    const track = await Video.createLocalAudioTrack({deviceId: {exact: audioDevices[0].deviceId}});
    if (await RoomReducer && await RoomReducer.room) {
      const room = await RoomReducer.room;
      room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      room.localParticipant.publishTrack(track);
    }
  };

  useEffect(() => {
    const restoredUri = token.replace(/xMl3Jk/g,'+').replace(/Por21Ld/g,'/').replace(/Ml32/g,'=')
    const uri  = CryptoJS.AES.decrypt(restoredUri, 'Secret Passphrase');
    const data = JSON.parse(uri.toString(CryptoJS.enc.Utf8));

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioInput = devices.find(device => device.kind === 'audioinput');
      return Video.createLocalTracks({
        audio: { deviceId: audioInput.deviceId },
        video: data.enable.video ? {
          height: 640,
          width: 480,
          frameRate: 24,
        } : data.enable.video,
        maxAudioBitrate: 16000,
        region: 'sg1',
        networkQuality: {
          local: 1,
          remote: 2,
        },
        bandwidthProfile: {
          video: {
            contentPreferencesMode: 'manual',
            maxSubscriptionBitRate: 2500000,
          }
        }
      });
    }).then((localTrack) => {
      return Video.connect(data.token, {
        name: data.room_code,
        tracks: localTrack,
      })
    }).then((room) => {
      RoomData({
        room,
        identity: data.identity,
        token: data.token,
        roomCode: data.room_code,
        audio: data.enable.voice,
        video: data.enable.video
      });
      room.localParticipant.setNetworkQualityConfiguration({
        local: 2,
        remote: 1
      });
      setAppointmentId(data.appointment_detail.appointment_id)
      setUserId(data.appointment_detail.user_id)
      setLoaded(true);
      setResponse(data);
      setBackgroundLocal(`#${Math.floor(Math.random()*16777215).toString(16)}`);
      setBackgroundRemote(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    }).catch((error) => {
      if (error.message === 'Permission denied') {
        setModalWindowData({ visibility: true, text: "Silahkan beri akses kamera atau audio pada browser anda" });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);

  const toggleChat = () => {
    setNotif(false);
    setSectionWrapChat(true);
  }

  const handleCloseChat = () => {
    setSectionWrapChat(false)
  }

  const shareScreen = (screen) => {
    if (screen.status) setState({...state, localShareScreen: screen})
    else setState({...state, localShareScreen: null})
  }

  const remoteMuteVideoHandler = (params) => {
    if (params.mute === 'video') setState({...state, muteVideoRemote: params.status })
    else setState({...state, muteAudioRemote: params.status })
  }

  const leavePage = (location) => {
    Api.get(`/appointment/v1/consultation/${appointmentId}/finish-meet-specialist`,
      { headers: { "Authorization": `Bearer ${LocalStorage('access_token')}` } }
    ).catch(() => {
      console.clear();
    });

    if (RoomReducer && RoomReducer.room) {
      RoomReducer.room.localParticipant.tracks.forEach((publication) => {
        publication.track.stop();
        RoomReducer.room.localParticipant.unpublishTrack(publication.track);
      });

      RoomReducer.room.disconnect();
    }
  }

  const closeModalWindow = () => {
    setModalWindowData({ visibility: false, text: "", isButtonRefreshPage: false })
  }

  return (
    <Template isHiddenSide={true} HeightElement={HeightElement}>
      <Prompt message={location => leavePage()} />
      {modalWindowData.visibility ?
        <ModalWindow text={modalWindowData.text} counterClose={() => closeModalWindow()} isButtonRefreshPage={modalWindowData.isButtonRefreshPage} />
      : ""}
      <div className={`${ sectionWrapChat ? 'lg:w-8/12' : 'lg:w-12/12' } w-full`}>
        <div className="flex flex-wrap bg-black relative" style={{ height: FooterVideoHeight !== "" ? FooterVideoHeight+"px" : "" }}>
          <RemoteMicrophoneInfo muted={state.muteAudioRemote} Load={loaded}/>
          <div className="w-8/12 h-full">
            <div className="w-full absolute top-0 left-0 z-20">
              <div className="flex flex-wrap px-5 py-3" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="flex w-1/3 items-center">
                  { <RoomInfo data={{ userId: userId, appointmentId: appointmentId }} isSpesialist={true} Load={loaded} /> }
                </div>
                { <TimeCounter Load={loaded} isEnded={isEnded} /> }
                { <EndCall endedHandler={(value) => setEnded(value)} Load={loaded} /> }
              </div>
              <div className="px-3 inline-block">
                <Signal twilioSignal={TwilioSignalReducer} />
              </div>
                {/* <ReconnectedUserCall /> */}
            </div>
            <div className="relative h-full w-full relative">
              { <RemoteMuteTrack avatar={avatar} background={backgroundRemote} mute={state.muteVideoRemote}/> }
              { <RemoteParticipantTrack muteHandler={(value) => remoteMuteVideoHandler(value)} Load={loaded} /> }
              {/* <LoaderPatientCall /> */}
            </div>
          </div>
          <div className="w-2/12 px-3 py-3 flex flex-wrap items-end">
            <div className="w-full h-28 relative bottom-0 mb-5">
              <LocalMicrophoneInfo muted={state.muteAudioLocal} Load={loaded} />
              {
                state.localShareScreen ? <LocalShareScreen screen={state.localShareScreen} />
                : state.muteVideoLocal ? <LocalMuteTrack background={backgroundLocal} />
                : <LocalParticipantTrack Load={loaded} />
              }
            </div>
          </div>
        </div>
        <div id="footer-video" className="w-full bg-red-200 flex flex-wrap items-center px-5 py-3" style={{ backgroundColor: "#3A3A3C" }}>
          <div className="w-1/3 text-left">
            <div className="flex flex-wrap items-center justify-start">
              { <Microphone muted={(value) => setState({...state, muteAudioLocal: value})} /> }
              { <Camera muteHandler={(value) => setState({...state, muteVideoLocal: value})} /> }
            </div>
          </div>
          { <ShareScreen counter={ (value) => shareScreen(value) } Load={loaded} /> }
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
      <div className="lg:w-4/12 w-full bg-white relative">
        <div className="w-full flex flex-wrap items-start bg-white">
          <div className="w-full h-full absolute left-0 bottom-0 bg-white z-20 hidden"
            style={{ display: sectionWrapChat ? 'block' : 'none' }}>
            <WrapChat
              Load={loaded}
              HeightElement={HeightElement}
              counterHeightWrapChat={(value) => setSectionWrapChat(value)}
              counterCloseChat={() => handleCloseChat()}
              notif={(value) => setNotif(true)}
              visibility={sectionWrapChat}
            />
          </div>
        </div>
      </div>
    </Template>
  )
}

const reducer = (state) => ({
  HeightElementReducer: state.HeightElementReducer.data,
  TriggerReducer: state.TriggerReducer.data,
  RoomReducer: state.RoomReducer.data,
})

const props = {
  RoomData,
  UserDataSelected,
  CreateParamsAppointment
}

export default connect(reducer, props)(Call)
