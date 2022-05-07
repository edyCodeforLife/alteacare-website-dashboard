import { useState } from 'react';
import Video from 'twilio-video';

import useShallowEqualSelector from '../../../../../helpers/useShallowEqualSelector';
import { RoomData } from '../../../../../modules/actions';

const Service = () => {
  const { RoomReducer } = useShallowEqualSelector(state => state);
  const [modal, setModal] = useState('');

  navigator.mediaDevices.ondevicechange = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    const room = RoomReducer?.room;

    if (audioDevices[0] && room) {
      const track = await Video.createLocalAudioTrack({
        deviceId: { exact: audioDevices[0].deviceId },
      });

      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      if (room.localParticipant.tracks.has(track.id))
        room.localParticipant.publishTrack(track);

      setModal('Your Microphone Has Change');
    }
  };

  window.addEventListener('beforeunload', () => {
    const room = RoomReducer?.room;
    if (room) room.disconnect();
    else RoomData({ reset: true });
  });

  return { modal, setModal };
};

export default Service;
