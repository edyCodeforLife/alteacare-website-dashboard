import React from 'react';
import { LoadingButtonGif } from '../../../assets/images'

const ReconnectedUserCall = () => (
  <div className="px-5 py-3 bg-dark1 text-white text-xs flex items-center">
    <img src={LoadingButtonGif} alt="Loading Button Gif" className="w-5 mr-2" />
    Koneksi Anda tidak stabil. Mencoba menghubungkan kembali.
  </div>
);

export default ReconnectedUserCall;
