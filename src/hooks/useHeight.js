import { useEffect, useState } from 'react';

import useShallowEqualSelector from '../helpers/useShallowEqualSelector';

const useHeight = () => {
  const state = useShallowEqualSelector(state => state);
  const { video, HeightElementReducer } = state;
  const isTwilio = video.provider?.name === 'TWILIO';
  const { heightElement: parentHeight } = HeightElementReducer.data;

  const [videoHeight, setVideoHeight] = useState(0);
  useEffect(() => {
    if (isTwilio) {
      const footer = document.getElementById('footer-video');
      const footerHeight = footer?.clientHeight ?? 0;
      setVideoHeight(parentHeight - footerHeight);

      return;
    }

    setVideoHeight(parentHeight);
  }, [isTwilio, parentHeight]);

  return { parentHeight, videoHeight };
};

export default useHeight;
