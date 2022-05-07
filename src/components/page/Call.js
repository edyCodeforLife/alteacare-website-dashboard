import { Template } from '../molecules/layout';
import { MaVideoCall } from '../templates/video';
import useShallowEqualSelector from '../../helpers/useShallowEqualSelector';
import useProvider from '../../hooks/useProvider';

const Call = () => {
  const { loading, error } = useProvider();
  const state = useShallowEqualSelector(state => state);
  const { video, HeightElementReducer } = state;
  const { heightElement } = HeightElementReducer.data;

  const providers = ['TWILIO', 'JITSI_WEB', 'FLUTTER_WEBRTC'];
  const validProvider = providers.includes(video.provider?.name);

  const renderError = () => (
    <div className="flex items-center justify-center w-full h-full">
      <p>{error}</p>
    </div>
  );

  const renderVideo = () => {
    if (validProvider) {
      return <MaVideoCall />;
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>Provider yang digunakan tidak valid.</p>
      </div>
    );
  };

  return (
    <Template HeightElement={heightElement}>
      {error ? renderError() : renderVideo()}
    </Template>
  );
};

export default Call;
