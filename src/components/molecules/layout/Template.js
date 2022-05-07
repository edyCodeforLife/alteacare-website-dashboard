import Sidebar from './Sidebar';
import HeaderTop from './HeaderTop';
import SidebarConfig from './SidebarConfig';
import useCallMA from '../../../hooks/useCallMA';
import Modal from '../modal/Modal';

const Template = ({
  enableCallMA = false,
  active,
  children,
  HeightElement,
  type,
  isHiddenSide = false,
}) => {
  useCallMA({
    isEnabled: enableCallMA,
  });
  const classes = !type
    ? 'content-application'
    : type === 'configuration'
    ? 'content-configuration'
    : '';
  const headerLayout = {
    backgroundImage: 'linear-gradient(#FFFFFF, #FFFFFF, #FFFFFF, #D6EDF6)',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div
      className="fixed w-full h-full flex flex-wrap lg:overflow-y-visible overflow-y-auto"
      style={headerLayout}
    >
      <Modal />
      <HeaderTop />
      <div
        className="w-full flex flex-wrap items-stretch"
        style={{ height: `${HeightElement}px` }}
      >
        {!type && !isHiddenSide ? (
          <Sidebar active={active} />
        ) : type === 'configuration' ? (
          <SidebarConfig active={active} />
        ) : (
          ''
        )}
        <div
          className={`${classes} ${
            isHiddenSide ? 'w-full' : ''
          } flex flex-wrap`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Template;
