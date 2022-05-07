import { React } from '../../../libraries';
import { AlertcloseBlue } from '../../../assets/images';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import { useDispatch } from 'react-redux';
import { hideModal } from '../../../modules/actions/modal';

const Modal = () => {
  const {
    isEnabled = false,
    message,
    actionButtonText,
    actionButton,
    cancelButtonText,
    cancelButton,
  } = useShallowEqualSelector(state => state.modal);
  const dispatch = useDispatch();

  if (!isEnabled) {
    return <span />;
  }

  return (
    <div
      className="w-full h-full fixed z-40 inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="lg:w-1/3 md:w-2/4 w-3/4 px-4 py-5 bg-white rounded relative">
        <button
          className="p-2 rounded-full bg-white absolute right-0 top-0 -m-2 shadow"
          onClick={() => dispatch(hideModal())}
        >
          <img
            src={AlertcloseBlue}
            alt="Alert Close Blue Icon"
            className="w-3"
          />
        </button>
        <div className="text-center text-dark2">{message}</div>
        {((actionButtonText && actionButton) ||
          (cancelButtonText && cancelButton)) && (
          <div className="mt-5 flex justify-end">
            <div className="inline">
              {actionButtonText && actionButton && (
                <button
                  onClick={() => {
                    actionButton?.();
                    dispatch(hideModal());
                  }}
                  className="py-2 px-2 text-sm rounded border border-solid border-darker text-darker"
                >
                  {actionButtonText}
                </button>
              )}

              {cancelButtonText && cancelButton && (
                <button
                  onClick={() => {
                    cancelButton?.();
                    dispatch(hideModal());
                  }}
                  className="py-2 px-2 rounded text-white ml-2 bg-darker"
                >
                  {cancelButtonText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
