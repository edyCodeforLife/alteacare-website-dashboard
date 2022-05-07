import PropTypes from 'prop-types';
import React from 'react';

import services from './services';
import { ModalWindow } from '../../../../molecules/modal';
import { Notification } from '../../../../molecules/video';
import { LocalStorage } from '../../../../../helpers/localStorage';

const Screen = props => {
  const { message } = props;

  const { modal, state, setModal } = services();

  return (
    <>
      {modal !== '' ? (
        <ModalWindow text={modal} counterClose={() => setModal('')} />
      ) : (
        ''
      )}
      {state.localParticipantConnected === '' ? (
        <Notification text="Sedang menghubungkan..." />
      ) : (
        ''
      )}
      {state.localParticipantConnected === 'CONNECTED' &&
      state.remoteParticipantConnected === '' &&
      LocalStorage('role') !== 'DOCTOR' ? (
        <Notification
          error
          classTextColor="text-error4"
          text={message !== '' ? message : 'Pasien tidak dapat terhubung.'}
        />
      ) : (
        ''
      )}
      {state.localParticipantConnected === 'CONNECTED' &&
      state.remoteParticipantConnected === '' &&
      LocalStorage('role') === 'DOCTOR' ? (
        <Notification info text="Pasien belum bergabung." />
      ) : (
        ''
      )}
      {state.localParticipantConnected === 'CONNECTED' &&
      state.remoteParticipantConnected === 'CONNECTED' ? (
        <Notification
          success
          text={message !== '' ? message : 'Pasien terhubung.'}
        />
      ) : (
        ''
      )}
      {state.localParticipantConnected === 'CONNECTED' &&
      state.remoteParticipantConnected === 'DISCONNECTED' ? (
        <Notification
          success
          text={message !== '' ? message : 'Pasien telah meninggalkan ruangan.'}
        />
      ) : (
        ''
      )}
      {state.localParticipantConnected === 'RECONNECTING' ? (
        <Notification text="Koneksi Anda tidak stabil. Mencoba menghubungkan kembali." />
      ) : (
        ''
      )}
      {state.remoteParticipantConnected === 'RECONNECTING' ? (
        <Notification text="Koneksi pasien tidak stabil. Mencoba menghubungkan kembali." />
      ) : (
        ''
      )}
      {state.remoteParticipantConnected === 'CONNECTED' &&
      state.localParticipantConnected === 'RECONNECTED' ? (
        <Notification info text="Anda telah kembali ke ruangan." />
      ) : (
        ''
      )}
      {state.remoteParticipantConnected === 'RECONNECTED' ? (
        <Notification info text="Pasien telah kembali ke ruangan." />
      ) : (
        ''
      )}
      {state.localParticipantConnected === 'DISCONNECTED' &&
      state.remoteParticipantConnected === 'DISCONNECTED' ? (
        <Notification
          error
          classTextColor="text-error4"
          text="Koneksi dengan pasien terputus, pasien meninggalkan panggilan."
        />
      ) : (
        ''
      )}
    </>
  );
};

Screen.propTypes = {
  message: PropTypes.string,
};

Screen.defaultProps = {
  message: '',
};

export default Screen;
