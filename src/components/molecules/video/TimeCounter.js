import { useDispatch } from 'react-redux'
import { RoomTime } from '../../../modules/actions';
import { LocalStorage } from '../../../helpers/localStorage'
import { React, useHistory, useEffect, useState } from '../../../libraries';

const TimeCounter = ({ isEnded }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [second, setSecond] = useState(0);

  useEffect(() => {
    let tempSeconds = 0
    const interval = setInterval(() => {
      tempSeconds += 1
      setSecond(tempSeconds)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (isEnded && LocalStorage('role') === 'DOCTOR') {
      dispatch(RoomTime(converter(second)))
      history.push('/call-end');
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnded])

  useEffect(() => () => setSecond(0), [])

  const pad = (num) => {
    return ("0"+num).slice(-2);
  }

  const converter = (secs) => {
    var minutes = Math.floor(secs / 60);
    secs = secs%60;
    var hours = Math.floor(minutes/60)
    minutes = minutes%60;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

  return (
    <div className="w-1/3 text-center text-white">{ converter(second) }</div>
  )
}

export default TimeCounter;
