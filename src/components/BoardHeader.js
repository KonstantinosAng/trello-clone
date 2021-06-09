import React from 'react'

function BoardHeader({ name }) {
  return (
    <div className="text-[#0079BF] text-2xl px-5 py-4 text-left flex items-center">
      <h2> {name} </h2>
    </div>
  )
}

export default BoardHeader
