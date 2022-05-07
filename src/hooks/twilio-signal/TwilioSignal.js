import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import network from '../../helpers/network-speed';
import { TwilioSignalAction } from '../../modules/actions/twilio-signal/TwilioSignal__Action';
import useShallowEqualSelector from '../../helpers/useShallowEqualSelector';

const TwilioSignal = () => {
  const dispatch = useDispatch();
  const { downloadSpeed } = network();
  const [counted, setCounted] = useState(0);
  const [hasResponse, setHasResponse] = useState(false);
  const { TwilioSignalReducer } = useShallowEqualSelector((state) => state);

  const getNetworkDownloadSpeed = async () => {
    setHasResponse(false);

    const speed = await downloadSpeed({ url: 'https://eu.httpbin.org/stream-bytes/500000', size: 500000});
    setHasResponse(true);
    dispatch(TwilioSignalAction({ ...TwilioSignalReducer, ...speed }));
  };

  useEffect(() => {
    const { mbps, kbps } = TwilioSignalReducer

    if (parseFloat(mbps) > 10.00) {
      dispatch(TwilioSignalAction({ ...TwilioSignalReducer, level: 'high' }));
    } else if (parseFloat(mbps) <= 10.00 && parseFloat(mbps) >= 1.00) {
      dispatch(TwilioSignalAction({ ...TwilioSignalReducer, level: 'medium' }));
    } else if (parseFloat(kbps) < 1.00 && parseFloat(kbps) >= 0 ) {
      dispatch(TwilioSignalAction({ ...TwilioSignalReducer, level: 'low' }));
    } else {
      dispatch(TwilioSignalAction({ ...TwilioSignalReducer, level: '' }));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TwilioSignalReducer.mbps])

  useEffect(() => {
    if (!hasResponse && counted >= 5) {
      setHasResponse(false);
      dispatch(TwilioSignalAction({ reset: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counted])

  useEffect(() => {
    const interval = setInterval(() => {
      getNetworkDownloadSpeed();
      setCounted((number) => number === 5 ? 0 : number + 1);
    }, 5000);

    return () => {
      setCounted(0);
      clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    TwilioSignalReducer,
  };
};

export default TwilioSignal;
