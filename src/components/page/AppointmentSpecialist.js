/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import { LabelTitle } from '../atoms';
import { LoadingComponent, NotFoundCall } from '../molecules';
import { DetailCallSection } from '../molecules/appointmentSpecialist';
import { Template } from '../molecules/layout';
import { CalenderIcon, ClockIcon, VideoOnWhite } from '../../assets/images';
import { Api } from '../../helpers/api';
import { dayFormat } from '../../helpers/dateFormat';
import { LocalStorage } from '../../helpers/localStorage';
import useShallowEqualSelector from '../../helpers/useShallowEqualSelector';
import {
  React,
  useEffect,
  useState,
  useHistory,
  DatePicker,
  forwardRef,
} from '../../libraries';

const AppointmentSpecialist = () => {
  const history = useHistory();
  const [tab, setTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [HeightElement, setHeightElement] = useState(0);
  const [sectionFirstHeight, setSectionFirstHeight] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [sectionFormPatient, setSectionFormPatient] = useState(false);
  const { HeightElementReducer } = useShallowEqualSelector(state => state);
  const [dataDetailCallSection, setDataDetailCallSection] = useState({
    userId: null,
  });
  const [labelDay, setLabelDay] = useState('Perjanjian Konsultasi Hari Ini');
  const [params, setParams] = useState({
    status: [
      'PAID',
      'ON_GOING',
      'MEET_SPECIALIST',
      'WAITING_FOR_MEDICAL_RESUME',
    ],
    schedule_date_start: moment().add(0, 'days').format('YYYY-MM-DD'),
    schedule_date_end: moment().add(0, 'days').format('YYYY-MM-DD'),
    page: 1,
  });

  useEffect(() => {
    setLoading(true);
    let url;
    if (tab === 1) {
      url = '/appointment/v1/consultation/ongoing';
    } else {
      url = '/appointment/v1/consultation/history';
    }
    Api.post(url, params, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(response => {
        if (isRefresh) {
          setAppointments(response.data.data);
        }

        if (!isRefresh) {
          setAppointments([...appointments, ...response.data.data]);
        }
        setTotal(response.data.meta.total);
        setLoading(false);
      })
      .catch(function () {
        setLoading(false);
      });
    setIsRefresh(false);
  }, [params]);

  useEffect(() => {
    if (HeightElementReducer.data.data !== null) {
      const heightHeader = document.getElementById('panel-header').clientHeight;
      setHeightElement(HeightElementReducer.data.heightElement);
      setSectionFirstHeight(
        parseInt(HeightElementReducer.data.heightElement) -
          parseInt(heightHeader)
      );
    }
  }, [HeightElementReducer.data]);

  const handleFirstSection = value => {
    setSectionFormPatient(false);
    setIsRefresh(true);
    if (value === 1) {
      setParams({
        ...params,
        status: [
          'PAID',
          'ON_GOING',
          'MEET_SPECIALIST',
          'WAITING_FOR_MEDICAL_RESUME',
        ],
        page: 1,
      });
    } else {
      setParams({
        ...params,
        status: ['COMPLETED'],
        page: 1,
      });
    }
    setTab(value);
    setAppointments([]);
    setTotal(0);
  };

  const handleCounterTicket = data => {
    if (data) {
      if (data.startVideoCallFunc) {
        try {
          const objCalling = {
            name: 'CALL_SP',
            appointmentId: data.id,
            userId: data.userId,
          };

          const strCalling = JSON.stringify(objCalling);
          const encodedCalling = Buffer.from(strCalling).toString('base64');
          history.push(`/call/${encodedCalling}`);
        } catch (error) {
          console.error(error);
        }
      } else if (data.detailCallSection) {
        setDataDetailCallSection({
          userId: data.userId,
          orderCode: data.orderCode,
          appointmentId: data.appointmentId,
        });
        setSectionFormPatient(true);
      } else if (data.backSectionDetailCall) {
        setSectionFormPatient(false);
      }
    }
  };

  const DetailCallSectionData = data => {
    if (data && data.backSectionDetailCall) setSectionFormPatient(false);
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      onClick={onClick}
      ref={ref}
      className="px-5 text-mainColor text-sm flex items-center"
    >
      {`${dayFormat(moment(params.schedule_date_start).day())}, ${moment(
        params.schedule_date_start
      ).format('DD MMM Y')}`}
      <img src={CalenderIcon} alt="Calender Icon" className="inline ml-4" />
    </button>
  ));

  const changeDate = date => {
    const newDate = moment(date, 'YYYY-MM-DD');
    const isToday = moment().isSame(newDate, 'day');
    if (isToday) {
      setLabelDay('Perjanjian Konsultasi Hari Ini');
    }

    if (!isToday) {
      setLabelDay(
        `Perjanjian Konsultasi ${dayFormat(moment(newDate).day())}, ${moment(
          newDate
        ).format('DD MMM Y')}`
      );
    }

    setAppointments([]);
    setTotal(0);
    setIsRefresh(true);
    setParams({
      ...params,
      schedule_date_start: newDate.format('YYYY-MM-DD'),
      schedule_date_end: newDate.format('YYYY-MM-DD'),
      page: 1,
    });
  };

  const nextPage = () => {
    setParams({
      ...params,
      page: (params.page += 1),
    });
  };

  return (
    <Template active="appointment" HeightElement={HeightElement}>
      <div className="w-full border-r border-solid bg-white relative">
        <div id="panel-header">
          <div className="py-2 px-3 flex text-dark2 bg-light4">
            <button
              className={`font-bold text-xs ${
                tab === 1 ? 'border-b-2 border-solid border-info2' : ''
              } py-1 mr-5`}
              onClick={() => handleFirstSection(1)}
            >
              Berjalan
            </button>
            <button
              className={`font-bold text-xs ${
                tab === 2 ? 'border-b-2 border-solid border-info2' : ''
              } py-1`}
              onClick={() => handleFirstSection(2)}
            >
              Selesai
            </button>
          </div>
          <div className="bg-light3 flex justify-between items-center">
            <div className="w-1/2">
              <LabelTitle text={labelDay} />
            </div>
            <div className="w-1/2 flex justify-end custom-date-picker-specialist-call">
              <DatePicker
                selected={new Date(`${params.schedule_date_start}`)}
                onChange={date => changeDate(date)}
                customInput={<ExampleCustomInput />}
              />
            </div>
          </div>
        </div>
        {!sectionFormPatient ? (
          <div
            className="overflow-y-auto scroll-small border-l border-solid border-light3"
            style={{ height: `${sectionFirstHeight}px` }}
          >
            {appointments.length > 0 && (
              <>
                {appointments.map((item, idx) => (
                  <div key={idx}>
                    <Ticket
                      item={item}
                      counter={value => handleCounterTicket(value)}
                    />
                  </div>
                ))}
                <div className="pb-5"></div>
              </>
            )}
            {total > 0 && appointments.length < total && (
              <div className="w-full flex justify-center pb-5">
                <button className="text-mainColor" onClick={() => nextPage()}>
                  Tampilkan lebih
                </button>
              </div>
            )}
            {appointments.length < 1 && !loading && (
              <div
                className="relative"
                style={{ height: `${sectionFirstHeight}px` }}
              >
                <NotFoundCall />
              </div>
            )}
            {loading && (
              <div
                className="relative"
                style={{ height: `${sectionFirstHeight}px` }}
              >
                <div className="absolute w-full h-full inset-0 bg-white z-10">
                  <LoadingComponent />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-l border-solid border-light3">
            <DetailCallSection
              data={dataDetailCallSection}
              sectionFirstHeight={sectionFirstHeight}
              counter={value => DetailCallSectionData(value)}
            />
          </div>
        )}
      </div>
    </Template>
  );
};

const Ticket = ({ counter = () => {}, item }) => {
  return (
    <div className="w-full pt-2 xl:px-6 px-3">
      <div className="rounded pb-1 shadow">
        <div
          className="px-4 py-2 border-b border-solid flex items-center justify-between text-dark3"
          style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <span>Order ID - {item.order_code}</span>
          <span
            className="py-1 px-2 text-xs rounded"
            style={{
              backgroundColor: `${item.status_detail.bg_color}`,
              color: `${item.status_detail.text_color}`,
            }}
          >
            {item.status_detail.label}
          </span>
        </div>
        <div className="w-full flex flex-wrap items-center px-4 py-1">
          <div className="lg:w-8/12 w-9/12 flex flex-wrap items-center">
            <p className="text-left py-1 text-dark3 font-bold">
              {item.user.name}
            </p>
            <div className="w-full py-1 text-sm text-dark2">
              <img
                src={CalenderIcon}
                alt="Calender Icon"
                className="inline mr-2"
              />
              {item.schedule
                ? `${dayFormat(moment(item.schedule.date).day())}, ${moment(
                    item.schedule.date
                  ).format('DD MMM Y')}`
                : 'Schedule Tidak Ditemukan'}
            </div>
            <div className="w-full py-1 text-sm" style={{ color: '#6B7588' }}>
              <img
                src={ClockIcon}
                alt="Calender Icon"
                className="inline mr-2"
              />
              {`${moment(item.schedule.time_start, 'HH:mm:ss').format(
                'HH:mm'
              )} - ${moment(item.schedule.time_end, 'HH:mm:ss').format(
                'HH:mm'
              )}`}
            </div>
          </div>
          <div className="lg:w-4/12 w-3/12">
            {item.status === 'MEET_SPECIALIST' || item.status === 'ON_GOING' ? (
              <button
                className="w-full xl:text-sm text-xs text-white rounded-full py-2 flex justify-center items-center bg-success3"
                onClick={() =>
                  counter({
                    startVideoCallFunc: true,
                    id: item.id,
                    userId: item.user?.id || '',
                  })
                }
              >
                <img
                  src={VideoOnWhite}
                  alt="Video On White Icon"
                  className="inline mr-2 w-3"
                />
                Open
              </button>
            ) : (
              <button
                className="w-full xl:text-sm text-xs rounded-full py-2 flex justify-center items-center border border-solid border-mainColor text-mainColor"
                onClick={() =>
                  counter({
                    detailCallSection: true,
                    userId: item.user.id,
                    orderCode: item.order_code,
                    appointmentId: item.id,
                  })
                }
              >
                Lihat Detail
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSpecialist;
