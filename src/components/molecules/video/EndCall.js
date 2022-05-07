/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Prompt, useHistory } from 'react-router-dom';

import { ModalDefault } from '../../molecules/modal';
import { LocalStorage } from '../../../helpers/localStorage';
import AppointmentDetail from '../../../hooks/appointment/AppointmentDetail';
import {
  CleanParamsAppointment,
  UserDataSelected,
  RoomData,
} from '../../../modules/actions';
import { PatientSelectAction } from '../../../modules/actions/user/userData__Action';

const EndCall = props => {
  const {
    RoomReducer,
    endedHandler,
    UserDataSelected,
    PatientSelectAction,
    CleanParamsAppointment,
    finishAppointment = null,
    endCallFromSpecialist = false,
  } = props;

  const history = useHistory();
  const [isBlocking, setIsBlocking] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const { getAppointmentDetailFinish } = AppointmentDetail();

  const finishAppointmentExecute = async () => {
    await getAppointmentDetailFinish(finishAppointment?.appointmentId);
  };

  const leaveRoom = async () => {
    const room = RoomReducer?.room;
    const channel = RoomReducer?.channel;

    if (room?.localParticipant) {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      room.disconnect();
    }

    channel?.leave();
    UserDataSelected(null);
    CleanParamsAppointment();
    PatientSelectAction(null);
    RoomData({ reset: true });

    if (finishAppointment?.isSpesialist && finishAppointment?.appointmentId) {
      finishAppointmentExecute();
    }
    setIsBlocking(false);
    endedHandler(true);

    if (!finishAppointment?.isSpesialist) {
      window.location.replace(
        `/${
          LocalStorage('role') === 'PRO' || LocalStorage('role') === 'DOCTOR'
            ? 'appointment'
            : ''
        }`
      );
    }
  };

  const modalHandler = agreeCondition => {
    if (agreeCondition) {
      leaveRoom();
    } else {
      setModalShow(false);
      endedHandler(false);
    }
  };

  useEffect(() => {
    if (endCallFromSpecialist) leaveRoom();
  }, [endCallFromSpecialist]);

  useEffect(
    () => () => {
      setIsBlocking(true);
      setModalShow(false);

      if (LocalStorage('role') === 'MA') {
        if (window.confirm('Apakah Anda yakin ingin mengakhiri panggilan?'))
          leaveRoom();
        else history.goBack();
      }
    },
    []
  );

  return (
    <>
      {modalShow && (
        <ModalDefault
          text="Apakah Anda yakin ingin mengakhiri panggilan?"
          buttonText="Batal"
          buttontextwhite="Yakin"
          counter={value => modalHandler(value)}
        />
      )}
      {LocalStorage('role') === 'DOCTOR' && (
        <Prompt
          when={isBlocking}
          message={() => {
            setModalShow(true);
            return false;
          }}
        />
      )}
      <div className="w-1/3 text-right text-white">
        <button
          className="rounded py-1 px-4 text-white text-sm"
          style={{ backgroundColor: '#EB5757' }}
          onClick={() => setModalShow(true)}
        >
          Akhiri Panggilan
        </button>
      </div>
    </>
  );
};

EndCall.defaultProps = {
  endedHandler: () => {},
};

const reducer = state => ({
  RoomReducer: state.RoomReducer.data,
});

const props = {
  RoomData,
  UserDataSelected,
  PatientSelectAction,
  CleanParamsAppointment,
};

export default connect(reducer, props)(EndCall);
