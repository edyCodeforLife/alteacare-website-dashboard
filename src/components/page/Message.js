import { React, useEffect, useState } from '../../libraries'
import { connect } from 'react-redux'
import { TriggerUpdate } from '../../modules/actions'
import { LabelTitle } from '../atoms'
import {ListChat, DetailChat } from '../molecules'
import { Template } from '../molecules/layout'
import { DataPatient } from '../molecules/patient'
import { ChatIconLarge } from '../../assets/images'

const Message = ({ HeightElementReducer, TriggerUpdate, TriggerReducer }) => {
  const [HeightElement, setHeightElement] = useState("")
  const [sectionSecond, setSectionSecond] = useState(false)
  const [sectionThird, setSectionThird] = useState(false)

  useEffect(() => {
    if(HeightElementReducer !== null){
      setHeightElement(HeightElementReducer.heightElement)
    }
  }, [HeightElementReducer])

  useEffect(() => {
    if(TriggerReducer && TriggerReducer.detailChate){
      setSectionSecond(true)
      setSectionThird(false)
      TriggerUpdate(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TriggerReducer])


  return(
    <Template active="message" HeightElement={HeightElement}>
      <div className="lg:w-1/3 w-full border-r border-solid" style={{ borderColor: "#D6EDF6" }}>
        <div id="panel-header-third" className="w-full">
          <LabelTitle text="Daftar Pesan" />
        </div>
        <div className="flex flex-wrap items-center my-3">
          <ListChat />
        </div>
      </div>
      <div className={`lg:w-1/3 w-1/2 border-r border-solid ${sectionSecond ? "block" : "hidden"}`} style={{ borderColor: "#D6EDF6" }}>
        <DetailChat />
      </div>
      <div className={`lg:w-1/3 w-1/2 ${sectionSecond ? "block" : "hidden"}`}>
        <DataPatient />
      </div>
      {!sectionSecond && !sectionThird ?
        <div className="lg:w-2/3 w-full flex flex-wrap justify-center items-center" style={{ backgroundColor: "#E5E5E5" }}>
          <div className="inline-block text-center my-10">
            <img src={ChatIconLarge} className="mx-auto" alt="Chat Icon Large" />
            <p class="w-full mt-5" style={{ color: "#C7C9D9" }}>Pilih  pesan untuk detail tiket</p>
          </div>
        </div>
      : ""}
    </Template>
  )
}

const mapStateToProps = (state) => ({
  HeightElementReducer: state.HeightElementReducer.data,
  TriggerReducer: state.TriggerReducer.data
})

const mapDispatchToProps = {
  TriggerUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(Message)
