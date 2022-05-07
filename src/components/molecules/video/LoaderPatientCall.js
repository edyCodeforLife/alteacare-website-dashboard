import React from 'react';
import PropTypes from 'prop-types'
import {
  User,
  LoadingProfile,
} from '../../../assets/images'

const LoaderPatientCall = (props) => {
  const { isReconect, isNotJoin, image } = props
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="inline-block flex flex-wrap justify-center">
        <div className="inline-block flex justify-center relative">
          <img src={LoadingProfile} alt="Loading Profile Icon" />
          <div
            className="absolute inset-0 m-auto w-36 h-36 overflow-hidden rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#C7C9D9' }}
          >
            {
              image === ''
                ? <img src={User} alt="User Icon" />
                : (
                  <img
                    className="w-full h-full object-cover"
                    src={image}
                    alt="profile"
                  />
                )
            }
          </div>
        </div>
        {
          isReconect
            ? (
              <span className="text-center inline-block w-full text-sm text-white">
                Sedang Menghubungkan
              </span>
            ) : ''
        }
        {
          isNotJoin
            ? (
              <span className="text-center inline-block w-full text-sm text-white">
                Pasien masih belum bergabung
              </span>
            ) : ''
        }
      </div>
    </div>
  )
};

LoaderPatientCall.defaultProps = {
  isReconect: false,
  isNotJoin: false,
  image: '',
};

LoaderPatientCall.propTypes = {
  isReconect: PropTypes.bool,
  isNotJoin: PropTypes.bool,
  image: PropTypes.string,
};

export default LoaderPatientCall;
