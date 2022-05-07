import { connect } from 'react-redux';
import { useHistory } from '../../../libraries';
import { LocalStorage } from '../../../helpers/localStorage';
import { PatientSelectAction } from '../../../modules/actions/user/userData__Action';

import {
  RoomData,
  UserDataSelected,
  CleanParamsAppointment,
} from '../../../modules/actions'

const EndCall = (props) => {
  const history = useHistory();
  const {
    RoomReducer,
    // Load,
    RoomData,
    endedHandler,
    UserDataSelected,
    PatientSelectAction,
    CleanParamsAppointment,
  } = props

  const leaveRoom = async () => {
    const { room } = await RoomReducer;

    room.localParticipant.audioTracks.forEach((publication) => {
      publication.track.stop();
      room.localParticipant.unpublishTrack(publication.track);
    });

    room.localParticipant.videoTracks.forEach((publication) => {
      publication.track.stop();
      room.localParticipant.unpublishTrack(publication.track);
    });

    room.disconnect();
    endedHandler(true);
    UserDataSelected(null);
    CleanParamsAppointment();
    PatientSelectAction(null);
    RoomData({ reset: true });
    history.push(`/${LocalStorage('role') === 'PRO' || LocalStorage('role') === 'DOCTOR' ? "appointment" : ""}`);
  }

  return (
    <div className="w-1/3 text-right text-white">
      <button className="rounded py-1 px-4 text-white text-sm"
        style={{ backgroundColor: "#EB5757" }}
        onClick={ () => leaveRoom() }
      >
        Akhiri Panggilan
      </button>
    </div>
  )
}

EndCall.defaultProps = {
  endedHandler: () => {},
}

const reducer = (state) => ({
  RoomReducer: state.RoomReducer.data,
});

const props = {
  RoomData,
  UserDataSelected,
  PatientSelectAction,
  CleanParamsAppointment,
}

export default connect(reducer, props)(EndCall);
