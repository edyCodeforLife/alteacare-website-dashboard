import { connect } from 'react-redux';
import { useState, useEffect } from '../../../libraries'
import { StopVideo, VideoOnWhite } from '../../../assets/images'
import { ModalWindow } from '../modal'

const Camera = ({ RoomReducer, muteHandler }) => {
  const [mute, setMute] = useState(false);
  const [restart, setRestart] = useState(false);
  const [permision, setPermision] = useState(null);
  const [browser, setBrowser] = useState(null);
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
    if (chromium) setBrowser('chromium');
    if (chrome) setBrowser('chrome');
    if (blink && chrome) setBrowser('chrome');
    if (blink && opera) setBrowser('opera');
  }, [])

  useEffect(() => {
    checkPermission()
    if (permision && permision.camera === 'denied') setMute(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permision, restart])

  const checkPermission = async () => {
    if (!permision) {
      if (browser === 'chrome' || browser === 'chromium') {
        const camera = await navigator.permissions.query({name: 'camera'})
        setPermision({ camera: camera.state });
      }

      if (browser === 'firefox') {
        try {
          await navigator.permissions.query({name: 'camera'})
          setPermision({ camera: 'granted'});
        } catch (error) {
          setPermision({ camera: 'denied'});
        }
      }

      setRestart(true);
    }
  };

  const muteVideo = () => {
    if (RoomReducer) {
      setMute(true);
      muteHandler(true);
      RoomReducer.room.localParticipant.videoTracks.forEach(track => {
        track.track.disable();
      })
    }
  }

  const unmuteVideo = () => {
    if (permision.camera === 'denied') {
      setModalWindowData({ visibility: true, text: "Silahkan beri akses untuk kamera anda dan refresh browser anda" });
      return;
    }

    if (RoomReducer) {
      setMute(false);
      muteHandler(false);
      RoomReducer.room.localParticipant.videoTracks.forEach(track => {
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
      mute || (RoomReducer && !RoomReducer.video) ?
        <div className="inline-block text-center ml-5 cursor-pointer cursor-pointer" onClick={unmuteVideo}>
          <img src={StopVideo} alt="Stop Video Icon" className="mb-3 mx-auto" />
          <p className="w-full text-white text-xs">Start video</p>
        </div>
      :
        <div className="inline-block text-center ml-5 cursor-pointer cursor-pointer" onClick={muteVideo}>
          <img src={VideoOnWhite} alt="Stop Video Icon" className="mb-3 mx-auto" />
          <p className="w-full text-white text-xs">Stop video</p>
        </div>
    }
    </>
  )
}

const props = (state) => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(props, null)(Camera);
