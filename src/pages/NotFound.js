import React from 'react'

function NotFound() {
  return (
    <div className="h-screen bg-[#111E2F] flex flex-col items-center justify-center">
      <h2 className="text-white text-6xl font-bold font-serif mb-20 motion-safe:animate-pulse pointer-events-none"> 404 </h2>
      <h3 className="text-white text-3xl font-bold font-serif"> Sorry page <span className="italic">{window.location.pathname}</span> not found </h3>
    </div>
  )
}

export default NotFound
