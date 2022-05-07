import React from 'react';
import PropTypes from 'prop-types';
import {
  LoadingButtonGif,
  SuccessBgWhite,
  WarningWhite,
  ErrorRed,
} from '../../../assets/images'

const Notification = (props) => {
  const {
    text,
    info,
    error,
    success,
    classTextColor,
  } = props;

  return (
    <div className={`px-5 py-3 bg-dark1 text-xs flex items-center ${classTextColor}`}>
      { error ? <img src={ErrorRed} alt="icon" className="w-5 mr-2" /> : '' }
      { success ? <img src={SuccessBgWhite} alt="icon" className="w-5 mr-2" /> : '' }
      { info ? <img src={WarningWhite} alt="icon" className="w-5 mr-2" style={{ transform: 'rotate(180deg)' }} /> : '' }
      { !error && !info && !success ? <img src={LoadingButtonGif} alt="icon" className="w-5 mr-2" /> : '' }
      {text}
    </div>
  )
};

Notification.defaultProps = {
  text: '',
  info: false,
  erro: false,
  success: false,
  classTextColor: 'text-white',
};

Notification.propTypes = {
  text: PropTypes.string,
  info: PropTypes.bool,
  erro: PropTypes.bool,
  success: PropTypes.bool,
  classTextColor: PropTypes.string,
};

export default Notification;
