import moment from 'moment'
import timezone from 'moment-timezone';
import { React } from '../../libraries'

const StatusWithIcon = ({ date, time, status, text, desc, lastData, icon }) => {
  return (
    <>
      <div className="flex flex-wrap items-center text-info2">
        <div className="w-1/12">
          <img
            src={icon}
            alt="List Cirle Icon"
            className="w-full"
          />
        </div>
        <div className="w-4/12 px-5">
          <span className="font-bold">
            {`${moment(`${date}`).format('MMM DD, Y')}`}
          </span><br />
          {`${timezone(`${date}`).tz('Asia/Jakarta').format('HH:mm')}`}
        </div>
        <div className="w-7/12">
          <span className="font-bold">{text}</span>
          <br />{desc}
        </div>
      </div>
      {!lastData ?
        <div className="w-full my-1 flex flex-wrap">
          <div className="w-1/12 flex justify-end">
            <div className="w-1/2 h-5 border-l-2 border-solid flex" style={{ borderColor: "#8F90A6" }}></div>
          </div>
          <div className="w-11/12 h-5 flex">
            <div className="my-auto w-full" style={{ height: "1px", backgroundColor: "#EBEBF0" }}></div>
          </div>
        </div>
      : ""}
    </>
  )
}

StatusWithIcon.defaultProps = {
  date: "0000-00-00",
  time: "",
  status: "",
  text: "",
  lastData: ""
}

export default StatusWithIcon
