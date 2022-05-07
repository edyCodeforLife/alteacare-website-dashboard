import moment from 'moment';
import { React } from '../../../libraries';

const Footer = () => {
  return (
    <div
      id="footer"
      className="relative z-10 w-full py-2 text-center text-white self-end text-sm bg-info2"
    >
      ©Alteacare, {moment().format('YYYY')}. All Rights Reserved
    </div>
  );
};

export default Footer;
