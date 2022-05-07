const initialState = {
  avatar: { url: '' },
  fullscreen: false,
  sharescreen: null,
  provider: {
    name: '',
    config: null,
  },
};

const video = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_VIDEO_AVATAR': {
      return { ...state, avatar: action.payload };
    }
    case 'SET_VIDEO_FULLSCREEN': {
      return { ...state, fullscreen: action.payload };
    }
    case 'SET_VIDEO_SHARESCREEN': {
      return { ...state, sharescreen: action.payload };
    }
    case 'SET_VIDEO_PROVIDER': {
      return { ...state, provider: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default video;
