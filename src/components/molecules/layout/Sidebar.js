import { Link, useState } from '../../../libraries';
import {
  ConcallIcon,
  ConsultationIcon,
  UserIconNavIcon,
} from '../../../assets/images';
import { LocalStorage } from '../../../helpers/localStorage';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

const Sidebar = ({ active }) => {
  const { totalCall } = useShallowEqualSelector(state => state.socketCallMA);
  const [role] = useState(LocalStorage('role'));

  return (
    <div className="side-bar pb-5">
      {role === 'MA' && (
        <>
          <Link
            to="/"
            className={`${
              totalCall > 0 ? 'animate-bounce' : ''
            } flex flex-wrap justify-center py-3 px-1 cursor-pointer xl:text-xs text-xxs ${
              active === 'home' ? 'bg-info2' : ''
            }`}
          >
            <img src={ConcallIcon} alt="Concall Icon" className="w-2/4" />
            <p className="w-full text-center text-white mt-1">{`Panggilan${
              totalCall > 0 ? ` (${totalCall})` : ''
            }`}</p>
          </Link>
        </>
      )}
      <Link
        to="/appointment"
        className={`flex flex-wrap justify-center py-3 px-1 cursor-pointer xl:text-xs text-xxs ${
          active === 'appointment' ? 'bg-info2' : ''
        }`}
      >
        <img src={ConsultationIcon} alt="Consultation Icon" className="w-2/4" />
        <p className="w-full text-center text-white mt-1">
          Perjanjian
          <br />
          Konsultasi
        </p>
      </Link>
      {(role === 'PRO' || role === 'MA') && (
        <Link
          to="/users"
          className={`flex flex-wrap justify-center py-3 px-1 cursor-pointer xl:text-xs text-xxs ${
            active === 'dataUser' ? 'bg-info2' : ''
          }`}
        >
          <img
            src={UserIconNavIcon}
            alt="Consultation Icon"
            className="w-2/4"
          />
          <p className="w-full text-center text-white mt-1">Data Pasien</p>
        </Link>
      )}
    </div>
  );
};

Sidebar.defaultProps = {
  active: '',
};

export default Sidebar;
