import { React, useState, useEffect } from '../../libraries';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import useShallowEqualSelector from '../../helpers/useShallowEqualSelector';
import { setTriggerUpdate } from '../../modules/actions';
import { Template } from '../molecules/layout';
import { InputSearchWithIcon, FilterDoctorSpesialist } from '../molecules';
import { OrderedConsultation } from '../molecules/orderConsultation';
import { AppointmentList } from '../molecules/appointment';
import { FilterIcon } from '../../assets/images';
import { LocalStorage } from '../../helpers/localStorage';

const Appointment = () => {
  const role = LocalStorage('role');
  const dispatch = useDispatch();
  const [tab, setTab] = useState(1);
  const [loadList, setLoadList] = useState(false);
  const [filterSectionFirst, setFilterSectionFirst] = useState(false);
  const [keyword, setKeyword] = useState('');

  const [heightElement, setHeightElement] = useState(0);
  const [sectionFirstHeight, setSectionFirstHeight] = useState(0);
  const [filterParam, setFilterParam] = useState({
    specialist: [],
    hospitals: [],
    date: null,
  });
  const {
    HeightElementReducer,
    TriggerReducer,
    FilterSpesialistReducer,
    FilterHospitalsReducer,
  } = useShallowEqualSelector(state => state);

  useEffect(() => {
    if (HeightElementReducer.data !== null) {
      const heightHeader = document.getElementById('panel-header').clientHeight;
      setHeightElement(HeightElementReducer.data.heightElement);
      setSectionFirstHeight(
        parseInt(HeightElementReducer.data.heightElement) -
          parseInt(heightHeader)
      );
    }
  }, [HeightElementReducer.data]);

  useEffect(() => {
    if (TriggerReducer.data !== null) {
      if (TriggerReducer.data.closeFilterSpesialist) {
        setFilterSectionFirst(false);
        dispatch(setTriggerUpdate(null));
      }
      if (TriggerReducer.data.closeOrderedConsultation) {
        // setOrderData(false);
        dispatch(setTriggerUpdate(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer.data]);

  const handleChange = debounce(value => {
    setKeyword(value);
  }, 700);

  const changeTab = value => {
    setTab(value);
    setLoadList(!loadList);
  };

  const handleCounterFilterDoctor = data => {
    setFilterParam({
      ...filterParam,
      specialist: FilterSpesialistReducer.data,
      hospitals: FilterHospitalsReducer.data,
      date: data && data.filterDate ? data.filterDate : null,
    });
  };

  const handleCounterAppointmentList = value => {
    dispatch(setTriggerUpdate({ AppointmentId: value }));
  };

  return (
    <Template
      enableCallMA={role === 'MA'}
      active="appointment"
      HeightElement={heightElement}
    >
      <div className="w-2/4 border-r border-solid bg-white relative">
        <div id="panel-header">
          <div className="w-full py-2 px-3 bg-light3 text-dark2">
            <button
              className={`font-bold text-xs py-1 mr-5 ${
                tab === 1 ? 'border-b-2 border-solid border-info2' : ''
              }`}
              onClick={() => changeTab(1)}
            >
              Berjalan
            </button>
            <button
              className={`font-bold text-xs py-1 mr-5 ${
                tab === 2 ? 'border-b-2 border-solid border-info2' : ''
              }`}
              onClick={() => changeTab(2)}
            >
              Selesai
            </button>
            <button
              className={`font-bold text-xs py-1 ${
                tab === 3 ? 'border-b-2 border-solid border-info2' : ''
              }`}
              onClick={() => changeTab(3)}
            >
              Dibatalkan
            </button>
          </div>
          <div className="w-full py-2 px-3 flex flex-wrap items-center">
            <div className="w-11/12 pr-3">
              <InputSearchWithIcon counter={value => handleChange(value)} />
            </div>
            <div className="w-1/12 flex justify-center items-center">
              <img
                src={FilterIcon}
                alt="Filter Icon"
                onClick={() => setFilterSectionFirst(true)}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div
          className="overflow-y-auto scroll-small border-l border-solid border-light3 relative"
          style={{
            height: sectionFirstHeight + 'px',
          }}
        >
          {tab === 1 ? (
            <AppointmentList
              keyword={keyword}
              filter={filterParam}
              sectionFirstHeight={sectionFirstHeight}
              counter={value => handleCounterAppointmentList(value)}
              loadList={loadList}
              type="not-done"
            />
          ) : (
            ''
          )}
          {tab === 2 ? (
            <AppointmentList
              keyword={keyword}
              filter={filterParam}
              sectionFirstHeight={sectionFirstHeight}
              counter={value => handleCounterAppointmentList(value)}
              loadList={loadList}
              type="done"
            />
          ) : (
            ''
          )}
          {tab === 3 ? (
            <AppointmentList
              keyword={keyword}
              filter={filterParam}
              sectionFirstHeight={sectionFirstHeight}
              counter={value => handleCounterAppointmentList(value)}
              loadList={loadList}
              type="cancel"
            />
          ) : (
            ''
          )}
        </div>

        {filterSectionFirst ? (
          <div
            className="fixed w-full h-full left-0 top-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <div className="xl:w-4/12 w-5/12 h-1/2 absolute z-10 left-0 inset-y-0 m-auto ml-28 bg-white">
              <FilterDoctorSpesialist
                withoutHeightHeader={true}
                counter={value => handleCounterFilterDoctor(value)}
                hiddenFilterPrice={true}
                dateFilterDefault={filterParam.date ? filterParam.date : null}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>

      <div className="w-2/4 flex flex-wrap relative">
        <div className={`w-full`}>
          <OrderedConsultation
            enableRefund={true}
            counterReloadList={() => setLoadList(!loadList)}
            isEnableUpdateAppointment={true}
          />
        </div>
      </div>
    </Template>
  );
};

export default Appointment;
