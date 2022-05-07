import { MicMute, MicUnmute } from '../../../assets/images'
import { React, useState, useEffect } from '../../../libraries'
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

const LocalMicrophoneInfo = ({ Load, muted }) => {
  const [identity, setIdentity] = useState(null);
  const [mute, setMute] = useState(null);

  const {
    RoomReducer,
  } = useShallowEqualSelector((state) => state);

  useEffect(() => {
    if (Load) {
      const { identity } = RoomReducer.data;
      setIdentity(identity);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Load]);

  useEffect(() => {
    setMute(muted)
  }, [muted])

  return (
    <div className="absolute inset-x-0 bottom-0 mx-auto z-10 flex px-2 pb-1">
      <div className="w-full p-1 flex items-center justify-center rounded" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
        {
          mute
            ? <img src={MicMute} alt="Mic Unmute Icon" className="w-2 inline" />
            : <img src={MicUnmute} alt="Mic Unmute Icon" className="w-2 inline" />
        }
        <div className="w-full pl-2 text-white text-xxs truncate">{ identity }</div>
      </div>
    </div>
  );
}

export default LocalMicrophoneInfo;
