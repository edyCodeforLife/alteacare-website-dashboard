import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { StopVideo, VideoOnWhite } from '../../../assets/images';

const Camera = ({ muted, handler, RoomReducer }) => {
  const [mute, setMute] = useState(false);

  const muteHandler = () => {
    const room = RoomReducer?.room;

    if (room) {
      room.localParticipant.videoTracks.forEach(publication => {
        if (mute) publication.track.enable();
        if (!mute) publication.track.disable();
      });

      setMute(!mute);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handler(mute ? 'DISABLE' : 'ENABLE'), [mute]);
  useEffect(() => setMute(muted), [muted]);

  useEffect(() => () => setMute(false), []);

  return (
    <>
      {mute ? (
        <div
          className="inline-block text-center ml-5 cursor-pointer"
          onClick={() => muteHandler()}
        >
          <img src={StopVideo} alt="Stop Video Icon" className="mb-3 mx-auto" />
          <p className="w-full text-white text-xs">Start video</p>
        </div>
      ) : (
        <div
          className="inline-block text-center ml-5 cursor-pointer"
          onClick={() => muteHandler()}
        >
          <img
            src={VideoOnWhite}
            alt="Stop Video Icon"
            className="mb-3 mx-auto"
          />
          <p className="w-full text-white text-xs">Stop video</p>
        </div>
      )}
    </>
  );
};

const props = state => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(props, null)(Camera);
