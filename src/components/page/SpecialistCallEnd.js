import { Template } from '../molecules/layout';
import { React, useEffect, useState } from '../../libraries';
import { LocalStorage } from '../../helpers/localStorage'
import useShallowEqualSelector from '../../helpers/useShallowEqualSelector';

const SpecialistCallEnd = () => {
  const role = LocalStorage("role")
  const [HeightElement, setHeightElement] = useState(0)
  const [time, setTime] = useState(null)

  const {
    RoomTimeReducer,
    HeightElementReducer,
  } = useShallowEqualSelector((state) => state);

  useEffect(() => {
    if(HeightElementReducer.data){
      setHeightElement(HeightElementReducer.data.heightElement);
    }
  }, [HeightElementReducer.data]);

  useEffect(() => {
    if (RoomTimeReducer.data) setTime(RoomTimeReducer.data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RoomTimeReducer.data]);

  return (
    <Template isHiddenSide={true} HeightElement={HeightElement}>
      <div className="w-full flex flex-wrap justify-center items-center">
        <div className="w-7/12 flex flex-wrap justify-center">
          <p className="w-full text-dark2 text-lg font-bold text-center mb-3">Panggilan Berakhir</p>
          <p className="w-full text-center text-info2 mb-10">{time}</p>
          <div>
            <button
              onClick={() => window.location.replace(`/${role === "PRO" || role === "DOCTOR" ? "appointment" : ""}`)}
              className="w-full px-4 py-2 bg-mainColor text-white rounded mx-auto"
            >
              Buka Konsultasi Lainnya
            </button>
          </div>
          <div className="w-full px-3 py-2 text-darker bg-subtle mx-auto mt-10 rounded">
            catatan : <br />
            Harap selesaikan Resume medis konsultasi yang sudah dilakukan dengan pasien sebelum membuka konsultasi lainnya.
          </div>
        </div>
      </div>
    </Template>
  );
};

export default SpecialistCallEnd;
