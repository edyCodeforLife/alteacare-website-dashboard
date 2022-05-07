const RoomData = (value) => {
  return dispatch => {
    dispatch(roomParam(value))
  }
};

const roomParam = (data) => ({
  type: "SETROOM",
  load: data
});

export {
  RoomData,
};
