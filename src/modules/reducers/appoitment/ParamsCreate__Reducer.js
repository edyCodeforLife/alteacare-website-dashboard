const initialState = {
  data: {
    "doctor_id": "",
    "user_id": "",
    "symptom_note": "",
    "consultation_method": "VIDEO_CALL",
    "schedules": [],
    "document_resume": []
  }
}

export const ParamCreateAppointment = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_PARAMS_APPOITMENT":
      return {
        ...state,
        data: action.load
      }
    default:
      return state
  }
}