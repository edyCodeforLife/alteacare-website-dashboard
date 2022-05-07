import { React } from '../../libraries'
import { connect } from 'react-redux'
import { ConsultationLg } from '../../assets/images'
import { LabelTitle, Appointment } from '../atoms'
import { TriggerUpdate } from '../../modules/actions'

const ConfirmedList = ({ TriggerUpdate, data }) => {

  const handleCounter = () => {
    TriggerUpdate({ 
      page: "home",
      trigger: "open-order"
     })
  }

  return (
    <>
      {data.length > 0 ? 
        data.map((row, index) => {
          return(
            <div className="w-full" key={index}>
              <LabelTitle text={row.date} />
              {row.dataList.length > 0 ? 
                row.dataList.map((row2, index2) => {
                  return <Appointment key={index2} name={row2.name} date={row2.date} time={row2.time} counter={() => handleCounter()} />
                }) : (
                  <div className="w-full flex flex-wrap justify-center xl:py-10 py-4">
                    <img src={ConsultationLg} alt="consultation large icon" className="xl:w-auto lg:w-1/4 w-1/6" />
                    <p className="w-full text-center xl:text-sm text-xs xl:mt-5 mt-2" style={{ color: "#C7C9D9" }}>Tidak ada Perjanjian disini</p>
                  </div>
                )
              }
            </div>
          )
        })
      : ""}
    </>
  )
}

const mapDispatchToProps = {
  TriggerUpdate
}

export default connect(null, mapDispatchToProps)(ConfirmedList)