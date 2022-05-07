/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useDispatch, batch } from 'react-redux';
import moment from 'moment';
import Video from 'twilio-video';

import { socketInRoomMA } from '../../../../helpers/socket';
import useShallowEqualSelector from '../../../../helpers/useShallowEqualSelector';
import AppointmentDetail from '../../../../hooks/appointment/AppointmentDetail';
import useCallingUri from '../../../../hooks/useCallingUri';
import {
  RoomData,
  UserDataSelected,
  PatientSelectAction,
  TwilioLocalStateAction,
  CreateParamsAppointment,
  setVideoAvatar,
} from '../../../../modules/actions';

const Services = () => {
  const dispatch = useDispatch();
  const { appointmentId } = useCallingUri();
  const { getAppointmentDetail } = AppointmentDetail();

  const state = useShallowEqualSelector(state => state);
  const { video, RoomReducer, twilioLocalState, twilioRemoteState } = state;
  const isTwilio = video.provider?.name === 'TWILIO';
  const Room = RoomReducer?.data;

  const [modal, setModal] = useState('');
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

  const restructureAppointment = appointment => {
    let medicalDocuments = [];
    if (appointment.medical_document?.length > 0) {
      appointment.medical_document?.forEach(doc => {
        medicalDocuments.push(doc.file_id);
      });
    }

    return {
      appointment_id: appointment.id,
      doctor_id: appointment.doctor?.id,
      user_id: appointment.user_id,
      patient_id: appointment.patient_id,
      symptom_note:
        appointment.symptom_note !== null ? appointment.symptom_note : '',
      schedules: [
        {
          code: appointment.schedule?.code,
          date: appointment.schedule?.date,
          time_start: moment(
            appointment.schedule?.time_start,
            'HH:mm:ss'
          ).format('HH:mm'),
          time_end: moment(appointment.schedule?.time_end, 'HH:mm:ss').format(
            'HH:mm'
          ),
        },
      ],
      document_resume: medicalDocuments,
    };
  };

  const setAppointment = async appointmentId => {
    const result = await getAppointmentDetail(appointmentId);
    const appointment = result?.data?.data || {};

    const parentUser = appointment.parent_user;
    const patient = appointment.patient;

    const appointmentDetail = restructureAppointment(appointment);

    dispatch(setVideoAvatar(parentUser.avatar));
    batch(() => {
      dispatch(UserDataSelected(parentUser));
      dispatch(PatientSelectAction(patient));
      dispatch(CreateParamsAppointment(appointmentDetail));
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
      if (error?.message.includes('Access Token expired'))
        setModal('Sesi Video Call Telah Berakhir');
      else if (error?.message.includes('Signaling connection error'))
        setModal('Anda Tidak Memiliki Koneksi Internet');
      else if (error?.message.includes('duplicate identity')) setModal('');
      else setModal(error?.message);
    }
  };

  useEffect(() => {
    if (appointmentId) setAppointment(appointmentId);
  }, []);

  useEffect(() => {
    connectRoom(video.provider?.config);

    const socketInRoom = socketInRoomMA(appointmentId);
    socketInRoom.connect();

    socketInRoom.on('ROOM_INFO', room => {
      setMessage(room?.message);
      if (room?.type?.includes('USER_CONNECTED')) setShouldReinit(false);
      if (room?.type?.includes('USER_DISCONNECTED')) setShouldReinit(true);
    });

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

  return { message, modal, setModal };
};

export default Services;
