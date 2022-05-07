import { useEffect, useState } from '../../../libraries';
import { VideoOnIcon, UnCalling } from '../../../assets/images';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';

const PanelHeader = ({ activeTab = 'call', tab }) => {
  const { totalCall } = useShallowEqualSelector(state => state.socketCallMA);
  const [call, setCall] = useState(null);
  const [missedCall, setMissedCall] = useState(null);
  const [active, setActive] = useState(activeTab);

  const handleTabCall = item => {
    tab(item);
    setActive(item);
  };

  useEffect(() => {
    if (active === 'call') setCall('border-b-2');
    else setCall(null);

    if (active === 'missed-call') setMissedCall('border-b-2');
    else setMissedCall(null);
  }, [active]);

  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);

  return (
    <>
      <div
        id="panel-header"
        onClick={() => handleTabCall('call')}
        className={`w-5/12 py-2 xl:px-6 px-2 flex items-center xl:text-sm text-xs font-bold ${call} border-solid cursor-pointer`}
        style={{
          borderColor: '#2C528B',
          backgroundColor: '#F2F2F5',
          color: '#6B7588',
        }}
      >
        <span className={totalCall > 0 ? 'animate-bounce' : ''}>
          <img
            src={VideoOnIcon}
            alt="Video On Icon"
            className="inline my-auto mr-2"
          />
          {`Panggilan${totalCall > 0 ? ` (${totalCall})` : ''}`}
        </span>
      </div>
      <div
        id="panel-header"
        onClick={() => handleTabCall('missed-call')}
        className={`w-7/12 py-2 xl:px-6 px-2 flex justify-end items-center xl:text-sm text-xs font-bold ${missedCall} border-solid cursor-pointer`}
        style={{
          borderColor: '#2C528B',
          backgroundColor: '#F2F2F5',
          color: '#6B7588',
        }}
      >
        <img
          src={UnCalling}
          alt="Un Calling Icon"
          className="inline my-auto mr-1"
        />{' '}
        Tak Terjawab
      </div>
    </>
  );
};

export default PanelHeader;
