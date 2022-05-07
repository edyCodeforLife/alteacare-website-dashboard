const initialState = {
  patientId: '',
  userId: '',
  familyRelationType: '',
  firstName: '',
  lastName: '',
  gender: '',
  birthDate: '',
  birthCountry: '',
  birthPlace: '',
  nationality: '',
  cardId: '',
  cardPhoto: '',
  addressId: '',
  insuranceCompanyId: '',
  insurancePlafonGroup: '',
  insuranceNumber: '',
  externalPatientId: '',
  externalProvider: '',
  contactEmail: '',
  contactPhone: '',
  reset: false,
};

const MemberReducer = (state = initialState, action) => {
  if (action.type === 'MEMBER_ACTION') {
    if (action.load.reset) return initialState;
    return {
      ...state,
      patientId: action.load.patientId,
      userId: action.load.userId,
      familyRelationType: action.load.familyRelationType,
      firstName: action.load.firstName,
      lastName: action.load.lastName,
      gender: action.load.gender,
      birthDate: action.load.birthDate,
      birthCountry: action.load.birthCountry,
      birthPlace: action.load.birthPlace,
      nationality: action.load.nationality,
      cardId: action.load.cardId,
      cardPhoto: action.load.cardPhoto,
      addressId: action.load.addressId,
      insuranceCompanyId: action.load.insuranceCompanyId,
      insurancePlafonGroup: action.load.insurancePlafonGroup,
      insuranceNumber: action.load.insuranceNumber,
      externalPatientId: action.load.externalPatientId,
      externalProvider: action.load.externalProvider,
      contactEmail: action.load.contactEmail,
      contactPhone: action.load.contactPhone,
      reset: false,
    }
  }

  return state;
}

export default MemberReducer;
