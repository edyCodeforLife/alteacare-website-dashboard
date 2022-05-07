import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Video from 'twilio-video';

import { ShareScreenIcon } from '../../../assets/images';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import {
  setVideoSharescreen,
  TwilioLocalStateAction,
} from '../../../modules/actions';

const ShareScreen = ({ RoomReducer, permission }) => {
  const dispatch = useDispatch();
  const { video, twilioLocalState } = useShallowEqualSelector(state => state);
  const isSharescreen = twilioLocalState.localParticipantShareScreen;

  const handleShareScreen = async () => {
    try {
      const room = RoomReducer?.room;

      if (room) {
        const media = await navigator.mediaDevices.getDisplayMedia();
        const trackScreen = new Video.LocalVideoTrack(
          media.getVideoTracks()[0],
          {
            name: `${room?.localParticipant?.identity}-share-screen`,
          }
        );

        room.localParticipant.videoTracks.forEach(publication => {
          publication.track.stop();
          room.localParticipant.unpublishTrack(publication.track);
        });

        room.localParticipant.publishTrack(trackScreen);
        permission(true);
        dispatch(setVideoSharescreen(trackScreen));
        dispatch(
          TwilioLocalStateAction({
            ...twilioLocalState,
            localParticipantShareScreen: true,
          })
        );
      }
    } catch (error) {
      permission(false);
    }
  };

  useEffect(() => {
    const room = RoomReducer?.room;

    if (room && video.sharescreen) {
      video.sharescreen.mediaStreamTrack.onended = async () => {
        const videos = await navigator.mediaDevices.enumerateDevices();
        const video = videos.filter(device => device.kind === 'videoinput');

        const trackVideo = await Video.createLocalVideoTrack({
          deviceId: { exact: video[0].deviceId },
          video: {
            height: 640,
            width: 480,
            frameRate: 24,
            name: `${room?.localParticipant?.identity}-video`,
          },
        });

        room.localParticipant.videoTracks.forEach(publication => {
          publication.track.stop();
          room.localParticipant.unpublishTrack(publication.track);
        });

        room.localParticipant.publishTrack(trackVideo);
        dispatch(
          TwilioLocalStateAction({
            ...twilioLocalState,
            localParticipantShareScreen: false,
          })
        );
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.sharescreen]);

  return (
    <>
      {!isSharescreen && (
        <div
          className="inline-block text-center mr-5 cursor-pointer"
          onClick={() => handleShareScreen()}
        >
          <img
            src={ShareScreenIcon}
            alt="Share Screen Icon"
            className="mb-3 mt-2 mx-auto"
          />
          <p className="w-full text-white text-xs">Share Screen</p>
        </div>
      )}
    </>
  );
};

const reducer = state => ({
  RoomReducer: state.RoomReducer.data,
});

ShareScreen.propTypes = {
  RoomReducer: PropTypes.objectOf(PropTypes.any),
  permission: PropTypes.func,
};

ShareScreen.defaultProps = {
  RoomReducer: {},
  permission: () => {},
};

export default connect(reducer, null)(ShareScreen);
