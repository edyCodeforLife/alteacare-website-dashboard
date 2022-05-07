import { io } from 'socket.io-client';
import { LocalStorage } from '../../helpers/localStorage';

const urlSocket =
  process.env.REACT_APP_BASE_ALTEACARE_SOCKET ||
  'https://staging-socket.alteacare.com';

const socketCallMA = () => {
  const callMa = io(urlSocket, {
    auth: {
      token: `Bearer ${LocalStorage('access_token')}`,
    },
    query: {
      method: 'CALL_MA',
    },
    autoConnect: false,
  });

  return callMa;
};

const socketInRoomMA = appointmentId => {
  const inRoomMA = io(urlSocket, {
    auth: {
      token: `Bearer ${LocalStorage('access_token')}`,
    },
    query: {
      method: 'IN_ROOM_MA',
      appointment_id: appointmentId,
    },
    autoConnect: false,
  });
  return inRoomMA;
};

const socketInRoomSpecialist = appointmentId => {
  const inRoomSpecialist = io(urlSocket, {
    auth: {
      token: `Bearer ${LocalStorage('access_token')}`,
    },
    query: {
      method: 'IN_ROOM_SP',
      appointment_id: appointmentId,
    },
    autoConnect: false,
  });
  return inRoomSpecialist;
};

const socketSpecialistCall = appointmentId => {
  const specialistCall = io(urlSocket, {
    auth: {
      token: `Bearer ${LocalStorage('access_token')}`,
    },
    query: {
      method: 'CONSULTATION_CALL',
      appointmentId: appointmentId,
    },
    autoConnect: false,
  });
  return specialistCall;
};

export {
  socketCallMA,
  socketInRoomMA,
  socketSpecialistCall,
  socketInRoomSpecialist,
};
