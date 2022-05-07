import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react';
import { MicMute, MicUnmute } from '../../../assets/images'

const Microphone = ({ muted, handler, RoomReducer }) => {
  const [mute, setMute] = useState(false);

  const muteHandler = () => {
    const room = RoomReducer?.room;

    if (room) {
      room.localParticipant.audioTracks.forEach((publication) => {
        if (mute) publication.track.enable();
        if (!mute) publication.track.disable();
      });

      setMute(!mute);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handler(mute ? 'DISABLE' : 'ENABLE'), [mute]);
  useEffect(() => setMute(muted), [muted]);

  useEffect(() => () => setMute(false), [])

  return (
    <>
      {
        mute
          ? (
            <div className="inline-block text-center mr-5 cursor-pointer" onClick={() => muteHandler()}>
              <img src={MicMute} alt="Mic Mute Icon" className="mb-2 mx-auto" />
              <p className="w-full text-white text-xs">Start mic</p>
            </div>
          ) : (
            <div className="inline-block text-center mr-5 cursor-pointer" onClick={() => muteHandler()}>
              <img src={MicUnmute} alt="Mic Un Mute Icon" className="mb-2 mx-auto" />
              <p className="w-full text-white text-xs">Stop mic</p>
            </div>
          )
      }
    </>
  )
}

const reducer = (state) => ({
  RoomReducer: state.RoomReducer.data,
})

export default connect(reducer, null)(Microphone)
