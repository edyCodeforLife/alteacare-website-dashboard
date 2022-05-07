import { MicMute, MicUnmute } from '../../../assets/images'
import { React, useState, useEffect } from '../../../libraries'
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

const RemoteMicrophoneInfo = ({ muted, Load }) => {
  const [mute, setMute] = useState(null);
  const [identity, setIndentity] = useState(null);

  const {
    RoomReducer,
  } = useShallowEqualSelector((state) => state);

  useEffect(() => {
    if (Load && RoomReducer) {
      let identity;
      if (Array.from(RoomReducer.data.room.participants).length > 0) {
        identity = Array.from(RoomReducer.data.room.participants)[0][1].identity;
      } else {
        identity = 'Altea Patient'
      }

      setIndentity(identity);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, Load]);

  useEffect(() => {
    setMute(muted);
  }, [muted])

  return (
    <div className="w-2/12 px-5 flex items-end">
      <div className="p-2 flex items-center justify-center rounded mb-5 relative z-20" style={{ backgroundColor: "#3A3A3C" }}>
        {
          mute
            ? <img src={MicMute} alt="Mic Unmute Icon" className="w-4 inline" />
            : <img src={MicUnmute} alt="Mic Unmute Icon" className="w-4 inline" />
        }
        <div className="pl-2 text-white text-sm truncate">{ identity }</div>
      </div>
    </div>
  )
}

export default RemoteMicrophoneInfo;
