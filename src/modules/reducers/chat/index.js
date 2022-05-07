const initialState = {
  notification: false,
  open: false,
  provider: {
    name: '',
    config: null,
  },
};

const chat = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CHAT_NOTIFICATION': {
      return { ...state, notification: action.payload };
    }
    case 'SET_CHAT_OPEN': {
      return { ...state, open: action.payload };
    }
    case 'SET_CHAT_PROVIDER': {
      return { ...state, provider: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default chat;
