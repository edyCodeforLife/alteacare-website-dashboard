export const CreateParamsAppointment = (data) => {
  return dispatch => {
    dispatch(CreateParamsAppointmentSend(data))
  }
}

export const CleanParamsAppointment = () => {
  return dispatch => {
    dispatch(CreateParamsAppointmentSend({
      "doctor_id": "",
      "user_id": "",
      "symptom_note": "",
      // "consultation_method": "VIDEO_CALL",
      "schedules": [],
      "document_resume": []
    }))
  }
}

export const setCleanParamsAppointment = () => ({
  type: "CREATE_PARAMS_APPOITMENT",
  load: {
    "doctor_id": "",
    "user_id": "",
    "symptom_note": "",
    // "consultation_method": "VIDEO_CALL",
    "schedules": [],
    "document_resume": []
  }
})

const CreateParamsAppointmentSend = (data) => ({
  type: "CREATE_PARAMS_APPOITMENT",
  load: data
})