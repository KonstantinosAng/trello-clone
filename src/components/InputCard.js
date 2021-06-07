import { Button, IconButton, InputBase, Paper } from '@material-ui/core'
import React, { useState, useContext } from 'react';
import ClearIcon from '@material-ui/icons/Clear';

function InputCard({ setOpen }) {
  const [cardTitle, setCardTitle] = useState('');

  const handleChange = (e) => {
    setCardTitle(e.target.value);
  }

  function handleNewCard() {
    setOpen(false);
  }

  return (
    <div>
      <div className="">
        <Paper className="m-1 pb-4">
          <InputBase onChange={handleChange} value={cardTitle} onBlur={()=>setOpen(false)} multiline fullWidth className="m-1 pb-2" placeholder="Enter a task"/>
        </Paper>
      </div>
      <div className="m-1 w-20 whitespace-nowrap">
        <Button onClick={()=>handleNewCard()} className="bg-green-500 text-white focus:outline-none hover:bg-green-400"> Add Card</Button>
        <IconButton onClick={()=> setOpen(false)} className="focus:outline-none">
          <ClearIcon className="focus:outline-none"/>
        </IconButton>
      </div>
    </div>
  )
}

export default InputCard
