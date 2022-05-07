import { React, useEffect, useState } from '../../../libraries';
import moment from 'moment';
import { connect, useDispatch } from 'react-redux';

import { Api } from '../../../helpers/api';
import { LocalStorage } from '../../../helpers/localStorage';

import { MissedCall } from '../../atoms';
import { NotFoundCall } from '../../molecules';

import { PatientSelectAction } from '../../../modules/actions/user/userData__Action';
import {
  TriggerUpdate,
  CreateParamsAppointment,
  CleanParamsAppointment,
  UserDataSelected,
  UserDataSelectedId,
} from '../../../modules/actions';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import Loader from '../loader/Loader';
import EventEmitter from '../../../helpers/utils/eventEmitter';
import { showModal } from '../../../modules/actions/modal';

const MissedCallList = ({
  TriggerUpdate,
  CreateParamsAppointment,
  CleanParamsAppointment,
  PatientSelectAction,
  UserDataSelected,
  UserDataSelectedId,
}) => {
  const { totalCall, connectedState } = useShallowEqualSelector(
    state => state.socketCallMA
  );
  const [total, setTotal] = useState(null);
  const [appointmentActive, setAppointmentActive] = useState(null);
  const [listTicket, setListTicket] = useState([]);
  const [missedCallParams, setMissedCallParams] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTotal(null);
    setAppointmentActive(null);
    setMissedCallParams({
      isRefresh: true,
      status: 'CALL_MA_MISSED',
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMissedCallParams(null);
    setTimeout(() => {
      setMissedCallParams({
        isRefresh: true,
        status: 'CALL_MA_MISSED',
        page: 1,
      });
    }, 100);
  }, [totalCall]);

  useEffect(() => {
    if (!missedCallParams) {
      return;
    }

    setIsLoading(true);
    Api.get('appointment/call', {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      params: {
        status: missedCallParams.status,
        page: missedCallParams.page,
      },
    }).then(response => {
      setIsLoading(false);
      setTotal(response.data.meta.total);
      setListTicket(listTicket => {
        if (missedCallParams.isRefresh) {
          return response?.data?.data || [];
        }

        return [...listTicket, ...[response?.data?.data || []]];
      });
    });
  }, [missedCallParams]);

  useEffect(() => {
    const callMAListener = data => {
      if (String(data.appointment_id) === String(appointmentActive?.id)) {
        CleanParamsAppointment();
        UserDataSelectedId(null);
        TriggerUpdate({ resetCenterContainer: true });
        dispatch(
          showModal({
            message: `Pasien "${appointmentActive.patient.name}" dengan Order ID: "${appointmentActive.order_code}", saat ini melakukan panggilan ulang. Silahkan cek tab Panggilan.`,
            actionButtonText: 'Ke tab Panggilan',
            actionButton: () => {
              TriggerUpdate({
                showActiveCallTab: true,
              });
            },
          })
        );
        setAppointmentActive(null);
      }
    };

    EventEmitter.subscribe('CALL_MA', callMAListener);

    return () => {
      EventEmitter.unsubscribe('CALL_MA', callMAListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentActive, listTicket]);

  const selectMissedCall = async value => {
    CleanParamsAppointment();
    UserDataSelectedId(null);
    const appointmentDetail = await getAppointmentDetail(value);
    if (appointmentDetail) {
      const userDetail = await getSelectedUser(
        appointmentDetail.parent_user.id
      );
      const medicalDocument = [];
      UserDataSelected(userDetail);
      PatientSelectAction(appointmentDetail?.patient || null);
      UserDataSelectedId({ appointmentId: appointmentDetail.id });
      if (
        appointmentDetail.medical_document &&
        appointmentDetail.medical_document.length > 0
      ) {
        appointmentDetail.medical_document.forEach((doc, idx) => {
          medicalDocument.push(doc.file_id);
        });
      }

      CreateParamsAppointment({
        appointment_id: appointmentDetail.id,
        doctor_id: appointmentDetail.doctor.id,
        user_id: appointmentDetail.user_id,
        patient_id: appointmentDetail.patient_id,
        symptom_note: appointmentDetail.symptom_note || '',
        schedules: [
          {
            code: appointmentDetail.schedule.code,
            date: appointmentDetail.schedule.date,
            time_start: moment(
              appointmentDetail.schedule.time_start,
              'HH:mm:ss'
            ).format('HH:mm'),
            time_end: moment(
              appointmentDetail.schedule.time_end,
              'HH:mm:ss'
            ).format('HH:mm'),
          },
        ],
        document_resume: medicalDocument,
      });

      TriggerUpdate({ missedCallDetail: true });
    }
    setAppointmentActive(appointmentDetail);
  };

  const paggination = () => {
    setMissedCallParams({
      ...missedCallParams,
      page: missedCallParams.page + 1,
    });
  };

  const getAppointmentDetail = appointmentId => {
    return Api.get(`/appointment/v1/consultation/${appointmentId}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(res => {
        return res.data.data;
      })
      .catch(() => {
        return null;
      });
  };

  const getSelectedUser = userId => {
    return Api.get(`/user/users/${userId}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(res => {
        return res.data.data;
      })
      .catch(error => {
        return null;
      });
  };

  if (connectedState !== 'CONNECTED') {
    return <div />;
  }

  if (listTicket.length > 0) {
    return (
      <>
        {isLoading && <Loader />}
        {listTicket.map((item, index) => {
          return (
            <MissedCall
              key={index}
              payload={item}
              appointmentActive={appointmentActive}
              counter={value => selectMissedCall(value)}
            />
          );
        })}
        {total && listTicket.length < total && (
          <div className="py-3 flex justify-center">
            <button
              onClick={() => paggination()}
              className="mx-auto text-mainColor text-sm"
            >
              Tampilkan Lebih
            </button>
          </div>
        )}
        <div className="pb-5"></div>
      </>
    );
  }

  return <NotFoundCall />;
};

const mapDispatchToProps = {
  TriggerUpdate,
  PatientSelectAction,
  CleanParamsAppointment,
  CreateParamsAppointment,
  UserDataSelected,
  UserDataSelectedId,
};

export default connect(null, mapDispatchToProps)(MissedCallList);
