import { React } from '../../libraries'
import { ArrowRight } from '../../assets/images'
import moment from 'moment';

const Appointment = ({ counter, name, date, time, value, active }) => {

  const handleClick = (value) => {
    counter(value)
  }

  return (
    <div className="w-full flex flex-wrap text-xs bg-white py-2 cursor-pointer hover:bg-light3"
      onClick={() => handleClick(value)} style={{ backgroundColor: active ? 'rgba(229, 231, 235, 1)' : '' }}>
      <div className="w-6/12 px-5 truncate">{ name }</div>
      <div className="w-3/12">{ date ? moment(date).format('DD/MM/YYYY') : 'Schedule Tidak Ditemukan' }</div>
      <div className="w-2/12 text-center">{ moment(`${time}`, 'HH:mm').format("HH:mm") }</div>
      <div className="w-1/12 flex">
        <img src={ArrowRight} alt="Arrow Right Icon" className="m-auto" />
      </div>
    </div>
  )
}

export default Appointment
