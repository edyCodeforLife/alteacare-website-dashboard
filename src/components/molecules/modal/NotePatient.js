import { React, useState } from '../../../libraries'

const NotePatient = ({ counterNotePatient }) => {
  const [note, setNote] = useState("")
  const [noteData, setNoteData] = useState("")

  const handleChange = (event) => {
    setNote(event.target.value)
  }

  const handleButtonSave = () => {
    let noteDataUpdate
    if(note === ""){
      noteDataUpdate = "-"
    } else {
      noteDataUpdate = note
    }
    setNoteData(noteDataUpdate)
  }

  const handleButtonNextModal = () => {
    counterNotePatient(noteData)
  }

  return(
    // <div className="fixed z-20 left-0 top-0 w-full h-full flex flex-wrap justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="">
        <p className="font-bold pb-2">Note</p>
        <textarea onChange={handleChange} className="border border-solid w-full h-28 resize-none p-2" style={{ backgroundColor: "#FAFAFC" }}></textarea>
        <div className="my-6 flex flex-wrap">
          <div className="w-1/2 text-sm text-success3">
            {noteData !== "" ?
              <span>Note tersimpan!</span>
            : ""}
          </div>
          <div className="w-1/2 flex justify-end">
            {noteData !== "" ?
              <button
              onClick={handleButtonNextModal}
              className="py-2 w-28 rounded text-white ml-2 text-sm bg-darker">Lanjut</button>
            :
              <button
                onClick={handleButtonSave}
                className="py-2 w-28 rounded text-white ml-2 text-sm bg-darker">Simpan</button>
            }
          </div>
        </div>
      </div>
    // </div>
  )
}

export default NotePatient
