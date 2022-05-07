import { useState, useEffect } from 'react';
import { useDispatch, batch } from 'react-redux';

import useShallowEqualSelector from '../../../../../helpers/useShallowEqualSelector';
import {
  RoomData,
  TwilioLocalStateAction,
  TwilioRemoteStateAction,
} from '../../../../../modules/actions';

const Service = () => {
  const {
    RoomReducer,
    twilioLocalState,
    twilioRemoteState,
    TwilioSignalReducer,
  } = useShallowEqualSelector(state => state);

  const twilioSignal = TwilioSignalReducer;
  const Room = RoomReducer?.data;
  const dispatch = useDispatch();
  const [signal, setSignal] = useState('');
  const [modal, setModal] = useState('');
  const [state, setState] = useState({
    ...twilioRemoteState,
    ...twilioLocalState,
  });

  useEffect(() => {
    setState({
      ...twilioLocalState,
      ...twilioRemoteState,
    });
  }, [twilioRemoteState, twilioLocalState]);

  useEffect(() => setSignal(twilioSignal.signal), [twilioSignal]);

  const stateHandler = (identifier, value) =>
    batch(() => {
      if (identifier.includes('remote')) {
        dispatch(
          TwilioRemoteStateAction({
            ...twilioRemoteState,
            [`${identifier}`]: typeof value === 'string' ? `${value}` : value,
          })
        );
      } else {
        dispatch(
          TwilioLocalStateAction({
            ...twilioLocalState,
            [`${identifier}`]: typeof value === 'string' ? `${value}` : value,
          })
        );
      }
    });

  const shouldDisconnect = () => {
    const room = RoomReducer?.room;
    if (room) room.disconnect();
    else dispatch(RoomData({ reset: true }));

    batch(() => {
      dispatch(
        TwilioRemoteStateAction({
          ...twilioRemoteState,
          remoteParticipantConnected: 'DISCONNECTED',
        })
      );
      dispatch(
        TwilioLocalStateAction({
          ...twilioLocalState,
          localParticipantConnected: 'DISCONNECTED',
          localParticipantVideo: 'DISABLE',
        })
      );
    });
  };

  useEffect(() => {
    const room = Room?.room;

    if (room?.participants) {
      const participants = [...room.participants.values()];
      const participant = participants.shift();

      dispatch(
        TwilioRemoteStateAction({
          ...twilioRemoteState,
          remoteParticipantConnected: participant?.state?.toUpperCase(),
        })
      );

      room.once('participantConnected', participant => {
        stateHandler('remoteParticipantConnected', 'CONNECTED');
      });

      room.on('participantConnected', participant => {
        stateHandler('remoteParticipantConnected', 'CONNECTED');
      });

      room.on('participantDisconnected', participant => {
        stateHandler('remoteParticipantConnected', 'DISCONNECTED');
      });

      room.on('participantReconnected', participant => {
        stateHandler('remoteParticipantConnected', 'RECONNECTED');
      });

      room.on('participantReconnecting', participant => {
        stateHandler('remoteParticipantConnected', 'RECONNECTING');
      });

      room.once('participantDisconnected', participant => {
        stateHandler('remoteParticipantConnected', 'DISCONNECTED');
      });

      room.on('reconnected', () => {
        dispatch(
          TwilioLocalStateAction({
            ...twilioLocalState,
            localParticipantConnected: 'RECONNECTED',
            localParticipantVideo: 'ENABLE',
          })
        );
      });

      room.on('reconnecting', error => {
        const connectionLocal = room?.localParticipant?.state;
        if (connectionLocal === 'reconnecting') {
          dispatch(
            TwilioLocalStateAction({
              ...twilioLocalState,
              localParticipantConnected: 'RECONNECTING',
              localParticipantVideo: 'DISABLE',
            })
          );
        }

        room?.participants?.forEach(participant => {
          if (participant.state === 'reconnecting') {
            stateHandler('remoteParticipantConnected', 'RECONNECTING');
          }
        });
      });

      room.on('disconnected', (room, error) => {
        if (
          error?.code === 20104 ||
          error?.code === 53000 ||
          error?.code === 53002 ||
          error?.code === 53405
        ) {
          shouldDisconnect();
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Room?.room]);

  useEffect(() => {
    const room = Room?.room;
    const localConnection = twilioLocalState.localParticipantConnected;
    if (room && localConnection === '') {
      stateHandler('localParticipantConnected', 'CONNECTED');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Room?.room, twilioLocalState.localParticipantConnected]);

  return {
    signal,
    modal,
    state,
    setModal,
  };
};

export default Service;
