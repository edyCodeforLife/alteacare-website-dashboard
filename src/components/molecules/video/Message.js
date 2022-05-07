import React from 'react';

const Message = (props) => {
  const {
    type,
    author,
    content,
  } = props

  return (
    <>
      {
        type === 'file'
          ? (
            <>
              <p className="w-full text-left font-bold">{ author }</p>
              <span className="text-sm w-1/2 text-left px-3 py-1 rounded-xl my-1 inline-block" style={{ color: "#3E8CB9", backgroundColor: "#D6EDF6" }}>
                <img src={ content } alt="unique" />
              </span>
            </>
          ) : (
            <>
              <p className="w-full text-right font-bold">{ author }</p>
              <p className="text-sm text-right px-3 py-1 rounded-xl my-1 inline-block" style={{ color: "#3E8CB9", backgroundColor: "#D6EDF6" }}>
                { content }
              </p>
            </>
          )
      }
    </>
  );
}

export default Message;
