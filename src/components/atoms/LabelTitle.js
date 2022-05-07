import { React, useState, useEffect } from '../../libraries'
import { ChevronLeft } from '../../assets/images'

const LabelTitle = ({ 
  text, 
  label, 
  dimension, 
  fontStyle, 
  status, 
  buttonBack, 
  labelType, 
  styleComponentLabel, 
  redButton,
  counterRedButton 
}) => {
  const handleButtonBack = () => {
    buttonBack()
  }

  const [labelStyle, setLabelStyle] = useState('')

  useEffect(() => {
    if(labelType === "cancel" || labelType === "expire"){
      setLabelStyle('bg-error4 text-white')
    } else {
      setLabelStyle('bg-dark2 text-white')
    }
  }, [labelType])

  return (
    <div className={`w-full ${dimension} xl:text-sm text-xs flex items-center bg-light3 text-dark3 ${fontStyle}`} id="element-label">
      <div className="mr-auto flex items-center">
        {buttonBack !== "" ? 
          <img src={ChevronLeft} alt="Chevron Left Icon" className="inline mr-4 cursor-pointer" onClick={handleButtonBack} />
        : ""}
        <span>{text}</span>
      </div>
      <div className="ml-auto flex justify-end">
        {status === "NEW" || status === "PROCESS_GP" || status === "WAITING_FOR_PAYMENT" ?
          (redButton !== "" && counterRedButton !== "" ? 
            <button 
              className="underline mr-4 text-base" 
              onClick={() => counterRedButton(redButton.appointmentId)}
              style={{ color: "#EB5757" }}
            >{redButton.text}</button>
          : "")
        : ""}
        {status === "PAID" || status === "MEET_SPECIALIST" ?
          (redButton !== "" && counterRedButton !== "" ? 
            <button 
              className="underline mr-4 text-base" 
              onClick={() => counterRedButton(redButton.appointmentId)}
              style={{ color: "#EB5757" }}
            >Refund</button>
          : "")
        : ""}
        {label !== "" ? 
          <label 
            style={styleComponentLabel} 
            className={`text-xs px-2 py-1 rounded-sm ${labelStyle}`}
            >{label}</label>
        : ""}
      </div>
    </div>
  )
}

LabelTitle.defaultProps = {
  text: "",
  label: "",
  dimension: "py-2 px-5",
  fontStyle: "",
  status: "default",
  buttonBack: "",
  labelType: "",
  styleComponentLabel: {},
  redButton: "",
  counterRedButton: "",
}

export default LabelTitle