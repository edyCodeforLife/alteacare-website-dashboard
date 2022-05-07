import { useRef, useEffect } from '../../../libraries'
import { connect } from 'react-redux';

const LocalParticipantTrack = ({ RoomReducer, Load }) => {
  const localMedia = useRef(null);

  const createTrack = async () => {
    if (Load && await RoomReducer) {
      const { room, video } = await RoomReducer;
      const localTrack = Array.from(room.localParticipant.videoTracks.values())[0]
      if (video && localTrack) {
        await localMedia.current.appendChild(localTrack?.track?.attach())
      }
    }
  };

  const handleTrackPublised = () => {

  };

  const handleReconect = () => {

  }

  const handleLocalParticipant = async () => {
    const { room } = await RoomReducer;
    room.on('trackPublished', participant => handleTrackPublised(participant));
    room.on('reconnecting', error => handleReconect(error));
    room.on('disconnected', (room, error) => {
      room.localParticipant.dataTracks.forEach((publication) => {
        console.log(publication);
        // publication.track.stop();
        // room.localParticipant.unpublishTrack(publication.track);
      });

      if (error?.code === 20104) {
        console.log('Signaling reconnection failed due to expired AccessToken!');
      } else if (error?.code === 53000) {
        console.log('Signaling reconnection attempts exhausted!');
      } else if (error?.code === 53002) {
        console.log('Signaling reconnection took too long!');
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => createTrack(), [Load, RoomReducer])

  useEffect(() => {
    // if (Load) handleLocalParticipant()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Load])

  return (
    <div className="remote-participant custom-child-video h-full h-full" ref={localMedia}></div>
  )
}

const reducer = (state) => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(reducer, null)(LocalParticipantTrack);
