import { React, useState } from '../../libraries'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { FilterSpesialist } from '../../modules/actions'
import { Api } from '../../helpers/api'
import { TriggerUpdate } from '../../modules/actions'
import { ButtonDarkGrey } from '../atoms'
import { EmptyData } from '../molecules'
import {
  UncheckBox,
  ArrowDown,
  ArrowUp,
  AlertClose,
  MagnifierIcon,
  CheckedBox
} from '../../assets/images'
import { useEffect } from 'react'

const FilterDoctorSpesialistCheckbox = ({ TriggerUpdate, withoutHeightHeader, FilterSpesialist, FilterSpesialistReducer }) => {
  const [load, setLoad] = useState(false)
  const [showIndex, setShowIndex] = useState("")
  const [dataSpesialist, setDataSpesialist] = useState([])
  const [filterDataSpesialist, setFilterDataSpesialist] = useState([])
  const [params, setParams] = useState({
    _q: ""
  })

  const LocalStorageSpesialist = () => {
    Api.get(`/data/specializations${params._q === "" ? "" : "?_q="+params._q}`)
    .then(res => {
      let dataList = [...res.data.data]
      if(res.data.data.length > 0){
        res.data.data.map((res, idx) => {
          dataList[idx] = {
            ...res,
            selected: false
          }
          if(res.sub_specialization.length > 0){
            res.sub_specialization.forEach((res2, idx2) => {
              dataList[idx].sub_specialization[idx2] = {
                ...res2,
                selected: false
              }
            })
          }
          return dataList
        })
      }
      setDataSpesialist(dataList)
      setLoad(true)
    })
    .catch(function (error){
      console.log(error.response)
    })
  }

  useEffect(() => {
    if(load){
      if(dataSpesialist.length > 0){
        let dataSpesialistData = [...dataSpesialist]
        dataSpesialist.forEach((res, idx) => {
          let parent = FilterSpesialistReducer.filter(FilterSpesialistReducer => FilterSpesialistReducer.specialization_id === res.specialization_id)
          if(parent.length > 0){
            dataSpesialistData[idx].selected = true
          }
          if(res.sub_specialization.length > 0){
            res.sub_specialization.forEach((res2, idx2) => {
              let child = FilterSpesialistReducer.filter(FilterSpesialistReducer => FilterSpesialistReducer.specialization_id === res2.specialization_id)
              if(child.length > 0){
                dataSpesialistData[idx].sub_specialization[idx2].selected = true
              }
            })
          }
          setDataSpesialist(dataSpesialistData)
        })
      }
      setLoad(false)
      setFilterDataSpesialist(FilterSpesialistReducer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FilterSpesialistReducer, load])

  useEffect(() => {
    LocalStorageSpesialist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params._q])

  const handleClickSectionChange = () => {
    TriggerUpdate({
      closeFilterCheckbox: true
    })
  }

  const handleShowSubSpesialist = (idx) => {
    setShowIndex(showIndex !== "sub-"+idx ? "sub-"+idx : "")
  }

  const handleChangeSearchSpesialist = debounce((event) => {
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
    let dataList = [...dataSpesialist]
    let parentIndex = event.target.getAttribute('parent-index')
    let status = !dataList[parentIndex].selected
    dataList[parentIndex].selected = status
    setDataSpesialist(dataList)
    // console.log("status", status)
    if(status){
      setFilterDataSpesialist(
        filterDataSpesialist =>
          [
            ...filterDataSpesialist,
            {
              specialization_id: dataList[parentIndex].specialization_id,
              name: dataList[parentIndex].name
            }
          ]
      )
    } else {
      let dataUnUpdate = filterDataSpesialist.filter(filterDataSpesialist => filterDataSpesialist.specialization_id !== dataList[parentIndex].specialization_id)
      setFilterDataSpesialist(dataUnUpdate)
    }
  }

  const handleCheckboxChild = (event) => {
    let dataList = [...dataSpesialist]
    let parentIndex = event.target.getAttribute('parent-index')
    let childIndex = event.target.getAttribute('child-index')
    let status = !dataList[parentIndex].sub_specialization[childIndex].selected
    dataList[parentIndex].sub_specialization[childIndex].selected = status
    setDataSpesialist(dataList)
    if(status){
      setFilterDataSpesialist(
        FilterSpesialist =>
        [
          ...FilterSpesialist, dataList[parentIndex].sub_specialization[childIndex]
        ]
      )
    } else {
      let dataUnUpdate = filterDataSpesialist.filter(filterDataSpesialist => filterDataSpesialist.specialization_id !== dataList[parentIndex].sub_specialization[childIndex].specialization_id)
      setFilterDataSpesialist(dataUnUpdate)
    }
  }

  const handleCounterButtonDarkGray = (value) => {
    FilterSpesialist(filterDataSpesialist)
    TriggerUpdate({
      closeFilterCheckbox: true
    })
  }

  return (
    <div className="flex flex-wrap items-start content-start absolute z-20 overflow-y-auto scroll-small pb-10 w-full h-full bg-white">
      <div className="w-full px-6 pt-2 pb-2 flex flex-wrap items-center">
        <div className="w-11/12 flex flex-wrap items-center">
          <p className="w-full flex items-center pb-2 font-bold text-left text-sm">
            <span className="mr-auto">Spesialist</span>
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
            onChange={handleChangeSearchSpesialist} />
        </div>
      </div>
      <div className="w-full pb-4">
        {dataSpesialist.length > 0 ?
          <>
            {dataSpesialist.map((res, idx) => {
              return (
                <div key={idx} className="px-4">
                  <button className="w-full flex flex-wrap items-center" style={{ borderColor: "#BDBDBD" }}>
                    <div className="w-full flex flex-wrap border-b border-solid py-2 my-1 px-3">
                      <div className="w-11/12 flex items-center pr-5" onClick={() => handleShowSubSpesialist(idx)}>
                        <p className="text-sm mr-auto">{res.name}</p>
                        {res.sub_specialization.length > 0 ?
                          <img src={showIndex === "sub-"+idx ? ArrowUp : ArrowDown} alt="Arrow Down" className="ml-auto" onClick={() => handleShowSubSpesialist(idx)} />
                        : ""}
                      </div>
                      <div className="w-1/12">
                        <img
                          src={res.selected ? CheckedBox : UncheckBox}
                          alt="Uncheck Box Icon"
                          className="mx-auto w-5"
                          parent-index={idx}
                          data-value={!res.selected}
                          onClick={handleCheckbox}
                        />
                      </div>
                    </div>
                    {res.sub_specialization.length > 0 ?
                      <div className={`w-full flex flex-wrap ${showIndex === "sub-"+idx ? "" : "hidden"}`}>
                        {res.sub_specialization.map((res2, idx2) => {
                          return (
                            <div key={idx2} className="w-full flex flex-wrap border-b border-solid py-2 my-1 px-3">
                              <div className="w-11/12 flex items-center pr-5">
                                <p className="text-sm mr-auto">{res2.name}</p>
                              </div>
                              <div className="w-1/12">
                                <img
                                  src={res2.selected ? CheckedBox : UncheckBox}
                                  alt="Uncheck Box Icon"
                                  className="mx-auto w-5"
                                  parent-index={idx}
                                  child-index={idx2}
                                  data-value={!res2.selected}
                                  onClick={handleCheckboxChild}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    : ""}
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
        : <EmptyData text="Spesialist tidak ditemukan" styleWrap="py-10" /> }
      </div>
    </div>
  )
}

FilterDoctorSpesialistCheckbox.defaultProps = {
  withoutHeightHeader: false
}

const mapStateToProps = (state) => ({
  FilterSpesialistReducer: state.FilterSpesialistReducer.data
})

const mapDispatchToProps = {
  TriggerUpdate,
  FilterSpesialist
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterDoctorSpesialistCheckbox)
