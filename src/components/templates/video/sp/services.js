/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Video from 'twilio-video';

import {
  socketSpecialistCall,
  socketInRoomSpecialist,
} from '../../../../helpers/socket';
import useShallowEqualSelector from '../../../../helpers/useShallowEqualSelector';
import useCallingUri from '../../../../hooks/useCallingUri';
import { RoomData, TwilioLocalStateAction } from '../../../../modules/actions';

const Service = () => {
  const dispatch = useDispatch();
  const { appointmentId } = useCallingUri();

  const state = useShallowEqualSelector(state => state);
  const { video, RoomReducer, twilioLocalState, twilioRemoteState } = state;
  const isTwilio = video.provider?.name === 'TWILIO';
  const Room = RoomReducer?.data;

  const [modalWindowData, setModalWindowData] = useState({
    text: '',
    visibility: false,
    isButtonRefreshPage: false,
  });
  const [message, setMessage] = useState('');
  const [shouldReinit, setShouldReinit] = useState(false);

  // Listen online state
  // let [online, isOnline] = useState(navigator.onLine);
  // const setOffline = () => isOnline(false)
  // const setOnline = () => isOnline(true)

  // // Register the event listeners
  // useEffect(() => {
  //   window.addEventListener('offline', setOffline);
  //   window.addEventListener('online', setOnline);

  //   // Cleanup once unmount
  //   return () => {
  //     window.removeEventListener('offline', setOffline);
  //     window.removeEventListener('online', setOnline);
  //   }
  // }, []);

  const closeModalWindow = () => {
    setModalWindowData({
      text: '',
      visibility: false,
      isButtonRefreshPage: false,
    });
  };

  const connectRoom = async config => {
    try {
      let room = {};

      if (isTwilio) {
        const { token, room_code, identity } = config;
        room = await Video.connect(token, {
          region: 'sg1',
          name: room_code,
          video: {
            height: 640,
            width: 480,
            frameRate: 24,
            name: `${identity}-video`,
          },
          audio: {
            name: `${identity}-audio`,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      }

      room.data = config;

      dispatch(RoomData({ ...Room, room }));
    } catch (error) {
      if (error?.message.includes('Access Token expired')) {
        setModalWindowData({
          text: 'Sesi Video Call Telah Berakhir',
          visibility: true,
          isButtonRefreshPage: false,
        });
      } else if (error?.message?.includes('duplicate identity')) {
        setModalWindowData({
          text: '',
          visibility: false,
          isButtonRefreshPage: false,
        });
      } else if (error?.message.includes('Signaling connection error')) {
        setModalWindowData({
          text: 'Anda Tidak Memiliki Koneksi Internet',
          visibility: true,
          isButtonRefreshPage: false,
        });
      } else {
        setModalWindowData({
          text: error?.message,
          visibility: true,
          isButtonRefreshPage: false,
        });
      }
    }
  };

  const specialistConnectCall = ({ socket, socketInRoom }) => {
    socket.connect();

    socket.on('connect_error', () => {
      setModalWindowData({
        visibility: true,
        isButtonRefreshPage: true,
        text: 'Koneksi tidak stabil, silahkan refresh halaman',
      });
    });

    socket.on('CONSULTATION_STARTED', () => {
      socket.disconnect();

      socketInRoom.connect();

      socketInRoom.on('ROOM_INFO', room => {
        setMessage(room?.message);
        if (room?.type?.includes('USER_CONNECTED')) setShouldReinit(false);
        if (room?.type?.includes('USER_DISCONNECTED')) setShouldReinit(true);
      });
    });
  };

  useEffect(() => {
    connectRoom(video.provider?.config);

    const socket = socketSpecialistCall(appointmentId);
    const socketInRoom = socketInRoomSpecialist(appointmentId);
    specialistConnectCall({ socket, socketInRoom });

    return () => socketInRoom.disconnect();
  }, [shouldReinit]);

  const { remoteParticipantConnected } = twilioRemoteState;
  useEffect(() => {
    const isDc = remoteParticipantConnected === 'DISCONNECTED';
    const condition = shouldReinit && isTwilio && isDc;
    if (condition) {
      dispatch(
        TwilioLocalStateAction({
          ...twilioLocalState,
          localParticipantVideo: 'ENABLE',
        })
      );
    }
  }, [shouldReinit, isTwilio, remoteParticipantConnected]);

  return { message, modalWindowData, closeModalWindow };
};

export default Service;
