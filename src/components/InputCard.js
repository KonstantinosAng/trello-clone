import { Button, IconButton, InputBase, Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';

function InputCard({ activeProjectNameListCardCollection, setOpen, cardPosition, open, listPosition }) {
  const [cardTitle, setCardTitle] = useState('');
  const handleChange = (e) => {
    setCardTitle(e.target.value);
  }

  /* Create new card */
  async function handleNewCard() {
    if (cardTitle.trim() !== '') {
      await activeProjectNameListCardCollection.add({
        position: cardPosition,
        taskTitle: cardTitle.trim()
      }).then().catch(error => {
        console.error(error);
      })
      setOpen(false);
      setCardTitle('');
    }
  }
  
  /* Handle Project Input focus */
  useEffect(() => {
    function handleFocusInput() {
      if (open) {
        document.getElementById(`input__card__root__${listPosition}`).focus();
      }
    }
    handleFocusInput()
  }, [open, listPosition])

  /* Handle user blur and close input */
  const handleBlur = () => {
    setOpen(false);
  }

  /* Handle Clear Icon */
  const handleClearIcon = () => {
    setOpen(false);
    setCardTitle('');
  }

  return (
    <div tabIndex={-1} onMouseLeave={()=>handleBlur()} className="focus:outline-none active:outline-none">
      <div className="">
        <Paper className="m-1 pb-4 shadow-lg">
          <InputBase id={`input__card__root__${listPosition}`} onChange={handleChange} value={cardTitle} multiline fullWidth className="m-1 pb-2" placeholder="Enter a task"/>
        </Paper>
      </div>
      <div className="m-1 w-20 whitespace-nowrap">
        <Button onClick={()=>handleNewCard()} className="bg-green-500 text-white font-semibold shadow-sm focus:outline-none hover:bg-green-400"> Add Card </Button>
        <IconButton onClick={()=>handleClearIcon()} className="ml-2 focus:outline-none shadow-sm">
          <ClearIcon className="focus:outline-none"/>
        </IconButton>
      </div>
    </div>
  )
}

export default InputCard
