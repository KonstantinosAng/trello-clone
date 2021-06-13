import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Spinner from '../assets/spinner.gif';

function Sidebar({ setBackgroundColor, setClassName, setPhotoUrl, className }) {
  
  const [showCarret, setShowCarret] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [searchingImages, setSearchingImages] = useState(false);

  /* Pull default images on refresh */
  useEffect(() => {
    async function pullImages() {
      await fetch('https://api.pexels.com/v1/search?query=nature', {
        method: 'GET',
        headers: new Headers({'Authorization': process.env.REACT_APP_PEXELS_API_KEY})
      }).then(res => res.json()).then( data => {
        setPhotos(data.photos);
      }).catch( error => {
        console.error(error);
      })
    }
    pullImages()
  }, [])

  /* Handle close Sidebar */
  const handleClose = () => {
    setClassName('hidden -right-full');
  }

  /* Handle show back carret */
  const handleShowCarret = () => {
    setShowCarret(false);
    setShowPhotos(false);
    setShowColors(false);
  }
  /* Handle Show Color list */
  const handleColors = () => {
    setShowCarret(true);
    setShowPhotos(false);
    setShowColors(true);
  }

  /* Handle Show Photo list */
  const handlePhotos = () => {
    setShowCarret(true);
    setShowPhotos(false);
    setShowPhotos(true);
  }

  /* Handle background color */
  const handleBackgroundColor = (color) => {
    setBackgroundColor(color);
    setPhotoUrl('blank');
  }

  /* Handle image show hover effect */
  const handleImageHover = (_id) => {
    document.getElementById(_id).classList.remove('hidden');
    document.getElementById(_id).classList.add('block');
    document.getElementById(_id+'-overlay').classList.add('bg-gray-100');
    document.getElementById(_id+'-overlay').classList.add('bg-opacity-10');
    
  }

  /* Handle image remove hover effects */
  const handleImageMouseOut = (_id) => {
    document.getElementById(_id).classList.remove('block');
    document.getElementById(_id).classList.add('hidden');
    document.getElementById(_id+'-overlay').classList.remove('bg-gray-100');
    document.getElementById(_id+'-overlay').classList.remove('bg-opacity-10');
  }
  
  /* Handle background image */
  const handleBackgroudImage = (imageSrc) => {
    setPhotoUrl(imageSrc);
    setBackgroundColor('blank');
  }

  /* handle search input and image search */
  const handleSearchInput = async (e) => {
    setSearchingImages(true);
    e.preventDefault();
    await fetch(`https://api.pexels.com/v1/search?query=${e.currentTarget.inputSearchImages.value}`, {
      method: 'GET',
      headers: new Headers({'Authorization': process.env.REACT_APP_PEXELS_API_KEY})
    }).then(res => res.json()).then( data => {
      setPhotos(data.photos);
    }).catch( error => {
      console.error(error);
    })
    setSearchingImages(false);
  }

  return (
    <div className={`absolute top-0 w-[20.7rem] bg-gray-200 h-screen overflow-y-scroll overflow-x-hidden ${className}`}>
      <div className="flex flex-col ml-2">
        <div className="flex justify-evenly w-full items-center h-14 border-b-2 border-gray-300">
          <ArrowBackIosIcon onClick={()=>handleShowCarret()} className={`cursor-pointer ${showCarret ? "flex" : "hidden"}`}/>
          <h2 className="w-full text-center text-[#0079BF] text-xl"> Pick a color </h2>
          <ClearIcon onClick={()=>handleClose()} className="cursor-pointer" />
        </div>
        <div className={`${!showCarret ? 'flex' : 'hidden'} justify-evenly w-full text-white text-center border-b-2 border-gray-300`}>
          <div onClick={()=>handlePhotos()} className="cursor-pointer hover:animate-bounce">
            <button className="w-36 mx-1 text-xl my-2 py-10 px-1 rounded-xl active:outline-none bg-photoSidebar bg-center bg-cover shadow-xl"> Photos </button>
          </div>
          <div onClick={()=>handleColors()} className="cursor-pointer hover:animate-bounce">
            <button className="w-36 text-xl my-2 mx-1 px-1 py-10 rounded-xl active:outline-none bg-gradient-to-r from-pink-500 via-green-500 to-blue-500 shadow-xl"> Colors </button>
          </div>
        </div>
        <div className={`${showColors ? 'flex' : 'hidden'} w-full flex-wrap justify-between text-center`}>
          <h2 onClick={()=>handleBackgroundColor('bg-red-700')} className="bg-red-700 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl"> Red </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-green-500')} className="bg-green-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl"> Green </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-blue-500')} className="bg-blue-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl"> Blue </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-gray-500')} className="bg-gray-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl"> Gray </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-yellow-500')} className="bg-yellow-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl"> Yellow </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-indigo-500')} className="bg-indigo-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl"> Indigo </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-purple-500')} className="bg-purple-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl"> Purple </h2>
          <h2 onClick={()=>handleBackgroundColor('bg-pink-500')} className="bg-pink-500 w-36 text-xl text-white my-2 px-2 py-10 rounded-xl cursor-pointer active:animate-bounce shadow-xl"> Pink </h2>
        </div>
        <div className={`${showPhotos ? 'flex' : 'hidden'} flex-col flex-wrap w-full justify-between text-center`}>
          <h2 onClick={()=>window.open('https://www.pexels.com', '_blank')} className="text-xl text-[#0079BF] py-2 cursor-pointer underline"> Photos by pexel </h2>
          <form onSubmit={(e)=>handleSearchInput(e)} className="flex mx-1 items-center border-2 border-black rounded-xl shadow-xl">
            <SearchIcon className="ml-1"/>
            <input name="inputSearchImages" className="text-xl text-black p-2 bg-gray-200 focus:outline-none rounded-xl" placeholder="Search for a photo" type="text" spellCheck/>
          </form>  
          <div className="flex flex-wrap justify-between items-center text-center w-full my-2">
            {searchingImages ? (
              <div className="flex items-center w-full justify-center mt-5">
                <img className="object-contain w-20" src={Spinner} alt="Loading..."/>
              </div>
            ) : (
            photos?.map(photo => 
              (
                <div key={photo?.id} className="relative text-center cursor-pointer">
                  <img onMouseOut={()=>handleImageMouseOut(photo?.id)} onMouseOver={()=>handleImageHover(photo?.id)} alt="ImagePhoto" src={photo?.src.landscape} className="h-[6.5rem] w-[9.61rem] p-1 object-cover box-border rounded-xl shadow-2xl"/>
                  <div onClick={()=>handleBackgroudImage(photo?.src.landscape)} onMouseOut={()=>handleImageMouseOut(photo?.id)} onMouseOver={()=>handleImageHover(photo?.id)} id={photo?.id+'-overlay'} className="absolute h-[6.5rem] w-[9.61rem] bottom-0 z-10 rounded-xl"/>
                  <h2 onClick={()=>window.open(photo?.photographer_url, '_blank')} onMouseOut={()=>handleImageMouseOut(photo?.id)} onMouseOver={()=>handleImageHover(photo?.id)} id={photo?.id} className="absolute hidden w-[9.15rem] m-1 z-20 rounded-b-lg bottom-0 text-sm text-white underline font-bold bg-black bg-opacity-50 hover:bg-opacity-70 capitalize"> {photo?.photographer} </h2>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
