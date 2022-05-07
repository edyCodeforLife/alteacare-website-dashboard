import { React } from '../../libraries'
import { connect } from 'react-redux'
import { TriggerUpdate } from '../../modules/actions'
import { TonyStark } from '../../assets/images'

const Chat = ({ TriggerUpdate }) => {
  const handleClick = () => {
    TriggerUpdate({
      detailChate: true
    })
  }

  return(
    <div className="w-full py-3 flex flex-wrap lg:items-center items-start cursor-pointer hover:bg-gray-200 lg:px-4 px-2 lg:mt-2 pb-5" onClick={handleClick}>
      <div className="lg:w-2/12 w-1/12 lg:pr-4 pr-2">
        <img src={TonyStark} alt="Profile Rounded" className="w-full" />
      </div>
      <div className="w-10/12 text-sm">
        <p className="flex xl:flex-nowrap flex-wrap justify-between pb-1">
          <p className="font-bold xl:w-auto w-full xl:text-base text-sm">Aldi Rostiawan</p>  
          <p className="xl:w-auto w-full xl:text-base text-sm" style={{ color: "#8F90A6" }}>Ticket - 66870080</p>  
        </p>  
        <p className="text-xs" style={{ color: "#8F90A6" }}>Halo Medical Advisor Mau tanya dong</p>
        <div className="border border-solid mt-2" style={{ borderColor: "#DDE5E9", height: "1px" }}></div>
      </div> 
    </div>
  )
}

const mapDispatchToProps = {
  TriggerUpdate
}

export default connect(null, mapDispatchToProps)(Chat)