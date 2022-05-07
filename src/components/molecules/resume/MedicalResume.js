import { React } from '../../../libraries'
import { UncheckBox } from '../../../assets/images'
import { ButtonDarkGrey } from '../../atoms'

const MedicalResume = () => {
  return(
    <div className="flex flex-wrap items-center content-start absolute z-10 w-full h-full bg-white">
      <div className="w-full px-6 py-2">
        <p className="text-sm font-bold mb-2">Medical History</p>
        <p className="text-xs" style={{ color: "#6B7588" }}>sakit kepala kiri sejak 3 hari berdenyut, disertai muntah sejak 1 hari ini. sakit kepala dirasakan memberat saat beraktifitas, berkurang saat istirahat. tidak ada trauma kepala. tidak ada kelemahan anggota gerak, nyeri ulu hati sejak 2 hari. riwayat terlambat makan. badan lemas.</p>
      </div>
      <div className="w-full px-6 py-2">
        <p className="text-sm font-bold mb-2">Diagnosis</p>
        <p className="text-xs" style={{ color: "#6B7588" }}>Migrain, Dispepsia</p>
      </div>
      <div className="w-full px-6 py-2">
        <p className="text-sm font-bold mb-2">Prescribed Medication</p>
        <p className="text-xs" style={{ color: "#6B7588" }}>analsik 500mg, 15 tablet 3x1 tablet setelah makan (bila sakit kepala). Omeprazole 20mg, 10 tablet 2x1 tablet sebelum makan. Sucralfat Susp, 100ml, 4x1 sendok makan sebelum makan. Becom-c, 10 tablet, 1x1 tablet setelah makan (pagi)</p>
      </div>
      <div className="w-full px-6 py-2">
        <p className="text-sm font-bold mb-2">Rekomendasi Dokter</p>
        <p className="text-xs" style={{ color: "#6B7588" }}>- Pola makan secara teratur <br />- Hindari makanan pedas, minum kopi, soda, alcohol <br />- Istirahata teratur</p>
      </div>
      <div className="w-full px-6 py-2">
        <p className="text-sm font-bold mb-2">Catatan Lain</p>
        <p className="text-xs" style={{ color: "#6B7588" }}>- Bila sakit kepala tidak berkurang / bertambah berat lakukan CT Scan di Mitra Keluarga kelapa gading 23 Desember 2020<br />- Bila Nyeri ulu hati tidak berkurang disarankan untuk melakukan endoscopy di mitra keluarga kelapa gading tanggal 4 Januari 2021 </p>
      </div>
      <div className="w-full px-5 py-2 flex items-center">
      {/* <div className="w-full px-5 py-2 absolute bottom-0"> */}
        <div className="mr-auto text-sm" style={{ color: "#6B7588" }}>
          <img src={UncheckBox} alt="Uncheck Box" className="inline mr-1" />Medilcal Resume Check
        </div>
        <ButtonDarkGrey text="Done" dimension="ml-auto" />
      </div>
    </div>
  )
}

export default MedicalResume