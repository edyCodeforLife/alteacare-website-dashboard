const RoomTime = (value) => {
  return dispatch =>{
    dispatch(roomTime(value))
  }
}

const roomTime = (data) => ({
  type: 'SETROOMTIME',
  load: data,
});

export {
  RoomTime,
};
