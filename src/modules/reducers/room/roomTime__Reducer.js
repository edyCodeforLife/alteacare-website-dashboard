const initialState = {
  data: null
}

export const RoomTimeReducer = (state = initialState, action) => {
  if (action.type === 'SETROOMTIME') return { ...state, data: action.load }
  return state;
}
