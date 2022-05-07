const initialState = {
  isEnabled: false,
  message: null,
  actionButton: null,
  cancelButton: null,
  actionButtonText: 'Ya',
  cancelButtonText: 'Tidak',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        ...state,
        ...(action?.payload || {}),
        isEnabled: true,
      };
    case 'HIDE_MODAL':
      return {
        ...state,
        isEnabled: false,
        message: null,
        actionButton: null,
        cancelButton: null,
        actionButtonText: 'Ya',
        cancelButtonText: 'Tidak',
      };
    default:
      return state;
  }
};

export default reducer;
