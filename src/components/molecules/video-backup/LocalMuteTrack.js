import { connect } from 'react-redux';
import { useState, useEffect } from '../../../libraries'

const LocalMuteTrack = (props) => {
  const {
    RoomReducer,
    background,
  } = props;

  const [initial, setInitial] = useState(null);

  useEffect(() => {
    if (RoomReducer) {
      const identity = RoomReducer.identity.split('@');
      setInitial(`${identity[0].charAt(0).toUpperCase()} ${identity[0].charAt(1).toUpperCase()}`)
    }
  }, [RoomReducer])

  return (
    <div className="remote-participant custom-child-video w-full rounded flex justify-center items-center"
      style={{ height: "100%", backgroundColor: background }}
    >
      <div className="font-bold text-2xl text-white">{ initial ? initial : '' }</div>
    </div>
  )
}

const props = (state) => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(props, null)(LocalMuteTrack);
