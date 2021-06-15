import React from 'react';

function BackgroundPhoto({ photo, handleBackgroudImage}) {
  
  /* Handle image remove hover effects */
  const handleImageMouseOut = (_id) => {
    document.getElementById(_id).classList.remove('block');
    document.getElementById(_id).classList.add('hidden');
    document.getElementById(_id+'-overlay').classList.remove('bg-gray-100');
    document.getElementById(_id+'-overlay').classList.remove('bg-opacity-10');
  }
  
  /* Handle image show hover effect */
  const handleImageHover = (_id) => {
    document.getElementById(_id).classList.remove('hidden');
    document.getElementById(_id).classList.add('block');
    document.getElementById(_id+'-overlay').classList.add('bg-gray-100');
    document.getElementById(_id+'-overlay').classList.add('bg-opacity-10');
  }

  return (
    <div key={photo?.id} className="relative text-center cursor-pointer">
      <img loading="lazy" onMouseOut={()=>handleImageMouseOut(photo?.id)} onMouseOver={()=>handleImageHover(photo?.id)} alt="ImagePhoto" src={photo?.src.landscape} className="h-[6.5rem] w-[9.61rem] p-1 object-cover box-border rounded-xl shadow-2xl"/>
      <div onClick={()=>handleBackgroudImage(photo?.src.landscape)} onMouseOut={()=>handleImageMouseOut(photo?.id)} onMouseOver={()=>handleImageHover(photo?.id)} id={photo?.id+'-overlay'} className="absolute h-[6.5rem] w-[9.61rem] bottom-0 z-10 rounded-xl"/>
      <h2 onClick={()=>window.open(photo?.photographer_url, '_blank')} onMouseOut={()=>handleImageMouseOut(photo?.id)} onMouseOver={()=>handleImageHover(photo?.id)} id={photo?.id} className="absolute hidden w-[9.15rem] m-1 z-20 rounded-b-lg bottom-0 text-sm text-white underline font-bold bg-black bg-opacity-50 hover:bg-opacity-70 capitalize"> {photo?.photographer} </h2>
    </div>
  )
}

export default BackgroundPhoto
