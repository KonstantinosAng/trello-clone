import React, { useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function Sidebar({ setBackgroundColor, setClassName, className }) {
  
  const [showCarret, setShowCarret] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  const handleBlur = () => {
    className.trim().split(" ").map((item) => {
      console.log(item);
    });
  }

  const handleClose = () => {
    setClassName('hidden -right-full');
  }
  
  const handleShowCarret = () => {
    setShowCarret(false);
    setShowPhotos(false);
    setShowColors(false);
  }

  const handleColors = () => {
    setShowCarret(true);
    setShowPhotos(false);
    setShowColors(true);
  }

  const handlePhotos = () => {
    setShowCarret(true);
    setShowPhotos(false);
    setShowPhotos(true);
  }

  const handleBackgroundColor = (color) => {
    setBackgroundColor(color);
  }
  
  return (
    <div onBlur={()=>handleBlur()} className={`absolute w-80 top-0 bg-gray-100 h-screen ${className}`}>
      <div className="flex flex-col">
        <div className="flex justify-evenly items-center w-80 h-14 p-2 border-b-2 border-gray-300">
          <ArrowBackIosIcon onClick={()=>handleShowCarret()} className={`cursor-pointer ${showCarret ? "flex" : "hidden"}`}/>
          <h2 className="w-full text-center text-[#0079BF] text-xl"> Pick a color </h2>
          <ClearIcon onClick={()=>handleClose()} className="cursor-pointer" />
        </div>
        <div className={`${!showCarret ? 'flex' : 'hidden'} w-80 justify-evenly text-white text-center border-b-2 border-gray-300`}>
          <div onClick={()=>handlePhotos()} className="cursor-pointer hover:animate-bounce">
            <button className="w-36 px-2 text-xl my-2 py-10 rounded-xl active:outline-none bg-photoSidebar bg-center bg-cover"> Photos </button>
          </div>
          <div onClick={()=>handleColors()} className="cursor-pointer hover:animate-bounce">
            <button className="w-36 text-xl my-2 px-2 py-10 rounded-xl active:outline-none bg-gradient-to-r from-pink-500 via-green-500 to-blue-500"> Colors </button>
          </div>
        </div>
        <div className={`${showColors ? 'flex' : 'hidden'} flex-wrap w-80 justify-between text-center px-2`}>
          <h2 onClick={()=>handleBackgroundColor('bg-red-700')} className="bg-red-700 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce"> Red </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-green-500')} className="bg-green-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce"> Green </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-blue-500')} className="bg-blue-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce"> Blue </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-gray-500')} className="bg-gray-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce"> Gray </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-yellow-500')} className="bg-yellow-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce"> Yellow </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-indigo-500')} className="bg-indigo-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce"> Indigo </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-purple-500')} className="bg-purple-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce"> Purple </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-pink-500')} className="bg-pink-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce"> Pink </h2>
        </div>
        <div className={`${showPhotos ? 'flex' : 'hidden'} flex-wrap w-80 justify-between text-center px-2`}>
          <h2 onClick={()=>window.open('https://www.pexels.com', '_blank')} className="w-80 text-xl text-[#0079BF] py-2 cursor-pointer underline"> Photos by pexel </h2>
          <input className="w-80 text-xl text-black p-2 border-2 border-black rounded-xl focus:outline-none" placeholder="Search for a photo"/>
          <div className="bg-red-500 w-36 my-2 px-2 py-10 rounded-xl cursor-pointer relative">
            <h2 className="absolute text-xl text-black bg-opacity-30"> Red </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
