export const socketCallMASetIsEnabled = data => ({
  type: 'SET_IS_ENABLED',
  payload: data,
});

export const socketCallMASetSocket = data => ({
  type: 'SET_SOCKET',
  payload: data,
});

export const socketCallMASetTotalCall = data => ({
  type: 'SET_TOTAL_CALL',
  payload: data,
});

export const socketCallMASetProfile = data => ({
  type: 'SET_PROFILE',
  payload: data,
});

export const socketCallMASetConnectedState = data => ({
  type: 'SET_CONNECTED_STATE',
  payload: data,
});
