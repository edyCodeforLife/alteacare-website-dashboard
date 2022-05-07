const initialState = {
  data: null,
}

export const TriggerReducer = (state = initialState, action) => {
  switch(action.type){
    case "TRIGGER_UPDATE":
      return {
        ...state,
        data: action.load
      }
    default:
      return state
  }
}
