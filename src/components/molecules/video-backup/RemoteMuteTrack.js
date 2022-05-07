import { connect } from 'react-redux';
import { useState, useEffect } from '../../../libraries'

const RemoteMuteTrack = ({ RoomReducer, avatar, background, mute }) => {
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    if (RoomReducer) {
      let identity;
      if (Array.from(RoomReducer.room.participants).length > 0) {
        identity = Array.from(RoomReducer.room.participants)[0][1].identity.split('@');
      } else {
        identity = ['Altea', 'Patient'];
      }

      setInitial(`${identity[0].charAt(0).toUpperCase()} ${identity[0].charAt(1).toUpperCase()}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mute])

  return (
    <div className="custom-child-video-large w-full z-10 rounded flex justify-center items-center mb-3"
      style={{ backgroundColor: background, display: mute || (RoomReducer && !RoomReducer.video) ? '' : 'none' }}
    >
      {
        avatar ?
          <img src={avatar.url} className="h-52 w-52 rounded-full" alt="avatar"/> :
          <div className="font-bold text-7xl text-white">{ initial ? initial : ''   }</div>
      }
    </div>
  )
}

const props = (state) => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(props, null)(RemoteMuteTrack);
