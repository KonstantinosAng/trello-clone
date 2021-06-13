import { Collapse, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import InputCard from './InputCard';

function InputContainer({ activeProjectNameListCardCollection, inputName, cardPosition, listPosition }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="mt-2">
      <Collapse in={open}>
        <InputCard listPosition={listPosition} open={open} activeProjectNameListCardCollection={activeProjectNameListCardCollection} cardPosition={cardPosition} setOpen={setOpen}/>
      </Collapse>
      <Collapse in={!open}>
        <Paper onClick={()=>setOpen(!open)} elevation={0} className="cursor-pointer p-1 pl-2 m-1 mt-0 bg-[#EBECF0] hover:bg-gray-300">
          <Typography className="">
            + {inputName}
          </Typography>
        </Paper>
      </Collapse>
    </div>
  )
}

export default InputContainer
