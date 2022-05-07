import { React } from '../../libraries'

const ButtonDefault = ({ text, className, color, backgroundColor, borderColor, value, counter }) => {
  const handleCounter = (value) => {
    counter(value)
  }

  return(
    <button 
      className={`${className}`} 
      style={{ color: color, backgroundColor: backgroundColor, borderColor: borderColor }}
      onClick={counter !== "" ? () => handleCounter(value) : () => {}}>{text}</button>
  )
}

ButtonDefault.defaultProps = {
  text: "",
  className: "",
  color: "",
  backgroundColor: "",
  borderColor: "",
  value: "",
  counter: ""
}

export default ButtonDefault