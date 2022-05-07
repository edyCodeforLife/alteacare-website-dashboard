import { PropTypes } from 'prop-types';
import React from 'react';

import services from './services';
import {
  EndCall,
  RoomInfo,
  TimeCounter,
  Signal,
} from '../../../../molecules/video';
import useCallingUri from '../../../../../hooks/useCallingUri';

const Screen = ({ endCallFromSpecialist }) => {
  const { name, appointmentId, userId } = useCallingUri();
  const sp = name === 'CALL_SP';

  const { signal, isEnded, setEnded } = services();

  return (
    <div
      className="flex flex-wrap px-5 py-3"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="flex w-1/3 items-center">
        <RoomInfo isSpesialist={sp} data={{ userId, appointmentId }} />
        <Signal twilioSignal={signal} />
      </div>
      <TimeCounter isEnded={isEnded} />
      <EndCall
        endCallFromSpecialist={endCallFromSpecialist}
        endedHandler={value => setEnded(value)}
        finishAppointment={{ isSpesialist: sp, appointmentId }}
      />
    </div>
  );
};

Screen.propTypes = {
  endCallFromSpecialist: PropTypes.bool,
};

Screen.defaultProps = {
  endCallFromSpecialist: false,
};

export default Screen;
