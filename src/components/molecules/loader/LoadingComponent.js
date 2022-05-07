import { React } from '../../../libraries'
import { LoadingIcon } from '../../../assets/images' 

const LoadingComponent = ({ className }) => {
  return (
    <div className={`w-full h-full flex flex-wrap items-center justify-center ${className}`}>
      <img src={LoadingIcon} alt="Loading Icon" className="w-20" />
    </div>
  )
}

LoadingComponent.defaultProps = {
  className: ""
}

export default LoadingComponent