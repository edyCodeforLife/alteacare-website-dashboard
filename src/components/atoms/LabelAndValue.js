import { React } from '../../libraries'

const LabelAndValue = ({ label, value, fontSize }) => {
  return (
    <div className={`flex flex-wrap items-start ${fontSize} mb-2`} style={{ color: "#8F90A6" }}>
      <div className="w-2/6 flex">
        {label} <span className="ml-auto">:</span>
      </div>
      <div className="w-4/6 px-3">{value}</div>
    </div>
  )
}

LabelAndValue.defaultProps = {
  label: "",
  value: "",
  fontSize: "text-sm"
}

export default LabelAndValue