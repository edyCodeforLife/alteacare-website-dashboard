import clsx from 'clsx';
import { useEffect, useState } from 'react';

import useShallowEqualSelector from '../../../../helpers/useShallowEqualSelector';

const Jitsi = () => {
  const state = useShallowEqualSelector(state => state);
  const { video, HeightElementReducer } = state;
  const { config } = video?.provider || {};
  const { heightElement } = HeightElementReducer?.data;
  const [loading, setLoading] = useState(true);
  let api = {};

  const startVideoCall = () => {
    try {
      const domain = new URL(config.host).host;
      const options = {
        parentNode: document.getElementById('jitsi-container'),
        width: '100%',
        height: `${heightElement}px`,
        configOverwrite: config.options?.configOverwrite,
        interfaceConfigOverwrite: {
          VERTICAL_FILMSTRIP: false,
          ...config.options?.interfaceConfigOverwrite,
        },
        jwt: config.options?.jwt,
        roomName: config.options?.roomName,
      };

      api = new window.JitsiMeetExternalAPI(domain, options);
      api.addEventListeners({
        videoConferenceJoined: handleVideoConferenceJoined,
      });
    } catch (error) {
      console.error('Failed to load Jitsi API', error);
    }
  };

  const handleVideoConferenceJoined = () => setLoading(false);

  useEffect(() => {
    // Verify the JitsiMeetExternalAPI constructor is added to the global scope
    if (window.JitsiMeetExternalAPI) startVideoCall();
    else alert('Jitsi Meet API script not loaded');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center w-full h-full">
          <p>Loading...</p>
        </div>
      )}
      <div
        id="jitsi-container"
        className={('w-full h-full', clsx(loading ? 'hidden' : 'block'))}
      />
    </>
  );
};

export default Jitsi;
