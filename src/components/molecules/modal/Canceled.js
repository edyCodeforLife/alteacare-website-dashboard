import { React, useState } from '../../../libraries'
import { AlertcloseBlue } from '../../../assets/images';
import { NotePatient } from './'

const Canceled = ({ counter, appointmentId, counterWithFormNote, type, counterCloseModal = null }) => {
  const [changeTextDesc, setChangeTextDesc] = useState(false)
  const [note, setNote] = useState("-")

  const handleClick = (value) => {
    counter({
      appointmentId: appointmentId,
      status: value,
      note: note
    })
  }

  const handleCounterNotePatient = (value) => {
    setChangeTextDesc(true)
    setNote(value)
    // console.log(value)
  }

  const handleClose = () => {
    if(counterCloseModal) counterCloseModal();
  }

  return(
    <div className="fixed z-20 left-0 top-0 w-full h-full flex flex-wrap justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="pt-6 pb-3 px-6 bg-white rounded w-80 relative">
        <button className="p-2 rounded-full bg-white absolute right-0 top-0 -m-2 shadow z-30" onClick={() => handleClose()}>
          <img src={AlertcloseBlue} alt="Alert Close Blue Icon" className="w-3" />
        </button>
        {counterWithFormNote !== "" && !changeTextDesc ? 
          <NotePatient counterNotePatient={(value) => handleCounterNotePatient(value)} />
        : 
          <>
            {type === "cancel" ? 
              <p className="text-sm">
                {changeTextDesc ? 
                  <span>Apakah anda yakin ingin melakukan <br />proses membatalkan konsultasi ini?</span>
                :
                  <span>Apakah anda yakin ingin melakukan <br />proses pembatalan konsultasi ini? <br />pastikan kamu telah menyalin catatan <br />pasien pada konsultasi ini.</span>
                }
              </p>
            : ""}
            {type === "refund" ? 
              <p className="text-sm">
                <span>Apakah anda yakin ingin melakukan <br />proses refund konsultasi ini?</span>
              </p>
            : ""}
            <div className="my-6 flex justify-center">
              <button 
                onClick={() => handleClick(true)} 
                className="py-2 w-28 rounded mr-2 border border-solid border-darker text-darker" 
              >Ya</button>
              <button 
                onClick={() => handleClick(false)} 
                className="py-2 w-28 rounded text-white ml-2 bg-darker" 
              >Batal</button>
            </div>
          </>
        }
      </div>
    </div>
  )
}

Canceled.defaultProps = {
  counter: "",
  appointmentId: "",
  counterWithFormNote: "",
  type: ""
}

export default Canceled