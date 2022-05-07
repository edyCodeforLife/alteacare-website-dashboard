import { React } from '../../../libraries';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { TokenCreate } from '../../../modules/actions';
import { Logo, ConfigIcon, ChevronRight } from '../../../assets/images';
import useLogout from '../../../hooks/useLogout';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import Loader from '../loader/Loader';

const HeaderTop = ({ TokenCreate }) => {
  const { isEnabled, connectedState } = useShallowEqualSelector(
    state => state.socketCallMA
  );
  const { logoutUser } = useLogout();

  const logout = () => {
    logoutUser({ redirectToLogin: true });
  };

  const connectedSocketMAComponent = () => {
    if (!isEnabled) {
      return <span />;
    }

    if (connectedState === 'CONNECTING') {
      return (
        <Loader
          px="px-4"
          py="py-1"
          text="Sedang menghubungkan ke server..."
          textColor="text-white"
          loadingColor="text-white"
          bgColor="bg-mainColor"
          rounded
        />
      );
    }

    if (connectedState === 'FAILED') {
      return (
        <div className="text-sm text-white bg-error1 rounded-full px-4 py-1 flex justify-center items-center w-full">
          {`Gagal menghubungkan ke server :'(`}
        </div>
      );
    }

    return (
      <div className="text-sm bg-mainColor text-white rounded-full px-4 py-1 flex justify-center items-center w-full">
        Terhubung
      </div>
    );
  };

  return (
    <div
      className="flex w-full px-6 py-3 shadow border-b border-solid border-grey-300"
      id="header-top"
    >
      <Link className="my-auto mr-auto" to="/">
        <img src={Logo} alt="Logo" className="w-28" />
      </Link>
      <div className="flex items-center ml-auto">
        {/* <img src={BlueBell} alt="Blue Bell Icon" className="inline w-10 p-1 mr-7" /> */}

        <div className="group inline-block relative p-1 mr-7 rounded-full">
          {connectedSocketMAComponent()}
        </div>
        <div className="group inline-block relative cursor-pointer hover:bg-subtle p-1 mr-7 rounded-full">
          <div className="w-10 h-10 flex items-center rounded-full text-white">
            <img src={ConfigIcon} alt="Config Icon" className="inline w-full" />
          </div>
          <div className="absolute hidden group-hover:block left-0 z-30 -ml-32">
            <div
              className="border border-solid mt-2 text-sm w-52 py-2 bg-white shadow rounded-lg"
              style={{ color: '#2C528B' }}
            >
              <p className="w-full pl-8 pr-5 pt-2 pb-3 font-bold">Pengaturan</p>
              <Link
                to="/change-password"
                className="w-full pl-8 pr-5 py-2 hover:bg-gray-200 flex justify-between items-center"
              >
                Ganti Password
              </Link>
            </div>
          </div>
        </div>
        <div className="group inline-block relative cursor-pointer hover:bg-subtle p-1 rounded-full">
          <div
            className="w-6 h-6 flex items-center rounded-full text-white"
            style={{ backgroundColor: '#3E8CB9' }}
          >
            <span className="text-xs m-auto">AD</span>
          </div>
          <div className="absolute hidden group-hover:block left-0 z-30 -ml-32">
            <div
              className="border border-solid mt-2 text-sm w-40 py-2 bg-white shadow rounded-lg"
              style={{ color: '#2C528B' }}
            >
              <button
                className="w-full pl-8 pr-5 py-2 hover:bg-gray-200 flex justify-between items-center font-bold"
                onClick={logout}
              >
                Logout{' '}
                <img
                  src={ChevronRight}
                  alt="Chevron Right Icon"
                  className="inline"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  TokenCreate,
};

export default connect(null, mapDispatchToProps)(HeaderTop);
