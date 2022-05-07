import { React, useState } from '../../libraries'
import { Chat } from '../atoms'

const ListChat = () => {
  const [listDataChat] = useState([1,2,3,4])

  return(
    <>
      {listDataChat.length > 0 ? 
        listDataChat.map((res, index) => {
          return <Chat key={index} />
        })
      : ""}
    </>
  )
}

export default ListChat