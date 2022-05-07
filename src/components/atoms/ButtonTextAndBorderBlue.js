import { React } from '../../libraries'

const ButtonTextAndBorderBlue = ({ counter, text, fontSize, dimesion, position, value, selected }) => {
  const handleClick = (value) => {
    counter(value)
  }

  return (
    <button
      onClick={counter !== "" ? () => handleClick(value) : () => {}}
      className={`border border-solid rounded border-darker text-darker ${selected ? "bg-subtle" : ""} ${dimesion} ${fontSize} ${position === "left" ? "mr-auto" : ""} ${position === "right" ? "ml-auto" : ""} ${position === "center" ? "mx-auto" : ""}`}
    >{text}</button>
  )
}

ButtonTextAndBorderBlue.defaultProps = {
  counter: "",
  text: "",
  fontSize: "text-sm",
  dimesion: "",
  position: "ml-auto",
  value: "",
  selected: false
}

export default ButtonTextAndBorderBlue