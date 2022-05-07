const initialState = {
    bps: 0,
    kbps: 0,
    mbps: 0,
    level: '',
  };

  const TwilioSignal = (state = initialState, action) => {
    if (action.type === 'TWILIO_SIGNAL_ACTION') {
      if (action.load.reset) return initialState;
      return {
        ...state,
        bps: action.load.bps,
        kbps: action.load.kbps,
        mbps: action.load.mbps,
        level: action.load.level,
        reset: false,
      }
    }

    return state;
  }

  export default TwilioSignal;
