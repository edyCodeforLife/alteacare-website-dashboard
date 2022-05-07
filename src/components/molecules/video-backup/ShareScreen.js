import Video from 'twilio-video';
import { connect } from 'react-redux';
import { ShareScreenIcon } from '../../../assets/images'
import { useEffect, useState } from '../../../libraries'
import { ModalWindow } from '../modal'

const ShareScreen = ({ RoomReducer, Load, counter }) => {
  const [screenTrack, setScreenTrack] = useState(null);
  const [permision, setPermision] = useState(null);
  const [browser, setBrowser] = useState(null);
  const [restart, setRestart] = useState(false);
  const [modalWindowData, setModalWindowData] = useState({ visibility: false, text: "" });

  useEffect(() => {
    const opera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    const firefox = typeof InstallTrigger !== 'undefined';
    const safaris = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
    const ie = /*@cc_on!@*/false || !!document.documentMode;
    const edge = !ie && !!window.StyleMedia;
    const chrome = navigator.userAgent.indexOf("Chrome") !== -1;
    const chromium = chrome && (navigator.userAgent.indexOf("Edg") !== -1);
    const blink = (chrome || opera) && !!window.CSS;

    if (opera) setBrowser('opera');
    if (firefox) setBrowser('firefox');
    if (safaris) setBrowser('safari');
    if (ie) setBrowser('ie');
    if (edge) setBrowser('edge');
    if (chrome) setBrowser('chrome');
    if (chromium) setBrowser('chromium');
    if (blink && chrome) setBrowser('chrome');
    if (blink && opera) setBrowser('opera');
  }, [])

  useEffect(() => {
    if (Load) checkPermission()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Load, restart]);

  useEffect(() => {
    if (screenTrack) {
      const { room } = RoomReducer
      room.localParticipant.publishTrack(screenTrack)
      counter({ track: screenTrack, status: true });
      screenTrack.mediaStreamTrack.onended = () => {
        setScreenTrack(null);
        counter({ track: null, status: false })
        room.localParticipant.unpublishTrack(screenTrack);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenTrack]);

  const checkPermission = async () => {
    if (browser === 'chrome' || browser === 'chromium') {
      const microphone = await navigator.permissions.query({ name: 'microphone' });
      const camera = await navigator.permissions.query({ name: 'camera' })
      setPermision({ camera: camera.state, microphone: microphone.state });
    }

    if (browser === 'firefox') {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then((stream) => { setPermision({ camera: true, microphone: true }); },
          e => { setPermision({ camera: 'denied', microphone: 'denied' }); });
    }

    if (browser === 'firefox') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        setPermision({ microphone: 'granted', camera: 'granted' });
      } catch (error) {
        setPermision({ microphone: 'denied', camera: 'denied' });
      }
    }

    setRestart(true);
  };

  const shareScreen = () => {
    if (Load && permision) {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        return Promise.reject(new Error('getDisplayMedia is not supported'));
      }

      if (!screenTrack) {
        navigator.mediaDevices.getDisplayMedia().then(stream => {
          setScreenTrack(new Video.LocalVideoTrack(stream.getVideoTracks()[0], { name: 'screen' }));
        }).catch(() => {
          setModalWindowData({ visibility: true, text: "Anda membatalkan untuk membagikan layar" });
        })
      }
    }
  };

  const closeModalWindow = () => {
    setModalWindowData({ visibility: false, text: "" });
  }

  return (
    <>
      {
        modalWindowData.visibility
          ? <ModalWindow text={modalWindowData.text} counterClose={() => closeModalWindow()} />
          : ""
      }
      <div className="w-1/3 flex flex-wrap items-center justify-center">
        <div className="inline-block text-center mr-5 cursor-pointer" onClick={() => shareScreen()}>
          <img src={ShareScreenIcon} alt="Share Screen Icon" className="mb-3 mt-2 mx-auto" />
          <p className="w-full text-white text-xs">Share Screen</p>
        </div>
      </div>
    </>
  )
}

const reducer = (state) => ({
  RoomReducer: state.RoomReducer.data
});

export default connect(reducer, null)(ShareScreen);
