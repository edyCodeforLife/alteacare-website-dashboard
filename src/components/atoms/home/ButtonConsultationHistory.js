import { useEffect, useState } from '../../../libraries';

const ButtonConsultationHistory = ({ refferenceId, section, clickHandler }) => {
  const [display, setDisplay] = useState('hidden');

  useEffect(() => {
    if (!section.sectionOrder) setDisplay('block')
    else setDisplay('hidden')
  }, [section])

  const handlePreviousConsultation = (value) => {
    clickHandler(value)
  }

  return (
    <>
    {
      section.sectionMissedCallDetail && !section.sectionOrder ?
        <div className={`flex flex-wrap justify-center ${display}`}>
          <button onClick={() => handlePreviousConsultation(refferenceId)} className="focus:outline-none text-xl underline font-bold text-mainColor">
            Lihat Konsultasi Sebelumnya
          </button>
        </div>
      : ""
    }
    </>
  )
}

export default ButtonConsultationHistory;
