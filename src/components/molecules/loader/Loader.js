import React from 'react';

const Loader = ({
  text = 'Tunggu sebentar...',
  textColor = 'text-mainColor',
  loadingColor = 'text-mainColor',
  bgColor = 'bg-transparent',
  rounded = false,
  px = '',
  py = 'py-5',
  textSize = 'text-sm',
}) => {
  return (
    <div
      className={`${textSize} ${textColor} ${bgColor} ${
        rounded ? 'rounded-full' : ''
      } ${px} ${py} flex justify-center items-center w-full`}
    >
      <svg
        className={`animate-spin -ml-1 mr-3 h-5 w-5 ${loadingColor}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={4}
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text}
    </div>
  );
};

export default Loader;
