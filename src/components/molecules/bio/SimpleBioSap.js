import { React } from '../../../libraries'
import moment from 'moment'
// import { Ktp } from '../../../assets/images'

const SimpleBioSap = ({ data, image }) => {

  return (
    <>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Nama <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.name}</div>
      </div>
      {/* <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Umur <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{`${data.user_details.age.year} Tahun ${data.user_details.age.month} Bulan`}</div>
      </div> */}

      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Tanggal Lahir <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{moment(data.birth_date).format("DD/MM/YYYY")}</div>
      </div>
      {/*
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Jenis Kelamin <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.user_details.gender ? data.user_details.gender : "-"}</div>
      </div>
      */}
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          No. Telp <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.phone_number}</div>
      </div>
      {/*
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Email <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.email}</div>
      </div>
      */}
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Nomor KTP <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.id_card}</div>
      </div>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Alamat <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">
          {data.address.length > 0 ?
            <>
              {data.address.filter(items => items.type === "PRIMARY").map((res, idx) => {
                return <span key={idx}>{ res.street }</span>
              })}
            </>
          : "-"}
        </div>
      </div>
      {/*
      {image ?
        <div className="flex flex-wrap items-start text-sm my-4" style={{ color: "#8F90A6" }}>
          <div className="w-2/6 flex font-bold">
            Photo KTP
          </div>
          <div className="w-full mt-2">
            <img src={Ktp} alt="Image Ktp" className="w-full" />
          </div>
        </div>
      : ""} */}
    </>
  )
}

SimpleBioSap.defaultProps = {
  image: false
}

export default SimpleBioSap
