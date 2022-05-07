import { useDispatch } from 'react-redux';

import { TwilioLocalStateAction } from '../../../../../modules/actions';
import useShallowEqualSelector from '../../../../../helpers/useShallowEqualSelector';

const Service = () => {
  const dispatch = useDispatch();
  const { twilioLocalState } = useShallowEqualSelector(state => state);

  const stateHandler = (identifier, value) => {
    dispatch(
      TwilioLocalStateAction({
        ...twilioLocalState,
        [`${identifier}`]: value,
      })
    );
  };

  return {
    stateHandler,
  };
};

export default Service;
