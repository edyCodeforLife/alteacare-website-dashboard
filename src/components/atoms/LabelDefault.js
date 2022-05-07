import { React } from '../../libraries'

const LabelDefault = ({ text, className, styleComponent }) => {
  return (
    <label className={className} style={ styleComponent }>{text}</label>
  )
}

LabelDefault.defaultProps ={
  text: "", 
  className: "",
  styleComponent: {}
}

export default LabelDefault