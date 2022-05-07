import { useRef, useEffect } from '../../../libraries'

const LocalShareScreen = ({ screen }) => {
  const shareScreen = useRef(null);

  useEffect(() => {
    if (screen) {
      shareScreen.current.appendChild(screen.track.attach())
    }
  }, [screen]);

  return (
    <div className="remote-participant custom-child-video" ref={shareScreen}></div>
  )
}

export default LocalShareScreen;
