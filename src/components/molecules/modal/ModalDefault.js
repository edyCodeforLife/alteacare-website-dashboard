import { React } from '../../../libraries';

const ModalDefault = ({
  text,
  buttonText,
  buttontextwhite,
  counter,
  value,
  heading,
}) => {
  const handleClick = value => counter(value);

  return (
    <div
      className="fixed z-20 left-0 top-0 w-full h-full flex flex-wrap justify-center items-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="pt-6 pb-3 px-6 bg-white rounded w-80">
        {heading && (
          <h2
            className="text-17 font-700 mb-3 text-center"
            style={{ fontWeight: 700 }}
          >
            {heading}
          </h2>
        )}
        <p className="text-sm text-black text-center">
          <span>{text}</span>
        </p>
        <div className={`my-6 flex justify-center`}>
          {buttontextwhite !== '' ? (
            <button
              onClick={() => handleClick(true)}
              className="py-2 w-28 rounded mr-2 border border-solid border-darker text-darker"
            >
              {buttontextwhite}
            </button>
          ) : (
            ''
          )}
          <button
            onClick={() => handleClick(false)}
            className="py-2 w-28 rounded text-white ml-2 bg-darker"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

ModalDefault.defaultProps = {
  text: '',
  heading: '',
  buttonText: '',
  counter: '',
  value: '',
  buttontextwhite: '',
};

export default ModalDefault;
