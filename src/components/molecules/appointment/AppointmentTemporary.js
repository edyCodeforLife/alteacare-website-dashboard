import moment from 'moment';
import { connect } from 'react-redux';
import { Api } from '../../../helpers/api';
import { LabelTitle, Appointment } from '../../atoms';
import {
  TriggerUpdate,
  CreateParamsAppointment,
  CleanParamsAppointment,
  UserDataSelected,
  UserDataSelectedId,
} from '../../../modules/actions';
import { useEffect, useState } from '../../../libraries';
import { LocalStorage } from '../../../helpers/localStorage';
import { EmptyData, LoadingComponent } from '../../molecules';
import { PatientSelectAction } from '../../../modules/actions/user/userData__Action';

const AppointmentTemporary = ({
  sectionSecondHeight,
  TriggerUpdate,
  TriggerReducer,
  title,
  search = '',
  section,
  page = 1,
  counterPage = null,
  CreateParamsAppointment,
  CleanParamsAppointment,
  PatientSelectAction,
  UserDataSelected,
  UserDataSelectedId,
}) => {
  const [sectionSecondHeightUpdate, setSectionSecondHeightUpdate] = useState(0);
  const [active, setActive] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(null);
  const [paramsFilter, setParamsFilter] = useState({
    date_start:
      section === 1
        ? moment().add(0, 'days').format('YYYY-MM-DD')
        : moment().add(-1, 'days').format('YYYY-MM-DD'),
    date_end:
      section === 1
        ? moment().add(0, 'days').format('YYYY-MM-DD')
        : moment().add(-1, 'days').format('YYYY-MM-DD'),
    status: ['NEW', 'PROCESS_GP', 'WAITING_FOR_PAYMENT'],
    sort_type: 'DESC',
    keyword: '',
    page: 1,
  });

  useEffect(() => {
    if (refresh) {
      let paramsFilterData = { ...paramsFilter };
      setLoading(true);
      setTotalAppointments(null);
      Api.post(`/appointment/v1/consultation/ongoing`, paramsFilterData, {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
      })
        .then(appointment => {
          setRefresh(false);
          setTotalAppointments(appointment.data.meta.total);
          if (appointment.data.data.length > 0) {
            if (
              paramsFilterData.keyword !== '' &&
              paramsFilterData.page === 1
            ) {
              setAppointments(appointment.data.data);
            } else {
              appointment.data.data.forEach((item, i) => {
                setAppointments(appointments => appointments.concat(item));
              });
            }
          }
          setShowMore(true);
          setLoading(false);
        })
        .catch(error => {
          setRefresh(false);
          if (paramsFilterData.keyword !== '' && paramsFilterData.page === 1) {
            setAppointments([]);
          }
          setShowMore(false);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    setRefresh(true);
    setAppointments([]);
    setParamsFilter({
      ...paramsFilter,
      keyword: `${search ? search : ''}`,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    let headerHeight = document.getElementById(
      'header-appointments-list'
    ).clientHeight;
    setSectionSecondHeightUpdate(
      parseInt(sectionSecondHeight) - parseInt(headerHeight)
    );
  }, [sectionSecondHeight]);

  useEffect(() => {
    setRefresh(true);
  }, [paramsFilter.page]);

  useEffect(() => {
    if (TriggerReducer && TriggerReducer.refreshAppointmentTemporary) {
      setAppointments([]);
      setRefresh(true);
      TriggerUpdate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer]);

  const handleCounter = async appointment => {
    setActive(appointment.id);
    if (!['NEW', 'PROCESS_GP'].includes(appointment.status)) {
      TriggerUpdate({
        page: 'home',
        trigger: 'open-order',
        AppointmentId: appointment.id,
        appointmentStatus: appointment.status,
      });

      return;
    }

    if (['NEW', 'PROCESS_GP'].includes(appointment.status)) {
      CleanParamsAppointment();
      UserDataSelectedId(null);
      const appointmentDetail = await getAppointmentDetail(appointment.id);
      if (appointmentDetail) {
        const userDetail = await getSelectedUser(
          appointmentDetail.parent_user.id
        );
        const medicalDocument = [];
        UserDataSelected(userDetail);
        PatientSelectAction(appointmentDetail?.patient || null);
        UserDataSelectedId({ appointmentId: appointmentDetail.id });
        if (
          appointmentDetail.medical_document &&
          appointmentDetail.medical_document.length > 0
        ) {
          appointmentDetail.medical_document.forEach((doc, idx) => {
            medicalDocument.push(doc.file_id);
          });
        }

        CreateParamsAppointment({
          appointment_id: appointmentDetail.id,
          doctor_id: appointmentDetail.doctor.id,
          user_id: appointmentDetail.user_id,
          patient_id: appointmentDetail.patient_id,
          symptom_note: appointmentDetail.symptom_note || '',
          schedules: [
            {
              code: appointmentDetail.schedule.code,
              date: appointmentDetail.schedule.date,
              time_start: moment(
                appointmentDetail.schedule.time_start,
                'HH:mm:ss'
              ).format('HH:mm'),
              time_end: moment(
                appointmentDetail.schedule.time_end,
                'HH:mm:ss'
              ).format('HH:mm'),
            },
          ],
          document_resume: medicalDocument,
        });
      }

      TriggerUpdate({
        detailAppointmentTemporary: true,
      });
    }
  };

  const pagination = () => {
    setParamsFilter({ ...paramsFilter, page: paramsFilter.page + 1 });
  };

  const getAppointmentDetail = appointmentId => {
    return Api.get(`/appointment/v1/consultation/${appointmentId}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(res => {
        return res.data.data;
      })
      .catch(error => {
        return null;
      });
  };

  const getSelectedUser = userId => {
    return Api.get(`/user/users/${userId}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(res => {
        return res.data.data;
      })
      .catch(error => {
        return null;
      });
  };

  return (
    <div
      className="flex flex-wrap content-start w-full relative"
      style={{ height: `${sectionSecondHeight}px` }}
    >
      <div id="header-appointments-list" className="w-full block">
        <LabelTitle text={title} />
      </div>
      <div
        className="w-full mt-1 relative block overflow-y-auto scroll-small pb-2"
        style={{ height: `${sectionSecondHeightUpdate}px` }}
      >
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => {
            return (
              <div className="w-full" key={index}>
                <Appointment
                  key={index}
                  name={appointment.user.name}
                  date={appointment.schedule ? appointment.schedule.date : null}
                  time={
                    appointment.schedule
                      ? appointment.schedule.time_start
                      : null
                  }
                  value={appointment.id}
                  counter={value => handleCounter(appointment)}
                  active={appointment.id === active ? true : false}
                />
              </div>
            );
          })
        ) : !loading && appointments.length < 1 ? (
          <div className="w-full h-full absolute inset-y-0 my-auto flex items-center">
            <EmptyData text="tidak ada perjanjian disini" styleWrap="my-0" />
          </div>
        ) : (
          ''
        )}
        {showMore &&
        totalAppointments &&
        totalAppointments > appointments.length ? (
          <button
            onClick={() => pagination()}
            className="w-full text-mainColor flex flex-wrap justify-center text-sm mt-5 mb-2"
          >
            <span className="w-full text-center text-xs mb-2">
              Tampilkan Lebih
            </span>
          </button>
        ) : (
          ''
        )}
        {loading ? (
          <div className="w-full h-full absolute inset-y-0 my-auto flex items-center bg-white">
            <LoadingComponent />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  TriggerReducer: state.TriggerReducer.data,
});

const reducer = {
  TriggerUpdate,
  PatientSelectAction,
  CleanParamsAppointment,
  CreateParamsAppointment,
  UserDataSelected,
  UserDataSelectedId,
};

export default connect(mapStateToProps, reducer)(AppointmentTemporary);
