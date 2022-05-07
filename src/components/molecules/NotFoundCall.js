import { React } from '../../libraries'
import { VideoOnLg } from '../../assets/images'

const NotFoundCall = ({ imgStyle, textStyle, text }) => {
  return (
    <div className="w-full py-10">
      <img src={VideoOnLg} alt="Video On Large" className={`${imgStyle}`} />
      <p className={`${textStyle}`}>{`${text}`}</p>
    </div>
  )
}

NotFoundCall.defaultProps = {
  imgStyle: "mx-auto w-10",
  textStyle: "text-center mt-3 text-sm text-dark4",
  text: "Tidak ada panggilan disini"
}

export default NotFoundCall