import React from 'react'

export const BackgroundColor = React.memo(({ name, color, handleBackgroundColor}) => {
  return (
    <h2 onClick={()=>handleBackgroundColor(color)} className={`${color} w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl`}> {name} </h2>
  )
})