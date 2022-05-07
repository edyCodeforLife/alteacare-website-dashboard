import { number } from 'prop-types';

import useShallowEqualSelector from '../../../../helpers/useShallowEqualSelector';

const Flutter = ({ height }) => {
  const { video } = useShallowEqualSelector(state => state);
  const { url } = video.provider?.config || null;
  if (!url) return null;

  return (
    <iframe
      title="Flutter WebRTC"
      src={url}
      width="100%"
      height={height}
      allow="camera; microphone; display-capture; autoplay"
    />
  );
};

Flutter.propTypes = {
  height: number.isRequired,
};

export default Flutter;
