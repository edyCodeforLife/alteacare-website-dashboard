import { connect } from 'react-redux';
import { useState, useEffect } from '../../../libraries'
import { MicMute, MicUnmute } from '../../../assets/images'
import { ModalWindow } from '../modal'

const Microphone = ({ RoomReducer, muted }) => {
  const [mute, setMute] = useState(false);
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
    if (!permision) checkPermission()
    if (permision && permision.microphone === 'denied') {
      setMute(true);
      muted(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permision, restart])

  const checkPermission = async () => {
    if (browser === 'chrome' || browser === 'chromium') {
      const microphone = await navigator.permissions.query({name: 'microphone'})
      setPermision({ microphone: microphone.state });
    }

    if (browser === 'firefox') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setPermision({ microphone: 'granted'});
      } catch (error) {
        setPermision({ microphone: 'denied'});
      }
    }

    setRestart(true);
  };

  const muteAudio = () => {
    if (RoomReducer) {
      setMute(true);
      muted(true);
      RoomReducer.room.localParticipant.audioTracks.forEach(track => {
        track.track.disable();
      })
    }
  }

  const unmuteAudio = () => {
    if (permision.microphone === 'denied') {
      setModalWindowData({ visibility: true, text: "Silahkan beri akses untuk audio anda dan refresh browser anda" });
      return;
    }

    if (RoomReducer) {
      setMute(false);
      muted(false);
      RoomReducer.room.localParticipant.audioTracks.forEach(track => {
        track.track.enable();
      })
    }
  }

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
      {
        mute ?
        <div className="inline-block text-center mr-5 cursor-pointer" onClick={() => unmuteAudio()}>
          <img src={MicMute} alt="Mic Mute Icon" className="mb-2 mx-auto" />
          <p className="w-full text-white text-xs">Start mic</p>
        </div> :
        <div className="inline-block text-center mr-5 cursor-pointer" onClick={() => muteAudio()}>
          <img src={MicUnmute} alt="Mic Un Mute Icon" className="mb-2 mx-auto" />
          <p className="w-full text-white text-xs">Stop mic</p>
        </div>
      }
    </>
  )
}

const props = (state) => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(props, null)(Microphone);
