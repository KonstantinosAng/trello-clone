import { Button, IconButton, InputBase, Paper } from '@material-ui/core'
import React, { useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';

function InputCard({ activeProjectNameListCardCollection, setOpen, cardPosition }) {
  const [cardTitle, setCardTitle] = useState('');

  const handleChange = (e) => {
    setCardTitle(e.target.value);
  }

  async function handleNewCard() {
    if (cardTitle.trim() !== '') {
      await activeProjectNameListCardCollection.add({
        position: cardPosition,
        taskTitle: cardTitle
      }).then().catch(error => {
        console.error(error);
      })
      setOpen(false);
      setCardTitle('');
    }
  }

  return (
    <div>
      <div className="">
        <Paper className="m-1 pb-4 shadow-lg">
          <InputBase onChange={handleChange} value={cardTitle} onBlur={()=>setOpen(false)} multiline fullWidth className="m-1 pb-2" placeholder="Enter a task"/>
        </Paper>
      </div>
      <div className="m-1 w-20 whitespace-nowrap">
        <Button onClick={()=>handleNewCard()} className="bg-green-500 text-white font-semibold shadow-sm focus:outline-none hover:bg-green-400"> Add Card </Button>
        <IconButton onClick={()=> setOpen(false)} className="ml-2 focus:outline-none shadow-sm">
          <ClearIcon className="focus:outline-none"/>
        </IconButton>
      </div>
    </div>
  )
}

export default InputCard
