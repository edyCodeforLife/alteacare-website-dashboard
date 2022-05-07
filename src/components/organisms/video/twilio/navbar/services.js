import { useState, useEffect } from 'react';

import TwilioSignal from '../../../../../hooks/twilio-signal/TwilioSignal';

const Service = () => {
  const { TwilioSignalReducer } = TwilioSignal();
  const [isEnded, setEnded] = useState(false);
  const [signal, setSignal] = useState(TwilioSignalReducer);

  useEffect(() => setSignal(TwilioSignalReducer), [TwilioSignalReducer]);

  useEffect(
    () => () => {
      setEnded(false);
      setSignal(false);
    },
    []
  );

  return {
    signal,
    isEnded,
    setEnded,
  };
};

export default Service;
