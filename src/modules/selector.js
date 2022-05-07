import { shallowEqual, useSelector } from 'react-redux';

export default function useShallowSelector(selector) {
  return useSelector(selector, shallowEqual);
}
