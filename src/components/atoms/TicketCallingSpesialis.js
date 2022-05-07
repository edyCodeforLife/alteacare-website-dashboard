import { React, Link } from '../../libraries'
import { VideoOnWhite, CalenderIcon, ClockIcon } from '../../assets/images'

const TicketCallingSpesialis = ({ data, status }) => {
  return (
    <div className="w-full pt-2 xl:px-6 px-3 mb-2">
      <div className="rounded pb-1 shadow">
        <p className="px-4 py-1 border-b border-solid flex items-center justify-between text-dark3" style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}>
          <span>Order ID - 66870080</span>
          {/* <span className="py-1 px-2 rounded-lg" style={{ backgroundColor: `${data.status === "Konsultasi Baru" ? "#2C528B" : "#3E8CB9"}` }}>{data.status}</span> */}
        </p>
        <div className="w-full flex flex-wrap items-center px-4 py-1">
          <div className="xl:w-8/12 w-8/12 flex flex-wrap items-center">
            <p className="text-left py-1 text-dark3 font-bold">{data.name}</p>
            <div className="w-full py-1 text-sm" style={{ color: "#6B7588" }}>
              <img src={CalenderIcon} alt="Calender Icon" className="inline mr-2" />Selasa, 28 Des 2020
            </div>
            <div className="w-full py-1 text-sm" style={{ color: "#6B7588" }}>
              <img src={ClockIcon} alt="Calender Icon" className="inline mr-2" />09.45 - 10.00
            </div>
          </div>
          {status === "on-going" ?
            <button
              to="/call"
              className="xl:w-4/12 w-4/12 xl:text-sm text-xxs rounded-full py-2 flex justify-center items-center border border-solid border-mainColor text-mainColor"
            >
              Lihat Detail
            </button> :
            <Link to="/call" className="xl:w-4/12 w-4/12 xl:text-sm text-xxs text-white rounded-full py-2 flex justify-center items-center bg-success3">
              <img src={VideoOnWhite} alt="Video On White Icon" className="inline mr-2 w-3" />Open
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

TicketCallingSpesialis.defaultProps = {
  status: ""
}

export default TicketCallingSpesialis
