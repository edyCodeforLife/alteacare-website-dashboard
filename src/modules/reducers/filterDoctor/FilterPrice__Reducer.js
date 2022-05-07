const initialState = {
    data: []
  }
  
  export const FilterPriceReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FILTER_PRICE":
        return {
          ...state,
          data: action.load
        }
      default:
        return state
    }
  }