const initialState = {
  data: null
}

const initialState2 = {
  data: null
}

const initialState3 = {
  data: null
}

export const UserSelectReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_SELECT":
      return {
        ...state,
        data: action.load
      }
    default:
      return state
  }
}

export const UserSelectIdReducer = (state = initialState2, action) => {
  switch (action.type) {
    case "USER_SELECT_ID":
      return {
        ...state,
        data: action.load
      }
    default:
      return state
  }
}

export const PatientSelectReducer = (state = initialState3, action) => {
  switch (action.type) {
    case "PATIENT_SELECT":
      return {
        ...state,
        data: action.load
      }
    default:
      return state
  }
}