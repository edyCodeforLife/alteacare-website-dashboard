const TwilioLocalStateAction = (data) => ({
  type: "TWILIO_LOCAL_STATE_ACTION",
  load: data
});

const TwilioRemoteStateAction = (data) => ({
  type: "TWILIO_REMOTE_STATE_ACTION",
  load: data
});

export { TwilioLocalStateAction, TwilioRemoteStateAction };
