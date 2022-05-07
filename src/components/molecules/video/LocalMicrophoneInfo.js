import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { MicMute, MicUnmute } from '../../../assets/images';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

const LocalMicrophoneInfo = ({ RoomReducer }) => {
  const { twilioLocalState } = useShallowEqualSelector(state => state);
  const mute = twilioLocalState.localParticipantAudio === 'DISABLE';
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    const room = RoomReducer?.room;
    if (room) setIdentity(room.localParticipant.identity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RoomReducer]);

  return (
    <div className="absolute inset-x-0 bottom-0 mx-auto z-10 flex px-2 pb-1">
      <div
        className="w-full p-1 flex items-center justify-center rounded"
        style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
      >
        <img
          src={mute ? MicMute : MicUnmute}
          alt="Mic Unmute Icon"
          className="w-2 inline"
        />
        {identity && (
          <div className="w-full pl-2 text-white text-xxs truncate">
            {identity}
          </div>
        )}
      </div>
    </div>
  );
};

const reducer = state => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(reducer, null)(LocalMicrophoneInfo);
