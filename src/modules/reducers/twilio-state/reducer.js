const localState = {
  reset: false,
  localParticipantConnected: '', // CONNECTED, RECONNECTING, RECONECTED, DISCONNECTED
  localParticipantVideo: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
  localParticipantAudio: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
  localParticipantShareScreen: false,
};

const remoteState = {
  reset: false,
  remoteParticipantConnected: '', // CONNECTED, RECONNECTING, RECONECTED, DISCONNECTED
  remoteParticipantVideo: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
  remoteParticipantAudio: '', // PUBLISHED, UNPUBLISHED, ENABLE, DISABLE
  remoteParticipantShareScreen: false,
}

const TwilioLocalState = (state = localState, action) => {
  if (action.type === 'TWILIO_LOCAL_STATE_ACTION') {
    if (action.load.reset) return localState;
    return {
      ...state,
      localParticipantConnected: action.load.localParticipantConnected,
      localParticipantVideo: action.load.localParticipantVideo,
      localParticipantAudio: action.load.localParticipantAudio,
      localParticipantShareScreen: action.load.localParticipantShareScreen,
    }
  }

  return state;
}

const TwilioRemoteState = (state = remoteState, action) => {
  if (action.type === 'TWILIO_REMOTE_STATE_ACTION') {
    if (action.load.reset) return remoteState;
    return {
      ...state,
      remoteParticipantConnected: action.load.remoteParticipantConnected,
      remoteParticipantVideo: action.load.remoteParticipantVideo,
      remoteParticipantAudio: action.load.remoteParticipantAudio,
      remoteParticipantShareScreen: action.load.remoteParticipantShareScreen,
      reset: false,
    }
  }

  return state;
}


export { TwilioRemoteState, TwilioLocalState };
