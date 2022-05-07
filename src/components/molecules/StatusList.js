import { React } from '../../libraries'
import { StatusWithIcon, LabelTitle } from '../atoms'

const StatusList = ({ data }) => {
  return (
    <div className="w-full text-sm pb-5 mb-5">
      <LabelTitle text="Status" fontStyle="font-bold" />
      <div className="px-5 py-4">
        {data.length > 0 ?
          data.map((row, index) => {
            return(
              <StatusWithIcon
                key={index}
                date={row.created}
                // time={row.time}
                status={row.status}
                icon={row.icon}
                text={row.label}
                desc={row.description}
                lastData={(index+1 === data.length)}
              />
            )
          })
        : ""}
      </div>
    </div>
  )
}

export default StatusList
