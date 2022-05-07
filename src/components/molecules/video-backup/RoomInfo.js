import { useState } from '../../../libraries';
import { connect } from 'react-redux';
import { ModalDefault } from '../../molecules/modal';
import { InfoCallButton} from '../../../assets/images';
import { DetailCallSection } from '../../molecules/appointmentSpecialist';

const RoomInfo = ({ RoomReducer, isSpesialist = false, Load, data = null }) => {
  const [textMessage, setTextMessage] = useState("")
  const [modalDetailAppointment, setModalDetailAppointment] = useState(false);
  const [dataDetailCallSection, setDataDetailCallSection] = useState(null);

  const showInfo = () => {
    if (Load) setTextMessage(`${RoomReducer.roomCode}`)
    else setTextMessage(`Sabar Kawan Aku Lagi Menyambungkan Dulu`);
  }

  const showInfoDetailAppointment = () => {
    setDataDetailCallSection({
      userId: data ? data.userId : null, 
      orderCode: null, 
      appointmentId: data ? data.appointmentId : null
    })
    setModalDetailAppointment(true)
  }

  const handleCounterModalDefault = () => {
    setTextMessage('')
  }

  const DetailCallSectionData = (data) => {
    if (data && data.backSectionDetailCall) {
      setModalDetailAppointment(false);
      setDataDetailCallSection(null)
    }
  }

  return (
    <div className="text-left text-white cursor-pointer active:bg-transparent">
      <img src={InfoCallButton} alt="Info Call Button Icon" className="w-5" onClick={() => !isSpesialist ? showInfo() : showInfoDetailAppointment()} />
      {!isSpesialist && textMessage !== "" ?
        <ModalDefault text={textMessage} counter={() => handleCounterModalDefault()} buttonText="Tutup" />
      : ""}
      {isSpesialist && modalDetailAppointment ? 
        <div className="fixed left-0 top-0 w-full h-full z-40">
          <div className="w-2/3 absolute left-0 top-0 mt-20 ml-5 z-10 bg-white">
            <DetailCallSection
              data={dataDetailCallSection}
              sectionFirstHeight={500}
              counter={(value) => DetailCallSectionData(value)} />
          </div>
        </div>
      : ""}
    </div>
  );
};

const mapStateToProps = (state) => ({
  RoomReducer: state.RoomReducer.data,
});

export default connect(mapStateToProps, null)(RoomInfo);
