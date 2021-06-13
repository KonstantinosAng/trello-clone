import React from 'react';
import { Typography, InputBase } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

function Title({ listTitle, setListTitle, open, setOpen }) {
  
  /* Update title input value */
  function updateInput(event) {
    setListTitle(event.target.value);
  }

  return (
    <div>
      {open ? (
          <div>
            <InputBase fullWidth className="m-1 focus:bg-[#ddd] flex-grow text-lg font-bold" onBlur={()=>setOpen(!open)} value={listTitle} onChange={(e)=>updateInput(e)}/>
          </div>
        ) : (
          <div className="flex m-1">
            <Typography onClick={()=>setOpen(!open)} className="m-1 flex-grow text-lg font-bold cursor-pointer"> {listTitle} </Typography>
            <MoreHorizIcon className="cursor-pointer"/>
          </div>
        )
      }
    </div>
  )
}

export default Title
