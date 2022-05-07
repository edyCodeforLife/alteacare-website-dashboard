import { connect } from 'react-redux';

import { DetailCallSection } from '../../molecules/appointmentSpecialist';
import { ModalDefault } from '../../molecules/modal';
import { InfoCallButton } from '../../../assets/images';
import { useState, useEffect } from '../../../libraries';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

const RoomInfo = ({ RoomReducer, isSpesialist = false, data = null }) => {
  const { video } = useShallowEqualSelector(state => state);
  const [textMessage, setTextMessage] = useState('');
  const [modalDetailAppointment, setModalDetailAppointment] = useState(false);
  const [dataDetailCallSection, setDataDetailCallSection] = useState(null);

  const showInfo = () => {
    const name =
      video.provider?.config?.room_code ||
      video.provider?.config?.options?.roomName ||
      '-';
    const room = RoomReducer?.room;
    if (room) setTextMessage(`Your Room: ${name}`);
    else setTextMessage('Sedang Menghubungkan');
  };

  const showInfoDetailAppointment = () => {
    setModalDetailAppointment(true);
    setDataDetailCallSection({
      userId: data?.userId,
      orderCode: null,
      appointmentId: data?.appointmentId,
    });
  };

  const handleCounterModalDefault = () => {
    setTextMessage('');
  };

  const DetailCallSectionData = data => {
    if (data && data.backSectionDetailCall) {
      setModalDetailAppointment(false);
      setDataDetailCallSection(null);
    }
  };

  useEffect(
    () => () => {
      setTextMessage('');
      setDataDetailCallSection(null);
      setModalDetailAppointment(false);
    },
    []
  );

  return (
    <div className="text-left text-white cursor-pointer active:bg-transparent">
      <img
        src={InfoCallButton}
        alt="Info Call Button"
        className="w-5"
        onClick={() => {
          !isSpesialist ? showInfo() : showInfoDetailAppointment();
        }}
      />
      {!isSpesialist && textMessage !== '' && (
        <ModalDefault
          text={textMessage}
          counter={() => handleCounterModalDefault()}
          buttonText="Tutup"
        />
      )}
      {isSpesialist && modalDetailAppointment && (
        <div className="fixed left-0 top-0 w-full h-full z-40">
          <div className="w-2/3 absolute left-0 top-0 mt-20 ml-5 z-10 bg-white">
            <DetailCallSection
              data={dataDetailCallSection}
              sectionFirstHeight={500}
              counter={value => DetailCallSectionData(value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(mapStateToProps, null)(RoomInfo);
