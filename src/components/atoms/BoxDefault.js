import { React } from '../../libraries'

const BoxDefault = ({ text, className, borderColor, backgroundColor, color }) => {
  return(
    <div className={`${className}`} style={{ borderColor: borderColor, backgroundColor: backgroundColor, color: color }}>{text}</div>
  )
}

BoxDefault.defaultProps = {
  borderColor: "",
  text: "",
  className: "",
  backgroundColor: "",
  color: ""
}

export default BoxDefault