import { React } from '../../libraries'
import { LoadingButtonGif } from '../../assets/images'

const ButtonDarkGrey = ({ counter, text, dimension, backgroundColor, value, disabled, isLoading, style }) => {

  const handleClick = (value) => {
    counter(value)
  }

  return (
    <button
      className={`rounded py-1 px-3 text-white text-sm flex items-start justify-center ${dimension} ${backgroundColor}`}
      disabled={disabled}
      onClick={counter !== "" ? () => handleClick(value) : () => {}}
      style={style ? style : {}}
    >
        {
          isLoading
            ? <img src={LoadingButtonGif} alt="loading gif" className="inline mr-2 w-5" />
            : ''
        }
        {text}
      </button>
  )
}

ButtonDarkGrey.defaultProps = {
  text: "",
  dimension: "",
  backgroundColor: "bg-mainColor",
  counter: "",
  value: "",
  disabled: false,
  isLoading: false,
  style: null,
}

export default ButtonDarkGrey
