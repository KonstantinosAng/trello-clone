import React from 'react'

function Error() {
  return (
    <div className="h-screen bg-[#111E2F] flex flex-col items-center justify-center">
      <h2 className="text-white text-6xl font-bold font-serif mb-20 motion-safe:animate-pulse pointer-events-none"> 400 </h2>
      <h3 className="text-white text-3xl font-bold font-serif"> Sorry project not found {`:(`} </h3>
    </div>
  )
}

export default Error
