import { React, useState, useEffect } from '../../libraries';
import { VideoOnWhite } from '../../assets/images';
import Loader from '../molecules/loader/Loader';

const TicketCalling = ({
  counter,
  appointmentId,
  orderCode,
  status,
  name,
  avatar,
}) => {
  const [initial, setInitial] = useState('');
  const [background, setBackground] = useState('');
  const [answered, setAnswered] = useState(false);
  const handleAnswer = () => {
    if (answered) {
      return;
    }

    counter(appointmentId);
    setAnswered(true);
    setTimeout(() => {
      setAnswered(false);
    }, 4000);
  };

  useEffect(() => {
    if (!avatar) {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      const identity = name.split(' ');
      const initialDefault = [];
      identity.forEach((item, i) => {
        initialDefault.push(item.charAt(0));
      });
      const initialName = initialDefault.join('');
      setInitial(initialName.toUpperCase().substring(0, 3));
      setBackground(`#${randomColor}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full pt-2 xl:px-8 px-2">
      <div className="rounded pb-1 bg-dark1">
        <p
          className="text-white xl:text-xs text-xxs px-3 py-1 border-b border-solid flex items-center justify-between"
          style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <span>Ticket - {orderCode}</span>
          {status === null ? (
            <span className="py-1 px-2 rounded-lg bg-info2 text-white">
              Konsultasi Baru
            </span>
          ) : (
            <span className="py-1 px-2 rounded-lg bg-darker text-white">
              Konsultasi Lanjutan
            </span>
          )}
        </p>
        <div className="w-full flex flex-wrap items-center px-3 py-1">
          <div className="xl:w-7/12 w-8/12 flex flex-row items-center">
            {avatar ? (
              <img
                src={avatar.formats.thumbnail}
                alt="Profile Ticket Calling"
                className="inline w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <div
                className="w-8 h-8 flex items-center rounded-full text-white"
                style={{ backgroundColor: background }}
              >
                <span className="text-xs m-auto font-bold">{initial}</span>
              </div>
            )}
            <p className="flex-1 text-left text-xs text-white px-2 truncate">
              {name}
            </p>
          </div>
          {!answered && (
            <button
              onClick={handleAnswer}
              className="xl:w-5/12 w-4/12 xl:text-sm text-xxs text-white rounded-full py-2 flex justify-center items-center bg-success3"
            >
              <img
                src={VideoOnWhite}
                alt="Video On White Icon"
                className="inline mr-2 w-3"
              />
              Terima
            </button>
          )}
          {answered && (
            <span className="xl:w-5/12 w-4/12">
              <Loader
                py="py-2"
                text="Tunggu Sebentar"
                textColor="text-white"
                loadingColor="text-white"
                textSize="xl:text-xs text-xxs"
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCalling;
