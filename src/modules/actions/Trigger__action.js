export const TriggerUpdate = (value) => {
  return dispatch => {
    dispatch(TriggerUpdateParam(value))
  }
}

export const setTriggerUpdate = (data) => ({
  type: "TRIGGER_UPDATE",
  load: data
})

const TriggerUpdateParam = (data) => ({
  type: "TRIGGER_UPDATE",
  load: data
})
