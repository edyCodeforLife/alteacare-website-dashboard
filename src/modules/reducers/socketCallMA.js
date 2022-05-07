const initialState = {
  isEnabled: false,
  socket: null,
  totalCall: 0,
  profile: null,
  connectedState: 'CONNECTING',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_ENABLED':
      return {
        ...state,
        isEnabled: action.payload,
      };
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload,
      };
    case 'SET_TOTAL_CALL':
      return {
        ...state,
        totalCall: action.payload,
      };
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
      };
    case 'SET_CONNECTED_STATE':
      return {
        ...state,
        connectedState: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
