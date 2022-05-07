/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import services from './services';
import { ModalWindow } from '../../../molecules/modal';
import {
  LocalMicrophoneInfo,
  RemoteMicrophoneInfo,
  LocalParticipantTrack,
  LocalShareScreen,
} from '../../../molecules/video';
import TwilioChat from '../../../organisms/chat/twilio/screen';
import JitsiVideo from '../../../organisms/video/jitsi/screen';
import FlutterVideo from '../../../organisms/video/flutter/screen';
import TwilioVideo from '../../../organisms/video/twilio/screen';
import Footer from '../../../organisms/video/twilio/footer/screen';
import Navbar from '../../../organisms/video/twilio/navbar/screen';
import Notification from '../../../organisms/video/twilio/notification/screen';
import WindowListener from '../../../organisms/video/twilio/window-listener/screen';
import { ChatIcon } from '../../../../assets/images';
import useShallowEqualSelector from '../../../../helpers/useShallowEqualSelector';
import useHeight from '../../../../hooks/useHeight';
import {
  setChatNotification,
  setChatOpen,
  setVideoFullscreen,
} from '../../../../modules/actions';

const Screen = () => {
  const dispatch = useDispatch();
  const { videoHeight } = useHeight();

  const state = useShallowEqualSelector(state => state);
  const { chat, video, twilioLocalState } = state;

  const isJitsi = video.provider?.name === 'JITSI_WEB';
  const isFlutter = video.provider?.name === 'FLUTTER_WEBRTC';
  const isTwilio = video.provider?.name === 'TWILIO';
  const isTwilioChat =
    chat.provider?.name === 'TWILIO' && chat.provider?.config !== null;

  const { message, modalWindowData, closeModalWindow } = services();

  useEffect(() => dispatch(setVideoFullscreen(true)), []);

  const renderVideo = () => {
    // Jitsi provider
    if (isJitsi) {
      return <JitsiVideo />;
    }

    // Flutter provider
    if (isFlutter) {
      return <FlutterVideo height={videoHeight} />;
    }

    // Twilio provider
    return <TwilioVideo />;
  };

  console.log('video.fullscreen', video.fullscreen);
  console.log('chat.open', chat.open);

  return (
    <>
      {modalWindowData.visibility && (
        <ModalWindow
          text={modalWindowData.text}
          counterClose={() => closeModalWindow()}
          isButtonRefreshPage={modalWindowData.isButtonRefreshPage}
        />
      )}
      {isTwilio && <WindowListener />}
      {/* Video component */}
      <div
        className={clsx('w-full', !video.fullscreen && 'lg:w-8/12')}
        style={{ transition: 'all 0.5s ease' }}
      >
        <div
          className="flex bg-black relative"
          style={{
            height: `${videoHeight}px`,
          }}
        >
          <div className="w-full h-full flex relative">
            {/* Twilio component */}
            {isTwilio && <RemoteMicrophoneInfo />}
            {/* Video player, navbar, and notification for Twilio, Jitsi, and Flutter */}
            <div className="w-full">
              <div className="w-full absolute top-0 left-0 z-20">
                <Navbar />
                {/* Twilio component */}
                {isTwilio && <Notification message={message} />}
              </div>
              <div className="relative h-full w-full">{renderVideo()}</div>
            </div>
            {/* Chat button which is still using Twilio chat provider */}
            {!isTwilio && isTwilioChat && (
              <div
                className="absolute cursor-pointer"
                style={{
                  backgroundColor: '#131519',
                  borderRadius: '6px',
                  padding: '21px',
                  bottom: '15px',
                  right: '11px',
                }}
                onClick={() => {
                  dispatch(setVideoFullscreen(!video.fullscreen));
                  dispatch(setChatOpen(!chat.open));
                  dispatch(setChatNotification(false));
                }}
              >
                {chat.notification && !chat.open && (
                  <div
                    className="
                    absolute z-10 bg-red-400 text-white text-xxs
                    rounded-full w-5 h-5 flex justify-center items-center -mt-3"
                    style={{ top: '20px', right: '8px' }}
                  />
                )}
                <img src={ChatIcon} alt="Chat Icon" />
              </div>
            )}
            {/* Twilio component */}
            {isTwilio && (
              <div className="w-2/12 px-3 py-3 flex items-end">
                <div className="w-full h-28 relative bottom-0 mb-5">
                  {twilioLocalState.localParticipantAudio !== '' && (
                    <LocalMicrophoneInfo />
                  )}
                  {twilioLocalState.localParticipantShareScreen ? (
                    <LocalShareScreen screen={video.sharescreen} />
                  ) : (
                    <LocalParticipantTrack />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Twilio component */}
        {isTwilio && <Footer />}
      </div>
      {/* Chat modal and patient data */}
      <div
        className={clsx(
          'w-5/12 bg-white',
          video.fullscreen ? 'lg:w-0 lg:hidden' : 'lg:w-4/12',
          chat.open
            ? 'custom-height-chat absolute right-0 lg:relative'
            : 'hidden'
        )}
        style={{ transition: 'all 0.5s ease' }}
      >
        <div className="w-full h-full absolute left-0 bottom-0 bg-white z-20">
          {isTwilioChat && <TwilioChat />}
        </div>
      </div>
    </>
  );
};

export default Screen;
