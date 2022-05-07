const initialState = {
  data: []
}

export const FilterSpesialistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FILTER_SPESIALIST":
      return {
        ...state,
        data: action.load
      }
    default:
      return state
  }
}