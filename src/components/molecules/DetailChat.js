import { React, useState, useEffect } from '../../libraries'
import { connect } from 'react-redux'
import { AlertCloseWhite } from '../../assets/images'

const DetailChat = ({ HeightElementReducer }) => {
  const [HeightElement, setHeightElement] = useState(0)

  useEffect(() => {
    if(HeightElementReducer !== null){
      const heightHeader = document.getElementById('header-top').clientHeight
      setHeightElement(HeightElementReducer.heightElement - parseInt(heightHeader))
    }
  }, [HeightElementReducer])

  return(
    <div>
      <div id="header-top" className="flex flex-wrap items-start justify-center px-3 py-2 text-white rounded-t-lg relative" style={{ backgroundColor: "#87CDE9" }}>
        <p className="text-lg font-bold">Chat</p>
        <img src={AlertCloseWhite} alt="Alert Close White Icon" className="absolute z-10 inset-y-0 right-0 mr-5 my-auto cursor-pointer" />
      </div>
      <div 
        className="wrap-detail-chat flex flex-wrap items-start p-5 overflow-y-scroll scroll-small lg:shadow-none shadow-sm lg:pb-0 pb-10" 
        style={{ 
          height: HeightElement !== "" ? HeightElement+"px" : "" 
        }}
      >
        <div className="w-full flex flex-wrap justify-start inline-block">
          <p className="w-full text-left font-bold">Aldi</p>
          <p 
            className="text-sm text-left px-3 py-1 rounded-xl my-1 inline-block" 
            style={{ 
              color: "#3E8CB9", 
              backgroundColor: "#D6EDF6" }}>Oke sebentar
          </p>
        </div>
        <div className="w-full flex flex-wrap justify-end inline-block">
          <p className="w-full text-right font-bold">Aldi</p>
          <p 
            className="text-sm text-right px-3 py-1 rounded-xl my-1 inline-block" 
            style={{ 
              color: "#3E8CB9", 
              backgroundColor: "#D6EDF6" }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
        <div className="w-full flex flex-wrap justify-start inline-block">
          <p className="w-full text-left font-bold">Aldi</p>
          <p 
            className="text-sm text-left px-3 py-1 rounded-xl my-1 inline-block" 
            style={{ 
              color: "#3E8CB9", 
              backgroundColor: "#D6EDF6" }}>Oke sebentar
          </p>
        </div>
        <div className="w-full flex flex-wrap justify-end inline-block">
          <p className="w-full text-right font-bold">Aldi</p>
          <p 
            className="text-sm text-right px-3 py-1 rounded-xl my-1 inline-block" 
            style={{ 
              color: "#3E8CB9", 
              backgroundColor: "#D6EDF6" }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
        <div className="w-full flex flex-wrap justify-start inline-block">
          <p className="w-full text-left font-bold">Aldi</p>
          <p 
            className="text-sm text-left px-3 py-1 rounded-xl my-1 inline-block" 
            style={{ 
              color: "#3E8CB9", 
              backgroundColor: "#D6EDF6" }}>Oke sebentar
          </p>
        </div>
        <div className="w-full flex flex-wrap justify-end inline-block">
          <p className="w-full text-right font-bold">Aldi</p>
          <p 
            className="text-sm text-right px-3 py-1 rounded-xl my-1 inline-block" 
            style={{ 
              color: "#3E8CB9", 
              backgroundColor: "#D6EDF6" }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  HeightElementReducer: state.HeightElementReducer.data
})

export default connect(mapStateToProps, null)(DetailChat)