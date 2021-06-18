import React, { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { IconButton } from '@material-ui/core';

function StickyNote({ color, title }) {

  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    if (showInput) {
      document.getElementById("board__root__input__list").focus()
    }
  }, [showInput])

  return (
    <div className={`flex flex-col ml-5 mt-10 relative w-[21rem] h-[23rem] rounded-sm text-gray-800 ${color}`}>
      <div style={{cursor: 'grab'}} className="bg-white bg-opacity-10 flex items-center justify-center">
        <DragHandleIcon className="hover:bg-opacity-20 hover:w-7 hover:h-7" />
      </div>
      {showInput ? 
        <input className={`${color} text-2xl font-bold p-5 pr-0 outline-none`} value={title} id="board__root__input__list" onBlur={()=>setShowInput(false)} />
      :
        <h1 className="text-2xl font-bold p-5 pr-0"> {title} </h1>
      }
      <p className='px-5 text-base font-medium'>
        Ut irure pariatur officia ea proident quis. Sunt laboris consequat enim veniam. Cillum deserunt id magna commodo dolor ullamco. Ipsum dolor veniam consectetur aute veniam eiusmod.
      </p>
      <div className="absolute bottom-3 right-3">
        <IconButton onClick={()=>setShowInput(true)} className="focus:outline-none active:outline-none">
          <EditIcon className="px-1 w-9 h-9 cursor-pointer text-gray-800 focus:outline-none active:outline-none" />
        </IconButton>
        <IconButton className="focus:outline-none active:outline-none">
          <DeleteIcon className="px-1 w-9 h-9 cursor-pointer text-gray-800 focus:outline-none active:outline-none" />
        </IconButton>
      </div>
    </div>
  )
}

export default StickyNote
