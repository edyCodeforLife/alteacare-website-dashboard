import { React } from '../../../libraries'
import { LoadingIcon } from '../../../assets/images' 

const Loading = () => {
  return (
    <div className="w-full h-full fixed flex flex-wrap items-center justify-center">
      <img src={LoadingIcon} alt="Loading Icon" className="xl:w-1/12 lg:w-2/12 md:3/12 w-4/12" />
    </div>
  )
}

export default Loading