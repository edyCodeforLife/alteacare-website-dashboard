import {
  RemoteParticipantTrack,
  LoaderPatientCall,
} from '../../../molecules/video';
import useShallowEqualSelector from '../../../../helpers/useShallowEqualSelector';

const Twilio = () => {
  const state = useShallowEqualSelector(state => state);
  const { twilioLocalState, twilioRemoteState, video } = state;
  const lpc = twilioLocalState.localParticipantConnected;
  const rpc = twilioRemoteState.remoteParticipantConnected;
  const loading = lpc === '' && rpc === '';
  const joining = rpc === 'CONNECTED';

  return (
    <>
      <LoaderPatientCall isReconect={loading} isNotJoin={!joining} />
      {!loading && (
        <RemoteParticipantTrack
          twilioRemoteState={twilioRemoteState}
          avatar={video?.avatar?.url}
        />
      )}
    </>
  );
};

export default Twilio;
