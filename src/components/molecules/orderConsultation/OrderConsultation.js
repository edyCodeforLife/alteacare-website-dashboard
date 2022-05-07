import { React, useState, useEffect } from '../../../libraries'
import { connect } from 'react-redux'
import moment from 'moment'
// import { LocalStorage } from '../../../helpers/localStorage'
// import { Api } from '../../../helpers/api'
import { TriggerUpdate } from '../../../modules/actions'

import { LabelTitle, ButtonTextAndBorderBlue } from '../../atoms'
import { DoctorSpesialistList, ScheduleSpesialist } from '../../molecules'
// import { StatusList } from '../../molecules'
// import { SimpleBioAppointment } from '../../molecules/bio'
import { SmallLogo, CalenderIcon, MailIcon, ClockIcon } from '../../../assets/images'

const OrderConsultation = ({ TriggerUpdate, TriggerReducer, HeightElementReducer, data }) => {
  const [sectionDoctorSpesialistList, setSectionDoctorSpesialistList] = useState(false)
  const [sectionScheduleSpesialist, setSectionScheduleSpesialist] = useState(false)
  const [sectionSecondHeight, setSectionSecondHeight] = useState(0)
  const [day] = useState([
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
  ])
  const handleCounter = (value) => {
    TriggerUpdate({
      appoitmentLastSection: value
    })
  }

  // const [simpleBioData] = useState([
  //   { label: "Nama", value: "Aldi Rostiawan" },
  //   { label: "Umur", value: "29 Tahun 3 Bulan" },
  //   { label: "Tanggal Lahir", value: "04/01/1991" },
  //   { label: "Jenis Kelamin", value: "Laki-laki" },
  //   { label: "No. Telp", value: "+628123456789" },
  //   { label: "Email", value: "aldi@email.com" },
  //   { label: "Nomor KTP", value: "300071828903" },
  //   { label: "Alamat", value: "Komp Bukit dago, Blok RT/RW 02/08 kel. Rawa Kalong Kec. Gunung Sindur Kota Bogor Jawa barat 12345" }
  // ])

  // const [statusData] = useState([
  //   {
  //     date: "Hari ini",
  //     time: "08:10",
  //     status: "Order Submited",
  //     text: "dibuat oleh Aldi Rostiawan"
  //   },
  //   {
  //     date: "Hari ini",
  //     time: "08:10",
  //     status: "Specialis dirubah",
  //     text: "oleh Medical Advisor Silvia"
  //   },
  //   {
  //     date: "Hari ini",
  //     time: "08:10",
  //     status: "Order confirmed",
  //     text: "oleh Medical Advisor Silvia"
  //   },
  //   {
  //     date: "Hari ini",
  //     time: "08:10",
  //     status: "Telah dibayar",
  //     text: "Metode pembayaran : Kartu Kredit"
  //   },
  //   {
  //     date: "Des 28, 2020",
  //     time: "08.30",
  //     status: "Konsultasi disiapkan",
  //     text: "Oleh PRO Indri"
  //   },
  //   {
  //     date: "Hari ini",
  //     time: "08.30",
  //     status: "Medical resume telah disubmit",
  //     text: "di-input oleh Spesialis Dr. Cindy"
  //   },
  //   {
  //     date: "Hari ini",
  //     time: "08.30",
  //     status: "Selesai",
  //     text: "Konsultasi Selesai"
  //   },
  //   {
  //     date: "Hari ini",
  //     time: "08.30",
  //     status: "Dibatalkan",
  //     text: "Masa pembayaran berakhir"
  //   }
  // ])

  useEffect(() => {
    if (HeightElementReducer !== null) {
      setSectionSecondHeight(parseInt(HeightElementReducer.heightElement) - 40)
    }
  }, [HeightElementReducer])

  useEffect(() => {
    if(TriggerReducer){
      if(TriggerReducer.appoitmentLastSection === "change-spesialist"){
        setSectionDoctorSpesialistList(true)
        TriggerUpdate(null)
      } else if(TriggerReducer.appoitmentLastSection === "change-schedule"){
        setSectionScheduleSpesialist(true)
        TriggerUpdate(null)
      } else if(TriggerReducer.closeDoctorSpesialistList) {
        setSectionDoctorSpesialistList(false)
        TriggerUpdate(null)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer])

  return (
    <>
      <div className={`w-full flex flex-wrap border-r border-solid bg-white`}>
        <div className="w-full flex flex-wrap content-start shadow-sm bg-white" id="element-header">
          <LabelTitle
            text={`Order ID : ${data.order_code}`}
            label={`${data.status}`}
            status="process"
            fontStyle="font-bold"
          />
        </div>
        <div className="flex flex-wrap content-start overflow-y-auto scroll-small w-full" style={{ height: sectionSecondHeight !== "" ? sectionSecondHeight + "px" : "" }}>
          <LabelTitle text="Spesialis" fontStyle="font-bold" />
          <div className="w-full flex flex-wrap pt-2 pb-3 px-5 my-3 bg-white">
            <div className="w-9/12 flex flex-wrap items-start">
              <div className="w-full flex flex-wrap items-start mb-3">
                <div className="w-1/6 h-20">
                  <img src={data.doctor.photo} alt="Doctor Profile" className="object-cover w-full h-full" />
                </div>
                <div className="w-5/6 pl-5">
                  <p className="text-xs mb-1"><img src={SmallLogo} alt="Small Logo" className="inline mr-2" />RS. MIKA Kelapa Gading</p>
                  <p className="font-bold mb-1">{data.doctor.name}</p>
                  <p className="text-sm mb-1">Sp. {`${data.doctor.specialist.name}`} {`- ${data.doctor.specialist.child ? data.doctor.specialist.child.name : ""}`}</p>
                </div>
              </div>
              <div className="w-full py-1 text-sm text-dark2">
                <img src={CalenderIcon} alt="Calender Icon" className="inline mr-3" />{`${day[moment(data.schedule.date).day()]}, ${moment(data.schedule.date).format('DD MMM Y')}`}
              </div>
              <div className="w-full py-1 text-sm text-dark2">
                <img src={ClockIcon} alt="Calender Icon" className="inline mr-3" />{`${data.schedule.time_start} - ${data.schedule.time_end}`}
              </div>
            </div>
            <div className="w-3/12 flex flex-wrap items-end self-end">
              <ButtonTextAndBorderBlue text="Ubah Spesialis" position="center" dimesion="w-full mb-1 py-1 font-bold" counter={() => handleCounter("change-spesialist")} />
              <ButtonTextAndBorderBlue text="Ubah Jadwal" position="center" dimesion="w-full mb-1 py-1 font-bold" counter={() => handleCounter("change-schedule")} />
            </div>
          </div>
          <LabelTitle text="Pasien" fontStyle="font-bold" />
          <div className="w-full px-5 pt-3 pb-2 flex flex-wrap items-start">
            <div className="w-9/12">
              {/* <SimpleBio data={simpleBioData} /> */}
            </div>
            <div className="w-3/12 flex flex-wrap justify-center items-center">
              <ButtonTextAndBorderBlue text="Edit Data" position="center" dimesion="w-full mb-1 py-1 font-bold" />
              <button className="text-sm mt-5"><img src={MailIcon} alt="Mail Icon" className="inline mr-2" />Kirim Email</button>
            </div>
          </div>
          <LabelTitle text="Catatan" fontStyle="font-bold" />
          <div className="w-full px-5 py-5 flex flex-wrap items-start">
            <div className="flex flex-wrap items-start text-sm mb-2" style={{ color: "#8F90A6" }}>
              <div className="w-full flex mb-2">Catatan :</div>
              <div className="w-full">{data.symptom_note}</div>
            </div>
          </div>
          {/* <StatusList data={data.history} /> */}
          {sectionDoctorSpesialistList ?
            <div className="fixed w-full h-full z-10 left-0 top-0 flex flex-wrap justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="w-1/3 relative">
                <DoctorSpesialistList />
              </div>
            </div>
            : ""}
          {sectionScheduleSpesialist ?
            <div className="fixed w-full h-full z-10 left-0 top-0 flex flex-wrap justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="w-1/3 relative">
                <ScheduleSpesialist />
              </div>
            </div>
            : ""}
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  TriggerReducer: state.TriggerReducer.data,
  HeightElementReducer: state.HeightElementReducer.data
})

const mapDispatchToProps = {
  TriggerUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderConsultation)
