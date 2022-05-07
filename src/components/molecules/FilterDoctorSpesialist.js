import { React, useState, useEffect, axios, DatePicker, forwardRef } from '../../libraries'
import moment from 'moment'
import { connect } from 'react-redux'
import { Api } from '../../helpers/api'
import { dayFormat } from '../../helpers/dateFormat'
import { TriggerUpdate, FilterSpesialist, FilterHospitals, FilterPrice  } from '../../modules/actions'
import { ButtonTextAndBorderBlue, ButtonDarkGrey } from '../atoms'
import { FilterDoctorSpesialistCheckbox, FilterDoctorHospitalsCheckbox } from '../molecules'
import { AlertClose, CalenderIcon } from '../../assets/images'
import "react-datepicker/dist/react-datepicker.css";

const FilterDoctorSpesialist = ({
  counter,
  TriggerReducer,
  TriggerUpdate,
  FilterSpesialist,
  FilterHospitals,
  FilterPrice,
  dateFilterDefault,
  FilterSpesialistReducer,
  FilterHospitalsReducer,
  FilterPriceReducer,
  withoutHeightHeader,
  hiddenFilterPrice = false
}) => {
  const filterDateStatus = window.location.pathname.includes("appointment") ? true : false;
  // const [selected, setSelected] = useState([]);
  const [dateFilter, setDateFilter] = useState(dateFilterDefault ? dateFilterDefault : new Date())
  const [dateFilterData, setDateFilterData] = useState(null)
  const [frameFilterCheckBox, setFrameFilterCheckBox] = useState(false)
  const [frameFilterCheckBoxHospital, setFrameFilterCheckBoxHospital] = useState(false)
  const [dataSpesialist, setDataSpesialist] = useState([])
  // const [dataSpesialistReducer, setDataSpesialistReducer] = useState([])
  const [dataHospitals, setDataHospitals] = useState([])
  // const [urlFilter, setUrlFilter] = useState("")
  const [loadSpesialist, setLoadSpesialist] = useState(false)
  const [loadSpesialistReducer, setLoadSpesialistReducer] = useState(false)
  const [loadHospitals, setLoadHospitals] = useState(false)
  const [loadHospitalsReducer, setLoadHospitalsReducer] = useState(false)
  const [loadPrice, setLoadPrice] = useState(false)
  const [loadPriceReducer, setLoadPriceReducer] = useState(false)
  const [dataPrice, setDataPrice] = useState([
    {
      text: "",
      value: "",
      type: "min",
      selected: false
    },
    {
      text: "",
      value: "",
      type: "middle",
      selected: false
    },
    {
      text: "",
      value: "",
      type: "max",
      selected: false
    }
  ])

  const ExampleCustomInput = forwardRef(
    ({ value, onClick }, ref) => (
      <button className="example-custom-input" onClick={onClick} ref={ref}>
        Pilih Tanggal <img src={CalenderIcon} alt="Calender Icon" className="inline ml-2" />
      </button>
    ),
  )

  const handleClickSectionChange = (value) => {
    if(value === "spesialist"){
      setFrameFilterCheckBox(!frameFilterCheckBox)
    } else if(value === "hospital") {
      setFrameFilterCheckBoxHospital(!frameFilterCheckBoxHospital)
    }
  }

  const handleClickCloseFilterSpesialist = () => {
    TriggerUpdate({
      closeFilterSpesialist: true
    })
  }

  const handleCounterButtonSpesialist = (value) => {
    let listData = [...dataSpesialist]
    let status = !listData[value.dataIndex].selected
    listData[value.dataIndex].selected = status
    setDataSpesialist(listData)
    // counter(value);
    if(status){
      FilterSpesialist([
        ...FilterSpesialistReducer,
        {
          specialization_id: listData[value.dataIndex].specialization_id,
          name: listData[value.dataIndex].name
        }
      ])
    } else {
      if(FilterSpesialistReducer.length > 0){
        let dataUnRemove = FilterSpesialistReducer.filter(FilterSpesialistReducer => FilterSpesialistReducer.specialization_id !== listData[value.dataIndex].specialization_id)
        FilterSpesialist(dataUnRemove)
      }
    }
  }

  const handleCounterButtonHospital = (value) => {
    let listData = [...dataHospitals]
    let status = !listData[value.dataIndex].selected
    listData[value.dataIndex].selected = status
    setDataHospitals(listData)
    // counter({
    //   hospital_id: listData[value.dataIndex].hospital_id,
    //   name: listData[value.dataIndex].name
    // });

    if(status){
      FilterHospitals([
        ...FilterHospitalsReducer,
        {
          hospital_id: listData[value.dataIndex].hospital_id,
          name: listData[value.dataIndex].name
        }
      ])
    } else {
      if(FilterHospitalsReducer.length > 0){
        let dataUnRemove = FilterHospitalsReducer.filter(FilterHospitalsReducer => FilterHospitalsReducer.hospital_id !== listData[value.dataIndex].hospital_id)
        FilterHospitals(dataUnRemove)
      }
    }
  }

  const handleCounterButtonPrice = (value) => {
    let listData = [...dataPrice]
    let status = !listData[value.dataIndex].selected
    listData[value.dataIndex].selected = status
    setDataPrice(listData)
    // counter({
    //   price_id: data.dataIndex + 1,
    //   price: data.value,
    // });

    if(status){
      FilterPrice([
        ...FilterPriceReducer,
        {
          value: listData[value.dataIndex].value,
          name: listData[value.dataIndex].text,
          type: listData[value.dataIndex].type
        }
      ])
    } else {
      if(FilterPriceReducer.length > 0){
        let dataUnRemove = FilterPriceReducer.filter(FilterPriceReducer => FilterPriceReducer.value !== listData[value.dataIndex].value)
        FilterPrice(dataUnRemove)
      }
    }
  }

  const handleCounterButtonDarkGray = () => {
    if(filterDateStatus){
      counter({
        filterDate: dateFilterData
      })
    } else {
      counter()
    }
    TriggerUpdate({
      closeFilterSpesialist: true
    })
  }

  const handleSetFilterDate = (value) => {
    setDateFilter(value)
    setDateFilterData(value)
  }

  const handleCounterButtonResetFilter = () => {
    let dataSpesialistUpdate = [...dataSpesialist]
    if(dataSpesialist.length > 0){
      dataSpesialist.forEach((res, idx) => {
        dataSpesialistUpdate[idx] = {
          specialization_id: res.specialization_id,
          name: res.name,
          selected: false
        }
      })
      setDataSpesialist(dataSpesialistUpdate)
      FilterSpesialist([])
    }
    let dataHospitalsUpdate = [...dataHospitals]
    if(dataHospitals.length > 0){
      dataHospitals.forEach((res, idx) => {
        dataHospitalsUpdate[idx] = {
          hospital_id: res.hospital_id,
          name: res.name,
          selected: false
        }
      })
      setDataHospitals(dataHospitalsUpdate)
      FilterHospitals([])
    }
    let dataPriceUpdate = [...dataPrice]
    if(dataPrice.length > 0){
      dataPrice.forEach((res, idx) => {
        dataPriceUpdate[idx] = {
          ...res,
          selected: false
        }
      })
      setDataPrice(dataPriceUpdate)
      FilterPrice([])
    }
    setDateFilter(new Date())
    setDateFilterData(null)
  }

  const findMinMax = (arr) => {
    let min = arr[0].price.raw, max = arr[0].price.raw;

    for (let i = 1, len=arr.length; i < len; i++) {
      let v = arr[i].price.raw;
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
    }

    return [min, max];
  }

  const rbFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + '' : Math.sign(num)*Math.abs(num)
  }

  useEffect(() => {
    if(TriggerReducer && TriggerReducer.closeFilterCheckbox){
      setFrameFilterCheckBox(false)
      TriggerUpdate(null)
    }
    if(TriggerReducer && TriggerReducer.closeFilterCheckboxHospitals){
      setFrameFilterCheckBoxHospital(false)
      TriggerUpdate(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer])

  useEffect(() => {
    let mounted = true
    if (mounted === true) {
      axios.all([
        Api.get('/data/specializations?is_popular=YES'),
        Api.get('/data/hospitals?is_popular=YES'),
        Api.get('/data/doctors')
      ])
      .then(axios.spread((schedules, hospitals, doctors) => {
        let dataPriceUpdate = [...dataPrice]
        let datapriceMinMax = findMinMax(doctors.data.data)
        dataPriceUpdate[0].text = `< ${rbFormatter(datapriceMinMax[0])} Ribu`
        dataPriceUpdate[1].text = `${rbFormatter(datapriceMinMax[0])}, ${rbFormatter(datapriceMinMax[1])} Rb`
        dataPriceUpdate[2].text = `> ${rbFormatter(datapriceMinMax[1])} Ribu`
        dataPriceUpdate[0].value = `${datapriceMinMax[0]}`
        dataPriceUpdate[1].value = `${datapriceMinMax[0]},${datapriceMinMax[1]}`
        dataPriceUpdate[2].value = `${datapriceMinMax[1]}`
        setDataPrice(dataPriceUpdate)
        setLoadPrice(!loadPrice)

        let listDataSchedules = [...schedules.data.data]
        if(schedules.data.data.length > 0){
          schedules.data.data.forEach((res, idx) => {
            listDataSchedules[idx] = {
              specialization_id: res.specialization_id,
              name: res.name,
              selected: false
            }
          })
          setDataSpesialist(listDataSchedules)
          setLoadSpesialist(!loadSpesialist)
        }
        let listDataHospitals = [...hospitals.data.data]
        if(hospitals.data.data.length > 0){
          hospitals.data.data.forEach((res, idx) => {
            listDataHospitals[idx] = {
              hospital_id: res.hospital_id,
              name: res.name,
              selected: false
            }
          })
          setDataHospitals(listDataHospitals)
          setLoadHospitals(!loadHospitals)
        }
      }))
    }
    return () => mounted === false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let dataSpesialistDataChangeFalse = [...dataSpesialist]
    dataSpesialist.forEach((res, idx) => {
      dataSpesialistDataChangeFalse[idx].selected = false
    })
    setDataSpesialist(dataSpesialistDataChangeFalse)
    if(FilterSpesialistReducer.length > 0 && dataSpesialist.length > 0){
      let dataSpesialistData = [...dataSpesialist]
      let y = 1
      FilterSpesialistReducer.forEach((res, idx) => {
        let checkData = dataSpesialist.filter(dataSpesialist => dataSpesialist.specialization_id === res.specialization_id)
        if(checkData.length < 1){
          dataSpesialistData[(parseInt(dataSpesialist.length)-1)+y] = {
            specialization_id: res.specialization_id,
            name: res.name,
            selected: true
          }
          y++
        } else if(checkData.length > 0){
          dataSpesialist.forEach((res2, idx2) => {
            if(res2.specialization_id === checkData[0].specialization_id){
              dataSpesialistData[idx2] = {
                specialization_id: res2.specialization_id,
                name: res2.name,
                selected: true
              }
            }
          })
        }
      })
      setDataSpesialist(dataSpesialistData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSpesialist, loadSpesialistReducer])

  useEffect(() => {
    setLoadSpesialistReducer(!loadSpesialistReducer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FilterSpesialistReducer])

  useEffect(() => {
    let dataHospitalsDataChangeFalse = [...dataHospitals]
    dataHospitals.forEach((res, idx) => {
      dataHospitalsDataChangeFalse[idx].selected = false
    })
    setDataHospitals(dataHospitalsDataChangeFalse)

    if(FilterHospitalsReducer.length > 0 && dataHospitals.length > 0){
      let dataHospitalsData = [...dataHospitals]
      let y = 1
      FilterHospitalsReducer.forEach((res, idx) => {
        let checkData = dataHospitals.filter(dataHospitals => dataHospitals.hospital_id === res.hospital_id)
        if(checkData.length < 1){
          dataHospitalsData[(parseInt(dataHospitals.length)-1)+y] = {
            hospital_id: res.hospital_id,
            name: res.name,
            selected: true
          }
          y++
        } else if(checkData.length > 0){
          dataHospitals.forEach((res2, idx2) => {
            if(res2.hospital_id === checkData[0].hospital_id){
              dataHospitalsData[idx2] = {
                hospital_id: res2.hospital_id,
                name: res2.name,
                selected: true
              }
            }
          })
        }
      })
      setDataHospitals(dataHospitalsData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadHospitals, loadHospitalsReducer])

  useEffect(() => {
    setLoadHospitalsReducer(!loadHospitalsReducer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FilterHospitalsReducer]);

  useEffect(() => {
    let dataPriceDataChangeFalse = [...dataPrice]
    dataPrice.forEach((res, idx) => {
      dataPriceDataChangeFalse[idx].selected = false
    })
    setDataPrice(dataPriceDataChangeFalse)

    if(FilterPriceReducer.length > 0 && dataPrice.length > 0){
      let dataPriceData = [...dataPrice]
      let y = 1
      FilterPriceReducer.forEach((res, idx) => {
        let checkData = dataPrice.filter(dataPrice => dataPrice.value === res.value)
        if(checkData.length < 1){
          dataPriceData[(parseInt(dataPrice.length)-1)+y] = {
            value: res.value,
            text: res.text,
            type: res.type,
            selected: true
          }
          y++
        } else if(checkData.length > 0){
          dataPrice.forEach((res2, idx2) => {
            if(res2.value === checkData[0].value){
              dataPriceData[idx2] = {
                value: res2.value,
                text: res2.text,
                type: res2.type,
                selected: true
              }
            }
          })
        }
      })
      setDataPrice(dataPriceData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPrice, loadPriceReducer])

  useEffect(() => {
    setLoadPriceReducer(!loadPriceReducer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FilterPriceReducer]);

  return (
    <div className={`flex flex-wrap items-start content-start absolute z-10 top-0 left-0 ${frameFilterCheckBox ? "overflow-y-hidden" : "overflow-y-auto"} scroll-small w-full h-full bg-white`}>
      <div className="w-full px-6 pt-2 pb-4 flex flex-wrap items-center">
        <div className="w-11/12 flex flex-wrap items-center py-2">
          <ButtonTextAndBorderBlue
            text="reset"
            position="left"
            value="reset"
            counter={(value) => handleCounterButtonResetFilter(value)}
            dimesion="rounded-full px-3 py-1 mt-0"
          />
        </div>
        <div className="w-1/12 flex justify-end items-start">
          <img src={AlertClose} alt="Alert Close" className="cursor-pointer" onClick={() => handleClickCloseFilterSpesialist()} />
        </div>
      </div>
      {filterDateStatus ?
        <div className="w-full px-6 pb-4 flex flex-wrap items-start">
          <div className="w-8/12 py-2">
            <p className="text-sm font-bold">Tanggal</p>
            <p className="text-xs mt-1 text-darker">{`${dayFormat(moment(dateFilter).day())}, ${moment(dateFilter).format('DD MMM Y')}`}</p>
          </div>
          <div className="w-4/12 flex flex-wrap items-center py-2 justify-end text-mainColor text-xs font-bold custom-date-picker-list-appointment relative">
            <DatePicker
              todayButton="Batal Pilih"
              selected={dateFilter}
              // minDate={moment().add(1, 'days').toDate()}
              onChange={(date) => handleSetFilterDate(date)}
              customInput={<ExampleCustomInput />}
            />
          </div>
        </div>
      : ""}
      {dataSpesialist.length > 0 ?
        <div className="w-full px-6 pb-4">
          <p className="w-full flex items-center pb-2 font-bold text-left text-sm">
            <span className="mr-auto">Spesialist</span>
            <span className="ml-auto cursor-pointer text-xs" style={{ color: "#61C7B5" }} onClick={() => handleClickSectionChange("spesialist")}>Lihat Semua</span>
          </p>
          <div className="w-full flex flex-wrap">
            {dataSpesialist.map((res, idx) => {
              return (
                <ButtonTextAndBorderBlue
                  key={idx}
                  text={res.name}
                  selected={res.selected}
                  value={{specialization_id: res.specialization_id, dataIndex: idx}}
                  counter={(value) => handleCounterButtonSpesialist(value)}
                  dimesion="rounded-full px-3 py-1 mt-0 mr-3 mb-3"
                />
              )
            })}
          </div>
        </div>
      : ""}
      {dataHospitals.length > 0 ?
        <div className="w-full px-6 pb-4">
          <p className="w-full flex items-center pb-2 font-bold text-left text-sm">
            <span className="mr-auto">Hospital</span>
            <span className="ml-auto cursor-pointer text-xs" style={{ color: "#61C7B5" }} onClick={() => handleClickSectionChange("hospital")}>Lihat Semua</span>
          </p>
          <div className="w-full flex flex-wrap">
            {dataHospitals.map((res, idx) => {
              return (
                <ButtonTextAndBorderBlue
                  key={idx}
                  text={res.name}
                  selected={res.selected}
                  value={{id: res.id, dataIndex: idx}}
                  counter={(value) => handleCounterButtonHospital(value)}
                  dimesion="rounded-full px-3 py-1 mt-0 mr-3 mb-3"
                />
              )
            })}
          </div>
        </div>
      : ""}
      {dataPrice[0].text !== "" ?
        <div className={`w-full px-6 pb-4 ${!hiddenFilterPrice ? "block" : "hidden"}`}>
          <p className="w-full flex items-center pb-2 font-bold text-left text-sm">
            <span className="mr-auto">Price</span>
          </p>
          <div className="w-full flex flex-wrap">
            {dataPrice.map((res, idx) => {
              return (
                <ButtonTextAndBorderBlue
                  key={idx}
                  text={res.text}
                  value={{value: res.value, dataIndex: idx}}
                  selected={res.selected}
                  counter={(value) => handleCounterButtonPrice(value)}
                  dimesion="rounded-full px-3 py-1 mt-0 mr-3 mb-3"
                />
              )
            })}
          </div>
        </div>
      : ""}
      {dataSpesialist.length > 0 && dataHospitals.length > 0 ?
        <div className="w-full px-5 pb-2">
          <ButtonDarkGrey
            text="Terapkan"
            dimension="w-full"
            counter={() => handleCounterButtonDarkGray()}
          />
        </div>
      : ""}
      {frameFilterCheckBox ?
        <FilterDoctorSpesialistCheckbox withoutHeightHeader={withoutHeightHeader} />
      : ""}
      {frameFilterCheckBoxHospital ?
        <FilterDoctorHospitalsCheckbox withoutHeightHeader={withoutHeightHeader} />
      : ""}
    </div>
  )
}

FilterDoctorSpesialist.defaultProps = {
  withoutHeightHeader: false,
  dateFilterDefault: null
}

const mapStateToProps = (state) => ({
  TriggerReducer: state.TriggerReducer.data,
  FilterSpesialistReducer: state.FilterSpesialistReducer.data,
  FilterHospitalsReducer: state.FilterHospitalsReducer.data,
  FilterPriceReducer: state.FilterPriceReducer.data,
})

const mapDispatchToProps = {
  TriggerUpdate,
  FilterSpesialist,
  FilterHospitals,
  FilterPrice
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterDoctorSpesialist)
