import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { User } from '../../../assets/images';
import { RoomData, TwilioRemoteStateAction } from '../../../modules/actions';

const RemoteParticipantTrack = props => {
  const { twilioRemoteState, avatar, RoomReducer } = props;
  const dispatch = useDispatch();
  const remoteMedia = useRef(null);
  const [mute, setMute] = useState(false);
  const [children, setChildren] = useState([]);
  const [remoteTrack, setRemoteTrack] = useState(null);
  const [initial, setInitial] = useState('Altea Patient');

  const handleIdentity = async () => {
    const room = RoomReducer?.room;
    if (room && Array.from(room.participants).length > 0) {
      const identity = Array.from(room.participants)?.shift()[1]?.identity;
      setInitial(identity);
    }
  };

  useEffect(() => {
    const room = RoomReducer?.room;

    if (room) {
      const participants = [...room.participants.values()];
      const participant = participants.shift();

      // handling on refresh
      if (participant) {
        handleIdentity();
        room.participants.forEach(participant =>
          participantConnected(participant)
        );
      }

      // handing first connect
      room.once('participantConnected', () => {
        handleIdentity();
        room.participants.forEach(participant =>
          participantConnected(participant)
        );
      });

      room.on('participantConnected', () => {
        handleIdentity();
        room.participants.forEach(participant =>
          participantConnected(participant)
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RoomReducer?.room]);

  useEffect(() => {
    dispatch(
      TwilioRemoteStateAction({
        ...twilioRemoteState,
        remoteParticipantVideo: mute ? 'DISABLE' : 'ENABLE',
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mute]);

  const handleTrackEvent = track => {
    if (
      remoteMedia.current &&
      remoteMedia.current.children &&
      remoteMedia.current.children.length > 0
    ) {
      if (remoteMedia.current.children[1] !== undefined) {
        remoteMedia.current.removeChild(remoteMedia.current.children[1]);
      }
    }

    const isShareScreen = track.name.includes('share');
    dispatch(
      TwilioRemoteStateAction({
        ...twilioRemoteState,
        remoteParticipantShareScreen: isShareScreen,
      })
    );

    remoteMedia?.current?.appendChild(track.attach());

    if (!remoteTrack) setRemoteTrack(track);

    track.on('disabled', () => {
      if (track.kind === 'video') setMute(true);
    });

    track.on('enabled', () => {
      if (track.kind === 'video') setMute(false);
    });
  };

  const participantConnected = participant => {
    remoteMedia.current.innerHTML = '';
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        remoteMedia.current.appendChild(publication.track.attach());
      }
    });

    participant.on('trackSubscribed', track => handleTrackEvent(track));
  };

  useEffect(() => {
    const collection = document.getElementsByClassName('video');
    const html = collection[0];
    setChildren(html.children);
  }, [RoomReducer?.room]);

  useEffect(() => {
    if (children.length > 2) {
      remoteMedia.current.innerHTML = '';
      remoteMedia?.current?.appendChild(remoteTrack.attach());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  useEffect(() => {
    setMute(false);
    setChildren([]);
    setRemoteTrack(null);
    setInitial('Altea Patient');
  }, []);

  return (
    <>
      {mute && (
        <div className="custom-child-video-large w-full bg-black z-10 rounded flex flex-wrap justify-center items-center mb-3">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full mx-auto overflow-hidden bg-dark4 flex items-center justify-center mb-4">
              <img src={avatar || User} alt="Profile" />
            </div>
            <div className="w-full font-bold text-lg text-white">{initial}</div>
          </div>
        </div>
      )}
      <div
        className={clsx(
          'custom-child-video-large absolute left-0 top-0 video',
          mute && 'hidden'
        )}
        ref={remoteMedia}
      />
    </>
  );
};

const reducer = state => ({
  RoomReducer: state.RoomReducer.data,
  signal: state.TwilioSignalReducer,
});

const props = {
  RoomData,
};

RemoteParticipantTrack.defaultProps = {
  RoomReducer: {},
  avatar: '',
};

RemoteParticipantTrack.propTypes = {
  twilioRemoteState: PropTypes.object.isRequired,
  RoomReducer: PropTypes.objectOf(PropTypes.any),
  avatar: PropTypes.string,
};

export default connect(reducer, props)(RemoteParticipantTrack);
