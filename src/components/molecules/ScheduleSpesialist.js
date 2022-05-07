import moment from 'moment'
import { connect } from 'react-redux'
import { EmptyData } from '/';
import { GetWeek } from '../../helpers/dateWeek'
import { React, useState, DatePicker, forwardRef, useEffect } from '../../libraries'
import { FormatNewDate } from '../../helpers/dateFormat'
import { Api } from '../../helpers/api'
import { CreateParamsAppointment, TriggerUpdate } from '../../modules/actions'
import { ButtonDarkGrey, LabelTitle, ButtonDefault } from '../atoms'
import { CalendarMd, AlertcloseBlue, ArrowDown, ArrowUp } from '../../assets/images'
import "react-datepicker/dist/react-datepicker.css";

const ScheduleSpesialist = ({
  withoutHeightHeader,
  TriggerUpdate,
  doctorSelect,
  ParamsAppointment,
  CreateParamsAppointment,
  disabledFromOrdered,
  isUpdateSpesialist,
  counterCloseFromOrderedSchedule,
  counterClose
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  // const [paramsAppointmentLocal, setParamsAppointmentDataLocal] = useState({});
  const [daySchedule, setDaySchedule] = useState([]);
  const padding = window.location.pathname.includes("call") ? "pb-10" : "pb-5";

  const ExampleCustomInput = forwardRef(
    ({ value, onClick }, ref) => (
      <button className="example-custom-input" onClick={onClick} ref={ref}>
        <span className="text-sm" style={{ color: "#61C7B5" }}>Set Date</span>
        <img src={CalendarMd} alt="Calendar Md Icon" className="inline ml-3" />
      </button>
    ),
  )

  useEffect(() => {
    const weeks = GetWeek()
    const day = [ "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu" ]

    // const filterDate = (moment(startDate).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) ? startDate : date;

    if (weeks.length > 0) {
      weeks.map(async (week, index) => {
        let description
        const dataScheduleTime = await getScheduleData(moment(week).format("YYYY-MM-DD"))

        if (index < 1) description = "Hari ini"
        else if (index < 3) description = day[week.getDay(index)]
        else description = await FormatNewDate(week)

        setDaySchedule(daySchedule => [...daySchedule, {
          text: description,
          date: week,
          scheduleTime: dataScheduleTime,
          accordionOpen: false
        }])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    new Promise(async (resolve) => {
      const date = moment(startDate).format('YYYY-MM-DD');
      const now = moment().format('YYYY-MM-DD');

      if (date !== now) {
        const schedules = await getScheduleData(date)

        setDaySchedule([{
          text: FormatNewDate(startDate),
          date: startDate,
          scheduleTime: schedules,
          accordionOpen: false
        }])
      }

      resolve();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate])

  useEffect(() => {
    if (ParamsAppointment.schedules.length > 0) {
      setSchedule(ParamsAppointment.schedules)
    }
  }, [ParamsAppointment])

  const oneScheduleHandler = (value) => {
    const schedules = [...daySchedule];

    schedules.map((item, idx) => {
      return item.scheduleTime.map((data) => {
        data.selected = false

        if (value.id === data.code) {
          data.selected = true;
          setSchedule([{
            code: data.code,
            date: data.date,
            time_start: data.start_time,
            time_end: data.end_time
          }]);
        }

        return data;
      })
    });

    setDaySchedule(schedules);
  }

  // const multipleScheduleHandler = (value) => {
  //   let dayScheduleData = [...daySchedule]
  //   let dataValue = dayScheduleData[value.parentIndex].scheduleTime[value.dataIndex]
  //   dayScheduleData[value.parentIndex].scheduleTime[value.dataIndex].selected = !dataValue.selected
  //   setDaySchedule(dayScheduleData)
  //   setSchedule(schedule => [...schedule, {
  //     code: dataValue.code,
  //     date: dataValue.date,
  //     time_start: dataValue.start_time,
  //     time_end: dataValue.end_time
  //   }])


    // ParamsAppointmentData.schedules = [...ParamsAppointment.schedules, dayScheduleData[value.parentIndex].scheduleTime[value.dataIndex]]
    // console.log(ParamsAppointmentData)
    // let ParamsAppointmentDataSchedules = []
    // let resultParam = []
    // listData.map((res, idx) => {
    //   if(res.selected){
    //     resultParam[idx] = {
    //       id: res.schedule_id,
    //       date: res.date,
    //       time_start: res.start_time,
    //       time_end: res.end_time
    //     }
    //   }
    //   return resultParam
    // })
    // ParamsAppointmentDataSchedules = resultParam
    // ParamsAppointmentData.schedules = ParamsAppointmentDataSchedules
    // ParamsAppointmentData.doctor_id = doctorSelect
    // setParamsAppointmentDataLocal(ParamsAppointmentData)
    // console.log("ParamsAppointmentData", ParamsAppointmentData)
  // }

  useEffect(() => {
    let ParamsAppointmentData = {...ParamsAppointment}
    let scheduleValue = [];
    if(schedule.length > 0) scheduleValue = schedule;
    else scheduleValue = ParamsAppointmentData.schedules;
    ParamsAppointmentData.schedules = scheduleValue
    CreateParamsAppointment(ParamsAppointmentData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule])

  const handleCounterButtonDarkGray = () => {
    let ParamsAppointmentData = {...ParamsAppointment}
    ParamsAppointmentData.doctor_id = doctorSelect
    // console.log(ParamsAppointmentData)
    CreateParamsAppointment(ParamsAppointmentData)

    // console.log("disabledFromOrdered", disabledFromOrdered)

    if(disabledFromOrdered){
      // console.log("here 1")
      TriggerUpdate({
        updateAppointmentTrigger: true,
        closeSpesialistListOrdered: true
      })
      if(counterCloseFromOrderedSchedule !== "") counterCloseFromOrderedSchedule();
      else counterClose();
    } else if(isUpdateSpesialist){
      // console.log("here 2")
      TriggerUpdate({
        updateAppointmentTrigger: true,
        closeSpesialistListOrdered: true
      })
    } else {
      // console.log("here 3")
      counterClose()
    }
  }

  const getScheduleData = async (date) => {
    const schedules = [];
    const scheduleData = [];
    await Api.get('/data/doctor-schedules', {
      params: {
        date,
        doctor_id: doctorSelect,
        limitHourScheduleFromNow: 0,
      }
    }).then((response) => {
      schedules.push(...response.data.data);
    }).catch((error) => {
      if (error.response && error.response.status === 404) setSchedule([]);
    });

    if (schedules.length > 0) {
      schedules.forEach((schedule, index) => {
        scheduleData.push({ ...schedule, selected: false})
      })
    }

    return scheduleData;
  }

  const handleCloseSchedule = () => {
    if(disabledFromOrdered){
      if(counterCloseFromOrderedSchedule !== "") counterCloseFromOrderedSchedule();
      else counterClose();
    } else {
      counterClose()
    }
  }

  const handleAccordion = (idx) => {
    let dayScheduleData = [...daySchedule];
    daySchedule.forEach((resDaySchedule, idxDaySchedule) => {
      if(idxDaySchedule !== idx)
        dayScheduleData[idxDaySchedule].accordionOpen = false;
    })
    dayScheduleData[idx].accordionOpen = !dayScheduleData[idx].accordionOpen;
    // console.log(idx)
    setDaySchedule(dayScheduleData);
  }

  // useEffect(() => {
  //   console.log("daySchedule", daySchedule)
  // }, [daySchedule])

  return(
    <div className="flex flex-wrap items-start content-start absolute z-10 left-0 top-0 overflow-y-auto scroll-small w-full h-full bg-white pt-6 pb-10">
      {/* {disabledFromOrdered ?  */}
        <div className="w-full px-6 py-2 flex flex-wrap items-center justify-between bg-light3">
          <div className="text-dark2 font-bold text-lg">Reschedule</div>
          <div className="text-info2 flex items-center justify-end">
            <img alt="close" src={AlertcloseBlue} className="inline ml-4 cursor-pointer" onClick={() => handleCloseSchedule()} />
          </div>
        </div>
      {/* : ""} */}
      <div className="w-full px-6 pt-2 flex flex-wrap items-center">
        <div className="w-8/12 flex flex-wrap items-center">
          <p className="w-full flex flex-wrap items-center">
            <span className="w-full text-sm text-left font-bold" style={{ color: "#2C528B" }}>Choose Schedule</span>
            <span className="w-full text-xs text-left" style={{ color: "#61C7B5" }}>Displays the next 7 days schedule</span>
          </p>
        </div>
        <div className="w-4/12 flex justify-end items-start custom-date-picker">
          <DatePicker
            todayButton="Batal Pilih"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            customInput={<ExampleCustomInput />}
          />
        </div>
      </div>
      <div className="w-full pb-4">
        {daySchedule.length > 0 ?
          daySchedule.sort((itemFirst, itemSecond) => {
            return new Date(itemFirst.date) - new Date(itemSecond.date);
          }).map((res, idx) => {
            return (
              <div key={idx}>
                <LabelTitle text={res.text} dimension={"py-2 px-6 mt-5"} />
                {res.scheduleTime.length > 0 ?
                  <>
                    <div
                      className={`flex flex-wrap items-center pt-2 justify-left px-5 transition-all duration-1000 ${!res.accordionOpen ? "h-20 overflow-y-hidden" : "max-h-full"}`}
                    >
                      {res.scheduleTime.map((res2, idx2) => {
                        return (
                          <div key={idx2} className="w-1/3 px-1">
                            <ButtonDefault
                              className={`w-full border border-solid h-8 flex items-center justify-center px-3 rounded text-xs mb-2 ${res2.selected ? "bg-mainColor text-white" : "bg-white text-mainColor"}`}
                              borderColor="#61C7B5"
                              value={{
                                id: `${res2.code}`,
                                date: `${res2.date}`,
                                time_start: `${res2.start_time}`,
                                time_end: `${res2.end_time}`,
                                parentIndex: idx,
                                dataIndex: idx2
                              }}
                              counter={(value) => oneScheduleHandler(value)}
                              text={`${res2.start_time} - ${res2.end_time}`}
                            />
                          </div>
                        )
                      })}
                    </div>
                    {res.scheduleTime.length > 6 ?
                      <button
                        onClick={() => handleAccordion(idx)}
                        className="w-full mt-2 py-1 flex justify-center text-mainColor"
                      >
                        <img src={!res.accordionOpen ? ArrowDown : ArrowUp} alt="Arrow Down Icon" />
                      </button>
                    : ""}
                  </>
                : <EmptyData text="Tidak Ada Jadwal Pada Tanggal Ini" /> }
              </div>
            )
          })
        : <EmptyData text="Dokter Ini Belum Memiliki Jadwal" /> }
      </div>
      <div className={`w-full px-5 relative bottom-0 ${padding}`}>
        <ButtonDarkGrey
          text="Terapkan"
          dimension="w-full"
          counter={() => handleCounterButtonDarkGray()}
        />
      </div>
    </div>
  )
}

ScheduleSpesialist.defaultProps = {
  withoutHeightHeader: false,
  doctorSelect: "",
  isUpdateSpesialist: false,
  disabledFromOrdered: false,
  counterClose: "",
  counterCloseFromOrderedSchedule: ""
}

const mapStateToProps = (state) => ({
  ParamsAppointment: state.ParamCreateAppointment.data
})

const mapDispatchToProps = {
  CreateParamsAppointment,
  TriggerUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSpesialist)
