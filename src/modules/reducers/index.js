import { persistReducer } from 'redux-persist';
import { TriggerReducer } from './Trigger__reducer';
import { HeightElementReducer } from './dimension/HeightElement__Reducer';
import { TokenReducer } from './token/Token__reducer';
import { ParamCreateAppointment } from './appoitment/ParamsCreate__Reducer';
import { FilterSpesialistReducer } from './filterDoctor/FilterSpesialist__Reducer';
import { FilterHospitalsReducer } from './filterDoctor/FilterHospitals__Reducer';
import { FilterPriceReducer } from './filterDoctor/FilterPrice__Reducer';
import {
  UserSelectReducer,
  UserSelectIdReducer,
  PatientSelectReducer,
} from './user/userData__Reducer';
import { DocumentReducer } from './patient/Document__Reducers';
import { RoomReducer } from './room/roomData__Reducer';
import { RoomTimeReducer } from './room/roomTime__Reducer';
import AddressReducer from './family-member/Address__Reducer';
import MemberReducer from './family-member/Member__Reducer';
import TwilioSignalReducer from './twilio-signal/TwilioSignal__Reducer';
import { TwilioLocalState, TwilioRemoteState } from './twilio-state/reducer';
import chat from './chat';
import video from './video';
import socketCallMA from './socketCallMA';
import modal from './modal';

const storage = require('redux-persist/lib/storage').default;

const getPersistConfig = (key, whitelist) => {
  const config = {
    key,
    storage,
  };
  if (whitelist?.length > 0) {
    config.whitelist = whitelist;
  }
  return config;
};

const tokenPersistConfig = () =>
  getPersistConfig(process.env.REACT_APP_REDUX_KEY, [
    'loggedIn',
    'accessToken',
    'refreshToken',
    'role',
  ]);

export const rootReducers = {
  TokenReducer: persistReducer(tokenPersistConfig(), TokenReducer),
  twilioLocalState: TwilioLocalState,
  twilioRemoteState: TwilioRemoteState,
  TriggerReducer,
  HeightElementReducer,
  ParamCreateAppointment,
  FilterSpesialistReducer,
  FilterHospitalsReducer,
  FilterPriceReducer,
  UserSelectReducer,
  UserSelectIdReducer,
  PatientSelectReducer,
  DocumentReducer,
  RoomReducer,
  RoomTimeReducer,
  AddressReducer,
  MemberReducer,
  TwilioSignalReducer,
  chat,
  video,
  socketCallMA,
  modal,
};
