import React, { useEffect } from 'react';
import { Typography, InputBase } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

function Title({ id, setListMenu, listTitle, setListTitle, open, setOpen, setUpdateTitle }) {
  
  /* Update title input value */
  function updateInput(event) {
    setListTitle(event.target.value);
  }

  /* Toggle update database title */
  const handleBlur = () => {
    setOpen(!open)
    setUpdateTitle(true);
  }

  const handleListMenu = () => {
    setListMenu(true)
  }

  /* Handle focus Input on click */
  useEffect(() => {
    if (open) {
      document.getElementById(id)?.focus();
    }
  }, [open, id])

  return (
    <div>
      {open ? (
          <div>
            <InputBase id={id} fullWidth className="m-1 focus:bg-[#ddd] flex-grow text-lg font-bold" onBlur={()=>handleBlur()} value={listTitle} onChange={(e)=>updateInput(e)}/>
          </div>
        ) : (
          <div className="flex m-1 relative">
            <Typography onClick={()=>setOpen(!open)} className="m-1 flex-grow text-lg font-bold cursor-pointer"> {listTitle} </Typography>
            <MoreHorizIcon onClick={()=>handleListMenu()} className="cursor-pointer"/>
          </div>
        )
      }
    </div>
  )
}

export default Title
