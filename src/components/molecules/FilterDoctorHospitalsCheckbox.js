import { React, useState } from '../../libraries'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { FilterHospitals } from '../../modules/actions'
import { Api } from '../../helpers/api'
import { TriggerUpdate } from '../../modules/actions'
import { ButtonDarkGrey } from '../atoms'
import { EmptyData } from '../molecules'
import {
  UncheckBox,
  // ArrowDown,
  // ArrowUp,
  AlertClose,
  MagnifierIcon,
  CheckedBox
} from '../../assets/images'
import { useEffect } from 'react'

const FilterDoctorHospitalsCheckbox = ({ TriggerUpdate, withoutHeightHeader, FilterHospitals, FilterHospitalsReducer }) => {
  const [load, setLoad] = useState(false)
  // const [showIndex, setShowIndex] = useState("")
  const [dataHospitals, setDataHospitals] = useState([])
  const [filterDataHospitals, setFilterDataHospitals] = useState([])
  const [params, setParams] = useState({
    _q: ""
  })

  const LocalStorageHospitals = () => {
    Api.get(`/data/hospitals${params._q === "" ? "" : "?_q=" + params._q}`)
      .then(res => {
        let dataList = [...res.data.data]
        if (res.data.data.length > 0) {
          res.data.data.map((res, idx) => {
            dataList[idx] = {
              ...res,
              selected: false
            }
            return dataList
          })
        }
        setDataHospitals(dataList)
        setLoad(true)
      })
      .catch(function (error) {
        console.log(error.response)
      })
  }

  useEffect(() => {
    if (load) {
        if(dataHospitals.length > 0){
          let dataHospitalsData = [...dataHospitals]
          dataHospitals.forEach((res, idx) => {
            let parent = FilterHospitalsReducer.filter(FilterHospitalsReducer => FilterHospitalsReducer.hospital_id === res.hospital_id)
            if(parent.length > 0){
              dataHospitalsData[idx].selected = true
            }
            setDataHospitals(dataHospitalsData)
          })
        }
      setLoad(false)
      setFilterDataHospitals(FilterHospitalsReducer)
      // console.log("FilterHospitalsReducer here", FilterHospitalsReducer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FilterHospitalsReducer, load])

  useEffect(() => {
    LocalStorageHospitals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params._q])

  const handleClickSectionChange = () => {
    TriggerUpdate({
      closeFilterCheckboxHospitals: true
    })
  }

  // const handleShowSubSpesialist = (idx) => {
  //   setShowIndex(showIndex !== "sub-" + idx ? "sub-" + idx : "")
  // }

  const handleChangeSearchHospital = debounce((event) => {
    let value = event.target.value.length
    let _q
    if (value > 1) {
      _q = event.target.value
    } else {
      _q = ""
    }
    setParams({
      ...params,
      [event.target.name]: _q
    })
  }, 700)

  const handleCheckbox = (event) => {
    let dataList = [...dataHospitals]
    let parentIndex = event.target.getAttribute('parent-index')
    let status = !dataList[parentIndex].selected
    dataList[parentIndex].selected = status
    setDataHospitals(dataList)
    if(status){
      // if(FilterHospitalsReducer.length > 0){
      //   setFilterDataHospitals([
      //     ...FilterHospitalsReducer,
      //     {
      //       hospital_id: dataList[parentIndex].hospital_id,
      //       name: dataList[parentIndex].name
      //     }
      //   ])
      // } else {
        setFilterDataHospitals(
          FilterHospitals =>
          [
            ...FilterHospitals,
            {
              hospital_id: dataList[parentIndex].hospital_id,
              name: dataList[parentIndex].name
            }
          ]
        )
      // }
    } else {
      // console.log("here")
      // if(FilterHospitalsReducer.length > 0){
        // console.log("FilterHospitalsReducer", FilterHospitalsReducer)
        let dataUnUpdate = filterDataHospitals.filter(filterDataHospitals => filterDataHospitals.hospital_id !== dataList[parentIndex].hospital_id)
        console.log("dataUnUpdate", dataUnUpdate)
        setFilterDataHospitals(dataUnUpdate)
        // FilterHospitals(dataUnUpdate)
      // }
    }
  }

  const handleCounterButtonDarkGray = () => {
    console.log("filterDataHospitals from checkbox", filterDataHospitals)
    FilterHospitals(filterDataHospitals)
    TriggerUpdate({
      closeFilterCheckboxHospitals: true
    })
  }

  // useEffect(() => {
  //   console.log("dataHospitals", dataHospitals)
  // }, [dataHospitals])

  useEffect(() => {
    console.log("filterDataHospitals", filterDataHospitals)
  }, [filterDataHospitals])

  return (
    <div className="flex flex-wrap items-start content-start absolute z-20 overflow-y-auto scroll-small pb-10 w-full h-full bg-white">
      <div className="w-full px-6 pt-2 pb-2 flex flex-wrap items-center">
        <div className="w-11/12 flex flex-wrap items-center">
          <p className="w-full flex items-center pb-2 font-bold text-left text-sm">
            <span className="mr-auto">Rumah Sakit</span>
          </p>
        </div>
        <div className="w-1/12 flex justify-end items-start">
          <img src={AlertClose} alt="Alert Close" className="w-2/5 cursor-pointer" onClick={() => handleClickSectionChange()} />
        </div>
      </div>
      <div className="w-full px-6 pb-4 flex flex-wrap items-center">
        <div className="relative w-full">
          <button className="absolute z-10 left-0 inset-y-0 ml-4 focus:outline-none">
            <img src={MagnifierIcon} alt="Magnifier Icon" className="w-4" />
          </button>
          <input
            type="text"
            name="_q"
            className="w-full py-1 pl-10 pr-3 rounded-full focus:outline-none"
            style={{ backgroundColor: "#F2F2F5" }}
            onChange={handleChangeSearchHospital} />
        </div>
      </div>
      <div className="w-full pb-4">
        {dataHospitals.length > 0 ?
          <>
            {dataHospitals.map((res, idx) => {
              return (
                <div key={idx} className="px-4">
                  <button className="w-full flex flex-wrap items-center" style={{ borderColor: "#BDBDBD" }}>
                    <div className="w-full flex flex-wrap border-b border-solid py-2 my-1 px-3">
                      <div className="w-11/12 flex items-center pr-5">
                        <p className="text-sm mr-auto">{res.name}</p>
                        {/* {res.sub_specialization.length > 0 ?
                          <img src={showIndex === "sub-" + idx ? ArrowUp : ArrowDown} alt="Arrow Down" className="ml-auto" />
                          : ""} */}
                      </div>
                      <div className="w-1/12">
                        <img
                          src={res.selected ? CheckedBox : UncheckBox}
                          alt="check Box Icon"
                          className="mx-auto w-5"
                          parent-index={idx}
                          data-value={!res.selected}
                          onClick={handleCheckbox}
                        />
                      </div>
                    </div>
                  </button>
                </div>
              )
            })}
            <div className="w-full px-5 py-2">
              <ButtonDarkGrey
                text="Terapkan"
                dimension="w-full"
                value=""
                counter={(value) => handleCounterButtonDarkGray(value)}
              />
            </div>
          </>
          : <EmptyData text="Rumah sakit tidak ditemukan" styleWrap="py-10" />}
      </div>
    </div>
  )
}

FilterDoctorHospitalsCheckbox.defaultProps = {
  withoutHeightHeader: false
}

const mapStateToProps = (state) => ({
  FilterHospitalsReducer: state.FilterHospitalsReducer.data
})

const mapDispatchToProps = {
  TriggerUpdate,
  FilterHospitals
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterDoctorHospitalsCheckbox)
