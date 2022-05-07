import { useEffect, useState } from '../../libraries';
import { connect } from 'react-redux';

import { LabelTitle } from '../atoms';
import { Template } from '../molecules/layout';
import { SectionFormPatient } from '../molecules';
import { EmptyData, DataPatientSearch } from '../molecules';
import { OrderedConsultation } from '../molecules/orderConsultation';
import { TicketCalling, MissedCallList } from '../molecules/calling';
import { PanelHeader, ButtonConsultationHistory } from '../atoms/home';
import {
  AppointmentTemporary,
  AppointmentCancel,
} from '../molecules/appointment';
import { PatientSelectAction } from '../../modules/actions/user/userData__Action';

import {
  TriggerUpdate,
  UserDataSelected,
  CleanParamsAppointment,
  setCleanParamsAppointment,
} from '../../modules/actions';

import { InputSearchWithIcon } from '../molecules';
import { debounce } from 'lodash';
import useShallowEqualSelector from '../../helpers/useShallowEqualSelector';
import { LocalStorage } from '../../helpers/localStorage';
import Loader from '../molecules/loader/Loader';

const Home = ({
  TriggerReducer,
  CleanParamsAppointment,
  PatientSelectAction,
  UserDataSelected,
  HeightElementReducer,
}) => {
  const role = LocalStorage('role');
  const [search, setSearch] = useState(null);
  const [callingTab, setCallTab] = useState('call');
  const [refferenceId, setRefferenceId] = useState(null);
  const [HeightElement, setHeightElement] = useState('');
  const [sectionOrder, setSectionOrder] = useState(false);
  const [dataRefferenceId, setDataRefferenceId] = useState('');
  const [sectionFirstHeight, setSectionFirstHeight] = useState('');
  const [sectionSecondHeight, setSectionSecondHeight] = useState('');
  const [sectionDataPatient, setSectionDataPatient] = useState(false);
  const [sectionAddAppointment, setSectionAddAppointment] = useState(false);
  const [confirmedListSection, setConfirmedListSection] = useState('confirmed');
  const [sectionAppointmentDetail, setSectionAppointmentDetail] =
    useState(false);
  const [sectionMissedCallDetail, setSectionMissedCallDetail] = useState(false);
  const [
    sectionDetailAppointmentTemporary,
    setSectionDetailAppointmentTemporary,
  ] = useState(false);

  const { connectedState } = useShallowEqualSelector(
    state => state.socketCallMA
  );

  useEffect(() => {
    if (HeightElementReducer) {
      const heightHeader = document.getElementById('panel-header').clientHeight;
      const elementHeader = document.getElementById(
        'element-header-section-appointment'
      ).clientHeight;
      setHeightElement(HeightElementReducer.heightElement);
      setSectionFirstHeight(
        parseInt(HeightElementReducer.heightElement) - parseInt(heightHeader)
      );
      setSectionSecondHeight(
        parseInt(HeightElementReducer.heightElement) - parseInt(elementHeader)
      );
    }
  }, [HeightElementReducer]);

  useEffect(() => {
    setSearch(null);
  }, [search]);

  useEffect(() => {
    if (TriggerReducer?.page === 'home') {
      TriggerUpdate(null);
      setSectionOrder(true);
      setSectionDataPatient(false);
      setSectionAddAppointment(false);
      setSectionMissedCallDetail(false);
      setSectionDetailAppointmentTemporary(false);
      setSectionAppointmentDetail(true);
    }

    if (TriggerReducer?.addAppointment) {
      TriggerUpdate(null);
      setSectionOrder(false);
      setSectionAddAppointment(true);
      setSectionMissedCallDetail(false);
      setSectionDetailAppointmentTemporary(false);
      setSectionAppointmentDetail(false);
    }

    if (TriggerReducer?.missedCallDetail) {
      setSectionMissedCallDetail(false);
      setTimeout(() => {
        TriggerUpdate(null);
        setSectionOrder(false);
        setSectionDataPatient(false);
        setSectionAddAppointment(false);
        setSectionMissedCallDetail(true);
        setSectionDetailAppointmentTemporary(false);
        setSectionAppointmentDetail(false);
      }, 100);
    }

    if (TriggerReducer?.dataPatientSearch) {
      handleSectionPatient();
    }

    if (TriggerReducer?.resetCenterContainer) {
      TriggerUpdate(null);
      setSectionOrder(false);
      setSectionMissedCallDetail(false);
    }

    if (TriggerReducer?.showActiveCallTab) {
      setTimeout(() => {
        handleSection('call');
        TriggerUpdate(null);
      }, 100);
    }

    if (TriggerReducer?.closeSectionright) {
      TriggerUpdate(null);
      setSectionOrder(false);
      setSectionDataPatient(false);
      setSectionAddAppointment(false);
      setSectionMissedCallDetail(false);
      setSectionDetailAppointmentTemporary(false);
      setSectionAppointmentDetail(false);
    }

    if (TriggerReducer?.detailAppointmentTemporary) {
      TriggerUpdate(null);
      setSectionOrder(false);
      setSectionDataPatient(false);
      setSectionAddAppointment(false);
      setSectionMissedCallDetail(false);
      setSectionDetailAppointmentTemporary(true);
      setSectionAppointmentDetail(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer]);

  useEffect(() => {
    setTimeout(() => {
      handleSection('call');
    }, 100);
  }, []);

  const handleClickSectionConfirmationList = value => {
    setConfirmedListSection(value);
  };

  const handleSectionPatient = () => {
    UserDataSelected(null);
    PatientSelectAction(null);
    CleanParamsAppointment();
    setSectionAddAppointment(false);
    setSectionDetailAppointmentTemporary(false);
    setSectionDataPatient(true);
  };

  const handlePreviousConsultation = value => {
    setSectionOrder(true);
    setDataRefferenceId(value);
  };

  const handleCounterInputSearch = debounce(value => {
    setSearch(value);
  }, 700);

  const handleSection = value => {
    setCallTab(value);
    setCleanParamsAppointment();
    if (value === 'call') {
      setSectionOrder(false);
      setSectionMissedCallDetail(false);
    }
  };

  return (
    <Template
      enableCallMA={role === 'MA'}
      active="home"
      HeightElement={HeightElement}
    >
      <div className="lg:w-7/12 w-full flex flex-wrap">
        <div className="lg:w-1/2 w-5/12 flex flex-wrap content-start border-r border-solid bg-white border-subtle">
          <PanelHeader
            activeTab={callingTab}
            tab={value => handleSection(value)}
          />
          <div
            className="w-full overflow-y-auto scroll-small"
            style={{ height: `${sectionFirstHeight}px` }}
          >
            {connectedState === 'FAILED' && (
              <div className="text-sm text-error1 rounded-full py-5 flex justify-center items-center w-full">
                {`Gagal menghubungkan ke server :'(`}
              </div>
            )}
            {connectedState === 'CONNECTING' && (
              <Loader text="Sedang menghubungkan ke server..." />
            )}
            {callingTab === 'call' ? <TicketCalling /> : <MissedCallList />}
          </div>
        </div>
        <div className="lg:w-1/2 w-7/12 flex flex-wrap content-start border-r border-solid bg-white border-subtle">
          <div
            className={`w-full flex flex-wrap content-start shadow-sm bg-white ${
              sectionMissedCallDetail ? 'hidden' : 'block'
            }`}
            id="element-header-section-appointment"
          >
            <div className="w-full flex flex-wrap items-center bg-light3">
              <div className="w-4/6">
                <LabelTitle text="Perjanjian sementara" fontStyle="font-bold" />
              </div>
              <div className="w-2/6 flex justify-end pr-5">
                {!sectionDataPatient ? (
                  <button
                    className="border border-solid py-1 xl:px-6 px-4 rounded text-xs border-mainColor text-mainColor"
                    onClick={handleSectionPatient}
                  >
                    Tambah
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="w-full py-2 px-5 flex text-dark2 bg-light3">
              <button
                onClick={() => handleClickSectionConfirmationList('confirmed')}
                className={`font-bold xl:text-xs text-xxs ${
                  confirmedListSection === 'confirmed'
                    ? 'border-b-2 border-solid'
                    : ''
                } py-1 mr-5`}
                style={{ borderColor: '#2C528B' }}
              >
                Menunggu Pembayaran
              </button>
              <button
                onClick={() => handleClickSectionConfirmationList('expire')}
                className={`font-bold xl:text-xs text-xxs ${
                  confirmedListSection === 'expire'
                    ? 'border-b-2 border-solid'
                    : ''
                } py-1`}
                style={{ borderColor: '#2C528B' }}
              >
                Pembatalan
              </button>
            </div>
            <div className="w-full py-2 px-5" id="wrap-search">
              <InputSearchWithIcon
                counter={value => handleCounterInputSearch(value)}
              />
            </div>
          </div>
          {sectionMissedCallDetail ? (
            <div
              className={`w-full flex flex-wrap items-start bg-white relative`}
              style={{ height: `${HeightElement}px` }}
            >
              <SectionFormPatient
                type="missed-call"
                hiddenButtonChevronLeft={true}
                hiddenButtonChangeSpecialist={true}
                counterRefferenceId={value => setRefferenceId(value)}
              />
            </div>
          ) : confirmedListSection === 'confirmed' ? (
            <>
              <AppointmentTemporary
                section={1}
                title="Hari ini"
                sectionSecondHeight={sectionSecondHeight / 2}
                search={search}
              />
              <AppointmentTemporary
                section={2}
                title="Kemarin"
                sectionSecondHeight={sectionSecondHeight / 2}
                search={search}
              />
            </>
          ) : (
            <>
              <AppointmentCancel
                section={1}
                title="Hari ini"
                sectionSecondHeight={sectionSecondHeight / 2}
                search={search}
              />
              <AppointmentCancel
                section={2}
                title="Kemarin"
                sectionSecondHeight={sectionSecondHeight / 2}
                search={search}
              />
            </>
          )}
        </div>
      </div>
      <div
        className="lg:w-5/12 w-full flex flex-wrap items-center justify-center relative bg-white lg:pb-10 pb-0 lg:border-none border-t"
        style={{ borderColor: '#D6EDF6' }}
      >
        {sectionDetailAppointmentTemporary && (
          <div
            className={`w-full flex flex-wrap items-start bg-white relative`}
            style={{ height: `${HeightElement}px` }}
          >
            <SectionFormPatient
              type="missed-call"
              hiddenButtonChevronLeft={true}
              hiddenButtonChangeSpecialist={true}
              counterRefferenceId={value => setRefferenceId(value)}
            />
          </div>
        )}
        {sectionAddAppointment ? (
          <div
            className={`w-full flex flex-wrap items-start bg-white relative ${
              sectionDataPatient ? 'block' : 'hidden'
            }`}
            style={{ height: `${HeightElement}px` }}
          >
            <SectionFormPatient />
          </div>
        ) : (
          ''
        )}
        {!sectionAddAppointment ? (
          <div
            className={`w-full flex flex-wrap items-start bg-white overflow-y-auto scroll-small ${
              sectionDataPatient ? 'block' : 'hidden'
            }`}
            style={{ height: `${HeightElement}px` }}
          >
            <DataPatientSearch />
          </div>
        ) : (
          ''
        )}
        {sectionAppointmentDetail && (
          <div className={`w-full ${sectionOrder ? 'block' : 'hidden'}`}>
            <OrderedConsultation
              type="missed-call"
              refferenceId={dataRefferenceId}
            />
          </div>
        )}
        {!sectionDataPatient && !sectionOrder && !sectionMissedCallDetail ? (
          <div className={`${!sectionOrder ? 'block' : 'hidden'}`}>
            <EmptyData text="Pilih untuk melihat detail konsultasi" />
          </div>
        ) : (
          ''
        )}
        {sectionMissedCallDetail ? (
          refferenceId ? (
            <ButtonConsultationHistory
              refferenceId={refferenceId}
              section={{ sectionOrder, sectionMissedCallDetail }}
              clickHandler={value => handlePreviousConsultation(value)}
            />
          ) : (
            <EmptyData text="Tidak ada konsultasi sebelumnya" />
          )
        ) : (
          ''
        )}
      </div>
    </Template>
  );
};

const props = state => ({
  TriggerReducer: state.TriggerReducer.data,
  HeightElementReducer: state.HeightElementReducer.data,
});

const reducer = {
  TriggerUpdate,
  UserDataSelected,
  PatientSelectAction,
  CleanParamsAppointment,
  setCleanParamsAppointment,
};

export default connect(props, reducer)(Home);
