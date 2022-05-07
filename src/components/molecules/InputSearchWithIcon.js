import { React } from '../../libraries'
import { MagnifierIcon } from '../../assets/images'

const InputSearchWithIcon = ({ counter, placeholder, value }) => {
  const handleChange = (event) => {
    counter(event.target.value)
  }

  return (
    <div className="relative w-full">
      <button className="absolute z-10 left-0 inset-y-0 ml-4 focus:outline-none">
        <img src={MagnifierIcon} alt="Magnifier Icon" className="w-4" />
      </button>
      {value !== "" ?
        <input
          autoComplete="off"
          type="text"
          name="search"
          value={value}
          className="w-full py-1 pl-10 pr-3 rounded-full focus:outline-none"
          onChange={handleChange} placeholder={placeholder} style={{ backgroundColor: "#F2F2F5" }} />
      :
        <input
          type="text"
          name="search"
          className="w-full py-1 pl-10 pr-3 rounded-full focus:outline-none"
          onChange={handleChange} placeholder={placeholder} style={{ backgroundColor: "#F2F2F5" }} />
      }
    </div>
  )
}

InputSearchWithIcon.defaultProps = {
  placeholder: "",
  counter: ""
}

export default InputSearchWithIcon
