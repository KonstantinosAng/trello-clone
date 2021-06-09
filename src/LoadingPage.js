import React from 'react';
import Spinner from './assets/spinner.gif';

function LoadingPage() {
  return (
    <div className="bg-[#F1F2F3] h-screen flex justify-center">
      <img className="object-contain w-1/3 sm:w-1/12" src={Spinner} alt="Loading.."/>
    </div>
  )
}

export default LoadingPage
