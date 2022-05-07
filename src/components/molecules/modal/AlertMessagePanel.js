import { React, useEffect } from '../../../libraries'
import { SuccessBgWhite, ErrorIcon, AlertCloseWhite } from '../../../assets/images'

const AlertMessagePanel = ({ counter, text, direction, type }) => {

  useEffect(() => {
    if(counter !== ""){
      let timerFunc = setTimeout(() => {
        counter(null);
      }, 5000);

      return () => clearTimeout(timerFunc);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCloseAlert = () => {
    counter(null)
  }

  return(
    <div className={`w-full absolute z-10 ${direction !== "bottom" ? "top-0" : "bottom-0"} inset-x-0 ${type !== "failed" ? "bg-successState" : "bg-error3"} text-white px-5 py-3 flex items-center text-sm`}>
      <img src={type !== "failed" ? SuccessBgWhite : ErrorIcon} className="inline mr-4" alt="close" /> {`${text}`}
      {/* {type === "failed" ? */}
        <img src={AlertCloseWhite} alt="" onClick={handleCloseAlert} className="absolute right-0 inset-y-0 mr-3 mt-4 cursor-pointer" />
      {/* : ""} */}
    </div>
  )
}

AlertMessagePanel.defaultProps = {
  counter: "",
  text: "",
  direction: "",
  type: ""
}

export default AlertMessagePanel
