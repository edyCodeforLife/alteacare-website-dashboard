import { React } from '../../../libraries';
import { AlertcloseBlue } from '../../../assets/images';

const ModalWindow = ({ text, counterClose, isButtonRefreshPage }) => {
  const handleClose = () => {
    counterClose()
  }

  const refresh = () => {
    window.location.reload();
  }

  return (
    <div className="w-full h-full fixed z-40 inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="lg:w-1/4 md:w-2/4 w-3/4 px-4 py-5 bg-white rounded relative">
        <button className="p-2 rounded-full bg-white absolute right-0 top-0 -m-2 shadow" onClick={() => handleClose()}>
          <img src={AlertcloseBlue} alt="Alert Close Blue Icon" className="w-3" />
        </button>
        <div className="text-center text-dark2">{text}</div>
        {isButtonRefreshPage ? 
          <div className="mt-5 flex justify-center">
            <div className="inline">
              <button onClick={() => refresh()} className="py-2 w-28 rounded border border-solid border-darker text-darker">Oke</button>
              <button onClick={() => counterClose()} className="py-2 w-28 rounded text-white ml-2 bg-darker">Batal</button>
            </div>
          </div>
        : ""}
      </div>
    </div>
  );
};

ModalWindow.defaultProps = {
  isButtonRefreshPage: false
}

export default ModalWindow;
