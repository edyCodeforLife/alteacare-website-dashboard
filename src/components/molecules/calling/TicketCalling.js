/* eslint-disable react-hooks/exhaustive-deps */
import { AlertMessagePanel, ModalWindow } from '../modal';
import { TicketCalling as Ticket } from '../../atoms';
import { NotFoundCall } from '../../molecules';
import { Api } from '../../../helpers/api';
import { LocalStorage } from '../../../helpers/localStorage';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import EventEmitter from '../../../helpers/utils/eventEmitter';
import {
  React,
  useState,
  useEffect,
  useRef,
  useHistory,
} from '../../../libraries';

const TicketCalling = () => {
  const { profile, connectedState } = useShallowEqualSelector(
    state => state.socketCallMA
  );
  const WrapTicketCall = useRef(null);
  const [error, setError] = useState(null);
  const [answered, setAnswered] = useState(null);
  const [listTicket, setListTicket] = useState([]);
  const [latestTicketCall, setLatestTicketCall] = useState(null);
  const [latestTicketMissCall, setLatestTicketMissCall] = useState(null);
  const [modalWindowData, setModalWindowData] = useState({
    visibility: false,
    text: '',
    isButtonRefreshPage: false,
  });

  useEffect(() => {
    const callMAAlreadyAnsweredListener = data => {
      if (
        String(data?.ma_user_id) === String(profile?.user_id) &&
        String(data?.socket_id) === String(profile?.socket_id)
      ) {
        setAnswered(data.appointment_id);
      }

      if (listTicket.length > 0) {
        const tickets = listTicket.filter(item => {
          return item.appointmentId !== data.appointment_id;
        });
        setListTicket(tickets);
      } else {
        setListTicket([]);
      }
    };

    const callMAMissedListener = data => {
      if (data) setLatestTicketMissCall(data);
    };

    const callMAListener = data => {
      if (data) setLatestTicketCall(data);
    };

    EventEmitter.subscribe(
      'CALL_MA_ALREADY_ANSWERED',
      callMAAlreadyAnsweredListener
    );
    EventEmitter.subscribe('CALL_MA_MISSED', callMAMissedListener);
    EventEmitter.subscribe('CALL_MA', callMAListener);

    return () => {
      EventEmitter.unsubscribe(
        'CALL_MA_ALREADY_ANSWERED',
        callMAAlreadyAnsweredListener
      );
      EventEmitter.unsubscribe('CALL_MA_MISSED', callMAMissedListener);
      EventEmitter.unsubscribe('CALL_MA', callMAListener);
    };
  }, [profile, listTicket]);

  useEffect(() => {
    Api.get('appointment/call', {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      params: { status: 'CALL_MA_ACTIVE' },
    }).then(calls => {
      calls.data.data.forEach(item => {
        setListTicket(listTicket => [
          ...listTicket,
          { appointmentId: item.appointment_id },
        ]);
      });
    });
  }, []);

  useEffect(() => {
    if (listTicket.length > 0 && latestTicketCall) {
      const exist = listTicket.find(item => {
        return item.appointmentId === latestTicketCall.appointment_id;
      });
      if (!exist) {
        setListTicket([
          ...listTicket,
          { appointmentId: latestTicketCall.appointment_id },
        ]);
      }
    }

    if (listTicket.length < 1 && latestTicketCall) {
      setListTicket([
        ...listTicket,
        { appointmentId: latestTicketCall.appointment_id },
      ]);
    }
  }, [latestTicketCall]);

  useEffect(() => {
    if (listTicket.length > 0 && latestTicketMissCall) {
      const data = listTicket.filter(
        listTicket =>
          listTicket.appointmentId !== latestTicketMissCall.appointment_id
      );
      setListTicket(data);
    }

    if (listTicket.length < 1 && latestTicketMissCall) {
      setListTicket([]);
    }
  }, [latestTicketMissCall]);

  const closeModalWindow = () => {
    setModalWindowData({
      visibility: false,
      text: '',
      isButtonRefreshPage: false,
    });
  };

  if (connectedState !== 'CONNECTED') {
    return <div />;
  }

  return (
    <div className="relative" ref={WrapTicketCall}>
      {error && (
        <AlertMessagePanel
          counter={() => setError(null)}
          type="failed"
          text={error.message}
        />
      )}
      {modalWindowData.visibility && (
        <ModalWindow
          text={modalWindowData.text}
          counterClose={() => closeModalWindow()}
          isButtonRefreshPage={modalWindowData.isButtonRefreshPage}
        />
      )}
      {listTicket.length > 0 ? (
        <>
          {listTicket.map((res, idx) => {
            return (
              <div key={idx}>
                <TicketComponent
                  counterSetError={value => setError({ message: value })}
                  key={idx}
                  appointmentId={res.appointmentId}
                  answer={answered}
                />
              </div>
            );
          })}
        </>
      ) : (
        <NotFoundCall />
      )}
    </div>
  );
};

const TicketComponent = ({ appointmentId, counterSetError, answer }) => {
  const history = useHistory();
  const [dataDetail, setDataDetail] = useState(null);

  useEffect(() => {
    if (answer) {
      try {
        const objCalling = {
          name: 'CALL_MA',
          appointmentId: answer,
        };

        const strCalling = JSON.stringify(objCalling);
        const encodedCalling = Buffer.from(strCalling).toString('base64');
        history.push(`/call/${encodedCalling}`);
      } catch (error) {
        counterSetError(error);
      }
    }
  }, [answer]);

  useEffect(() => {
    if (appointmentId) {
      const getCaller = async () => {
        try {
          const callerUrl = `/appointment/v1/consultation/${appointmentId}`;
          const token = LocalStorage('access_token');
          const options = { headers: { Authorization: `Bearer ${token}` } };
          const caller = await Api.get(callerUrl, options);

          setDataDetail(caller.data.data);
        } catch (error) {
          counterSetError(error);
        }
      };

      getCaller();
    }
  }, [appointmentId]);

  const answerCall = appointmentId => {
    EventEmitter.emit('ANSWERED_CALL', {
      appointmentId,
    });
  };

  return (
    <>
      {dataDetail !== null && (
        <Ticket
          appointmentId={dataDetail.id}
          orderCode={dataDetail.order_code}
          status={dataDetail.refference_appointment_id}
          name={dataDetail.user.name}
          avatar={dataDetail.user.avatar}
          counter={appointmentId => answerCall(appointmentId)}
        />
      )}
    </>
  );
};

export default TicketCalling;
