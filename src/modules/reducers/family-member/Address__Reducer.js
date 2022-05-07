const initialState = {
  userId: '',
  street: '',
  country: '',
  province: '',
  city: '',
  district: '',
  subDistrict: '',
  rtRw: '',
};

const AddressReducer = (state = initialState, action) => {
  if (action.type === 'ADDRESS_MEMBER_ACTION') {
    if (action.load.reset) return initialState;
    return {
      ...state,
      userId: action.load.userId,
      street: action.load.street,
      country: action.load.country,
      province: action.load.province,
      city: action.load.city,
      district: action.load.district,
      subDistrict: action.load.subDistrict,
      rtRw: action.load.rtRw,
    }
  }

  return state;
}

export default AddressReducer;
