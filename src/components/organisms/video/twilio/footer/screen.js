import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import services from './services';
import { ModalWindow } from '../../../../molecules/modal';
import { Camera, Microphone, ShareScreen } from '../../../../molecules/video';
import {
  ChatIcon,
  ChevronLeft,
  ChevronRight,
} from '../../../../../assets/images';
import useShallowEqualSelector from '../../../../../helpers/useShallowEqualSelector';
import { LocalStorage } from '../../../../../helpers/localStorage';
import {
  setChatNotification,
  setChatOpen,
  setVideoFullscreen,
} from '../../../../../modules/actions';

const Screen = () => {
  const dispatch = useDispatch();
  const { chat, video, twilioLocalState } = useShallowEqualSelector(
    state => state
  );
  const role = LocalStorage('role');
  const isDoctor = role === 'DOCTOR';

  const { stateHandler } = services();
  const [modal, setModal] = useState('');

  const handleClickMessage = function () {
    dispatch(setChatNotification(false));

    if (isDoctor) {
      dispatch(setVideoFullscreen(!video.fullscreen));
    } else {
      dispatch(setVideoFullscreen(false));
    }

    if (!video.fullscreen) {
      dispatch(setChatOpen(!chat.open));
    } else {
      dispatch(setChatOpen(true));
    }
  };

  const handleClickFullscreen = function () {
    dispatch(setVideoFullscreen(!video.fullscreen));

    if (isDoctor) {
      dispatch(setChatOpen(!chat.open));
    }
  };

  return (
    <>
      {modal && <ModalWindow text={modal} counterClose={() => setModal('')} />}
      <div
        id="footer-video"
        className="relative w-full bg-red-200 flex flex-wrap items-center px-5 py-3"
        style={{ backgroundColor: '#3A3A3C' }}
      >
        <div className="w-1/3 text-left">
          <div className="flex flex-wrap items-center justify-start">
            <Microphone
              muted={twilioLocalState.localParticipantAudio === 'DISABLE'}
              handler={value => stateHandler('localParticipantAudio', value)}
            />
            <Camera
              muted={twilioLocalState.localParticipantVideo === 'DISABLE'}
              handler={value => stateHandler('localParticipantVideo', value)}
            />
          </div>
        </div>
        <div className="w-1/3 flex flex-wrap items-center justify-center">
          <ShareScreen
            permission={value => {
              if (!value) setModal('You Cancel To Share Your Screen');
            }}
          />
        </div>
        <div className="w-1/3 text-right">
          <div className="flex flex-wrap items-center justify-end">
            <div
              className="hidden lg:inline-block text-center mr-5 cursor-pointer"
              tabIndex="0"
              role="button"
              onClick={handleClickFullscreen}
            >
              <img
                src={!video.fullscreen ? ChevronRight : ChevronLeft}
                alt="Three Dots Icon"
                className="mb-3 mt-2 mx-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p className="w-full text-white text-xs">
                {!video.fullscreen ? 'Full Screen' : 'Exit Full Screen'}
              </p>
            </div>
            <div
              className="inline-block text-center ml-5 cursor-pointer relative"
              onClick={handleClickMessage}
            >
              {chat.notification && !chat.open && (
                <div
                  className={`
                        absolute right-0 top-0 z-10 bg-red-400 text-white text-xxs
                        rounded-full w-5 h-5 flex justify-center items-center -mt-3
                      `}
                />
              )}
              <img src={ChatIcon} alt="Chat Icon" className="mb-2 mx-auto" />
              <p className="w-full text-white text-xs">Message</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Screen;
