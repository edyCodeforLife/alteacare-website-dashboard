const initialState = {
  reset: false,
  data: null
}

export const RoomReducer = (state = initialState, action) => {
  if (action.type === 'SETROOM') {
    if (action.load.reset) return initialState;
    return { ...state, data: action.load }
  }

  return state;
}
