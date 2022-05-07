import { React } from '../../../libraries'
import moment from 'moment'
import { Ktp } from '../../../assets/images'

const SimpleBioAppointment = ({ data, image }) => {

  return (
    <>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Nama <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.first_name} {data.last_name}</div>
      </div>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Umur <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">
          {`${data.age.year} Tahun ${data.age.month} Bulan`}
        </div>
      </div>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Tanggal Lahir <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{moment(data.birthdate).format("DD/MM/YYYY")}</div>
      </div>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Jenis Kelamin <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.gender ? data.gender : "-"}</div>
      </div>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          No. Telp <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.phone_number}</div>
      </div>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Email <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.email}</div>
      </div>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Nomor KTP <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">{data.card_id ? data.card_id : "-"}</div>
      </div>
      <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
        <div className="w-2/6 flex">
          Alamat <span className="ml-auto">:</span>
        </div>
        <div className="w-4/6 px-3">
          {data && data.address_raw.length > 0 ?
              <>
                {data.address_raw.filter(items => items.type === "PRIMARY").map((res, idx) => {
                  return (
                    <span key={idx}>
                      { `${res.street}, Blok RT/RW ${res.rt_rw} kel.${res.sub_district.name} Kec.${res.district.name} ${res.city.name} ${res.province.name}` }
                    </span>
                  )
                })}
              </>
          : "-"}
        </div>
      </div>
      {image ?
        <div className="flex flex-wrap items-start text-sm my-4" style={{ color: "#8F90A6" }}>
          <div className="w-2/6 flex font-bold">
            Photo KTP
          </div>
          <div className="w-full mt-2">
            <img src={Ktp} alt="Ktp" className="w-full" />
          </div>
        </div>
      : ""}
    </>
  )
}

SimpleBioAppointment.defaultProps = {
  image: false
}

export default SimpleBioAppointment
