const initialState = {
    data: []
  }
  
  export const FilterHospitalsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FILTER_HOSPITAL":
        return {
          ...state,
          data: action.load
        }
      default:
        return state
    }
  }