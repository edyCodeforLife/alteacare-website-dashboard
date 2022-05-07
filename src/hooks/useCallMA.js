import { useEffect, useState } from 'react';
import { socketCallMA } from '../helpers/socket';
import { Incoming } from '../assets/music';
import { isJSON } from '../helpers/utils/object';
import EventEmitter from '../helpers/utils/eventEmitter';
import useShallowEqualSelector from '../helpers/useShallowEqualSelector';
import { batch, useDispatch } from 'react-redux';
import {
  socketCallMASetConnectedState,
  socketCallMASetIsEnabled,
  socketCallMASetProfile,
  socketCallMASetSocket,
  socketCallMASetTotalCall,
} from '../modules/actions/socketCallMA';
import { showModal } from '../modules/actions/modal';

const useCallMA = ({ isEnabled = false }) => {
  const {
    isEnabled: isEnabledCallMA,
    socket,
    totalCall,
    profile,
    connectedState,
  } = useShallowEqualSelector(state => state.socketCallMA);
  const dispatch = useDispatch();
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [enableRefreshPage, setEnableRefreshPage] = useState(false);

  useEffect(() => {
    batch(() => {
      dispatch(socketCallMASetIsEnabled(isEnabled));
      dispatch(socketCallMASetSocket(null));
      dispatch(socketCallMASetTotalCall(0));
      dispatch(socketCallMASetProfile(null));
      dispatch(socketCallMASetConnectedState('CONNECTING'));
    });
    if (!isEnabled) {
      return;
    }
    if (!notification) {
      setupNotification();
    }
    let socketInstance;

    const timerStart = setTimeout(() => {
      socketInstance = socketCallMA();
      socketInstance.connect();
      dispatch(socketCallMASetSocket(socketInstance));
    }, 1000);

    return () => {
      notification?.pause();
      dispatch(socketCallMASetConnectedState('CONNECTING'));
      socketInstance?.disconnect();
      clearTimeout(timerStart);
      dispatch(socketCallMASetSocket(null));
    };
  }, [isEnabled, notification, dispatch]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('connect_error', err => {
      setEnableRefreshPage(true);
      dispatch(socketCallMASetConnectedState('FAILED'));
      setError(
        `${err?.message || err || 'Something went wrong'} (connect_error)`
      );
    });

    socket.on('socket_error', err => {
      setEnableRefreshPage(true);
      setError(
        `${err?.message || err || 'Something went wrong'} (socket_error)`
      );
    });

    socket.on('ROOM_INFO', data => {
      if (data?.type === 'ERROR') {
        setError(data?.data?.message);
      }
    });

    socket.on('CURRENT_TOTAL_CALL_MA', ({ total }) => {
      dispatch(socketCallMASetTotalCall(Number(total || 0)));
    });

    socket.on('CALL_MA_ALREADY_ANSWERED', data => {
      notification?.pause();
      EventEmitter.emit('CALL_MA_ALREADY_ANSWERED', data);
    });

    socket.on('CALL_MA_MISSED', data => {
      notification?.pause();
      EventEmitter.emit('CALL_MA_MISSED', data);
    });

    socket.on('CALL_MA', data => {
      notification?.pause();
      EventEmitter.emit('CALL_MA', data);
    });

    socket.on('ME', data => {
      batch(() => {
        dispatch(socketCallMASetConnectedState('CONNECTED'));
        dispatch(socketCallMASetProfile(data));
      });
    });

    const answeredCall = data => {
      socket.emit('ANSWERED_CALL', data);
    };

    EventEmitter.subscribe('ANSWERED_CALL', answeredCall);
    return () => {
      notification?.pause();
      socket?.off('connect_error');
      socket?.off('socket_error');
      socket?.off('ROOM_INFO');
      socket?.off('CURRENT_TOTAL_CALL_MA');
      socket?.off('CALL_MA_ALREADY_ANSWERED');
      socket?.off('CALL_MA_MISSED');
      socket?.off('CALL_MA');
      socket?.off('ME');
      EventEmitter.unsubscribe('ANSWERED_CALL', answeredCall);
    };
  }, [socket, notification, dispatch]);

  useEffect(() => {
    if (!notification) {
      setupNotification();
      return;
    }

    if (totalCall > 0) {
      notification.currentTime = 0;
      notification?.play();
    }

    if (totalCall < 1) {
      notification.currentTime = 0;
      notification?.pause();
    }
  }, [notification, totalCall]);

  useEffect(() => {
    if (!error) {
      return;
    }

    let message = `${isJSON(error) ? JSON.stringify(error) : error}`;
    if (enableRefreshPage) {
      message = `Koneksi tidak stabil, silahkan refresh halaman (${
        isJSON(error) ? JSON.stringify(error) : error
      })`;
    }

    const payloadModal = {
      message,
    };

    if (enableRefreshPage) {
      payloadModal.actionButtonText = 'Refresh Halaman';
      payloadModal.actionButton = () => window.location.reload();
    }

    dispatch(showModal(payloadModal));
  }, [error, enableRefreshPage, dispatch]);

  const setupNotification = () => {
    const audio = new Audio(Incoming);
    setNotification(audio);
  };

  return {
    isEnabled: isEnabledCallMA,
    socket,
    totalCall,
    profile,
    connectedState,
  };
};

export default useCallMA;
