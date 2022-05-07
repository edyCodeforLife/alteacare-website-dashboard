import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

import { User } from '../../../assets/images';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import { TwilioLocalStateAction } from '../../../modules/actions';

const LocalParticipantTrack = () => {
  const dispatch = useDispatch();
  const localMedia = useRef(null);
  const { RoomReducer, twilioLocalState } = useShallowEqualSelector(
    state => state
  );
  const mute = twilioLocalState.localParticipantVideo === 'DISABLE';
  const Room = RoomReducer?.data;

  const createTrack = async () => {
    const room = Room?.room;

    if (room) {
      const localTrack = [...room.localParticipant.videoTracks.values()];
      localMedia.current.innerHTML = '';

      if (localTrack.length > 0) {
        localMedia.current.appendChild(localTrack?.shift()?.track?.attach());
      }
    }
  };

  useEffect(() => {
    dispatch(
      TwilioLocalStateAction({
        ...twilioLocalState,
        localParticipantVideo: mute ? 'DISABLE' : 'ENABLE',
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mute]);

  useEffect(() => {
    const room = Room?.room;

    if (room) {
      room.localParticipant.videoTracks.forEach(publication => {
        if (mute) publication.track.detach();
        else createTrack();
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mute, RoomReducer]);

  return (
    <>
      {mute && (
        <div
          className="remote-participant custom-child-video w-full rounded flex justify-center items-center"
          style={{ height: '100%', backgroundColor: '#3868B0' }}
        >
          <img src={User} alt="default profile" />
        </div>
      )}
      <div
        className={`remote-participant custom-child-video h-full ${
          mute ? 'hidden' : ''
        }`}
        ref={localMedia}
      ></div>
    </>
  );
};

const reducer = state => ({
  RoomReducer: state.RoomReducer.data,
});

LocalParticipantTrack.propTypes = {
  RoomReducer: PropTypes.objectOf(PropTypes.any),
};

LocalParticipantTrack.defaultProps = {
  RoomReducer: {},
};

export default connect(reducer, null)(LocalParticipantTrack);
