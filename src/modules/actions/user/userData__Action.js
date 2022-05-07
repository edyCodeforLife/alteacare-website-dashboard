export const UserDataSelected = (value) => {
  return dispatch => {
    dispatch(userSelectParam(value))
  }
}

export const UserDataSelectedId = (value) => {
  return dispatch => {
    dispatch(userSelectIdParam(value))
  }
}

export const PatientSelectAction = (value) => {
  return dispatch => {
    dispatch(patientSelect(value))
  }
}

export const setUserDataSelected = (data) => ({
  type: "USER_SELECT",
  load: data
})

const userSelectParam = (data) => ({
  type: "USER_SELECT",
  load: data
})

const userSelectIdParam = (data) => ({
  type: "USER_SELECT_ID",
  load: data
})

const patientSelect = (data) => ({
  type: "PATIENT_SELECT",
  load: data
})
