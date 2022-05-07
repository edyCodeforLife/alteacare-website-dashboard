import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

import { MicMute, MicUnmute } from '../../../assets/images';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import { TwilioRemoteStateAction } from '../../../modules/actions';

const RemoteMicrophoneInfo = ({ RoomReducer }) => {
  const dispatch = useDispatch();
  const { twilioRemoteState } = useShallowEqualSelector(state => state);
  const [mute, setMute] = useState(null);
  const [identity, setIndentity] = useState('Altea Patient');

  const handleIdentity = async () => {
    const room = RoomReducer?.room;
    if (room && Array.from(room.participants).length > 0) {
      const identity = Array.from(room.participants)?.shift()[1]?.identity;
      setIndentity(identity);
    }
  };

  const handleTrackEvent = track => {
    track.on('disabled', () => {
      if (track.kind === 'audio') setMute(true);
    });

    track.on('enabled', () => {
      if (track.kind === 'audio') setMute(false);
    });
  };

  const participantConnected = participant => {
    participant.on('trackSubscribed', track => handleTrackEvent(track));
  };

  useEffect(() => {
    handleIdentity();
    const room = RoomReducer?.room;
    if (room)
      room.participants.forEach(participant =>
        participantConnected(participant)
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RoomReducer?.room, mute]);

  useEffect(() => {
    dispatch(
      TwilioRemoteStateAction({
        ...twilioRemoteState,
        remoteParticipantAudio: mute ? 'DISABLE' : 'ENABLE',
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mute]);

  useEffect(
    () => () => {
      setIndentity('Altea Patient');
      setMute(null);
    },
    []
  );

  return (
    <div className="w-2/12 px-5 flex items-end">
      <div
        className="p-2 flex items-center justify-center rounded mb-5 relative z-20"
        style={{ backgroundColor: '#3A3A3C' }}
      >
        <img
          src={mute ? MicMute : MicUnmute}
          alt="Mic Unmute Icon"
          className="w-4 inline"
        />
        <div className="pl-2 text-white text-sm truncate">{identity}</div>
      </div>
    </div>
  );
};

const reducer = state => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(reducer, null)(RemoteMicrophoneInfo);
