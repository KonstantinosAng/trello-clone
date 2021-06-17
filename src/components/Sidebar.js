import React, { Suspense, useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Spinner from '../assets/spinner.gif';
import LoadingElement from './LoadingElement';
const BackgroundPhoto = React.lazy(() => import('./BackgroundPhoto.js'));
const BackgroundColor = React.lazy(() => import('./BackgroundColor.js'));

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

  /* Handle focus on sidebar when open */
  useEffect(() => {
    if (className === 'flex right-0') {
      document.getElementById('board__header__root__sidebar').focus();
    }
  }, [className])
  
  return (
    <div id="board__header__root__sidebar" tabIndex={-1} className={`absolute top-0 w-[20.7rem] bg-gray-200 h-screen overflow-y-scroll overflow-x-hidden ${className} active:outline-none focus:outline-none`}>
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
          <Suspense fallback={<LoadingElement/>}>
            <BackgroundColor name={'Red'} handleBackgroundColor={handleBackgroundColor} color='bg-red-500'/>
            <BackgroundColor name={'Green'} handleBackgroundColor={handleBackgroundColor} color='bg-green-500'/>
            <BackgroundColor name={'Blue'} handleBackgroundColor={handleBackgroundColor} color='bg-blue-500'/>
            <BackgroundColor name={'Gray'} handleBackgroundColor={handleBackgroundColor} color='bg-gray-500'/>
            <BackgroundColor name={'Yellow'} handleBackgroundColor={handleBackgroundColor} color='bg-yellow-500'/>
            <BackgroundColor name={'Indigo'} handleBackgroundColor={handleBackgroundColor} color='bg-indigo-500'/>
            <BackgroundColor name={'Purple'} handleBackgroundColor={handleBackgroundColor} color='bg-purple-500'/>
            <BackgroundColor name={'Pink'} handleBackgroundColor={handleBackgroundColor} color='bg-pink-500'/>
          </Suspense>
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
                <img loading="lazy" className="object-contain w-20 bg-gray-transparent" src={Spinner} alt="Loading..."/>
              </div>
            ) : (
            photos?.map(photo => 
              (
                <Suspense key={photo?.id} fallback={<LoadingElement/>}>
                  <BackgroundPhoto photo={photo} handleBackgroudImage={handleBackgroudImage}/>
                </Suspense>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
