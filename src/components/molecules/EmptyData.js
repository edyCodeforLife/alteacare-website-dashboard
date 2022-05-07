import { React } from '../../libraries'
import { ConsultationLg } from '../../assets/images'

const EmptyData = ({ text, styleWrap }) => {
  return(
    <div className={`w-full flex flex-wrap justify-center items-center ${styleWrap}`}>
      <div>
        <img src={ConsultationLg} alt="consultation large icon" className="mx-auto" />
        <p className="w-full text-center text-sm mt-5 text-dark4">{ text }</p>
      </div>
    </div>
  )
}

EmptyData.defaultProps = {
  text: "",
  styleWrap: "xl:my-0 my-16"
}

export default EmptyData