import { React } from '../../libraries';
import { UnCallingWhite, ArrowRight } from '../../assets/images';
import moment from 'moment';
import timezone from 'moment-timezone';

const MissedCall = props => {
  const { appointmentActive, payload, counter } = props;

  const handleClick = async params => {
    counter(params.id);
  };

  return (
    <div
      className="w-full py-2 border-b border-solid hover:bg-gray-200 cursor-pointer"
      onClick={() => handleClick(payload)}
      style={{
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor:
          payload.appointment_id === appointmentActive?.id
            ? 'rgba(229, 231, 235, 1)'
            : '',
      }}
    >
      <div className="rounded xl:pb-1">
        <p className="text-xs xl:px-4 px-2 py-2 flex items-center justify-start">
          <span style={{ color: '#6B7588' }}>
            Ticket - {payload.order_code}
          </span>
          <span
            className="h-5 px-2 rounded-lg text-white ml-5 flex items-center"
            style={{
              backgroundColor: payload?.status_detail?.bg_color,
              color: payload?.status_detail?.text_color,
            }}
          >
            {payload?.status_detail?.label}
          </span>
        </p>
        <div
          className="w-full flex flex-wrap items-center xl:px-4 px-2 pt-1"
          style={{ color: '#6B7588' }}
        >
          <div className="xl:w-4/12 w-full">
            <p
              className="text-left text-xs font-bold"
              style={{ color: '#6B7588' }}
            >
              {payload.user.name}
            </p>
          </div>
          <div className="xl:w-3/12 w-4/12">
            <p className="text-left text-xs">
              {moment(payload.call_at).format('DD/MM/YYYY')}
            </p>
          </div>
          <div className="xl:w-1/12 w-3/12">
            <p className="text-left text-xs">
              {timezone(payload.call_at).tz('Asia/Jakarta').format('HH:mm')}
            </p>
          </div>
          <div className="xl:w-4/12 w-5/12 flex items-center justify-end">
            <div
              className="rounded-full px-4 h-5 text-white text-xs flex items-center"
              style={{ backgroundColor: '#FF5C5C' }}
            >
              <img
                src={UnCallingWhite}
                alt="Un Calling White"
                className="inline mr-1 w-3"
              />{' '}
              lihat
            </div>
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className="inline ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissedCall;
