import { Collapse, Paper, Typography } from '@material-ui/core';
import React, { Suspense, useState } from 'react';
import LoadingElement from './LoadingElement';
const InputCard = React.lazy(() => import('./InputCard'));

function InputContainer({ activeProjectNameListCardCollection, inputName, cardPosition, listPosition }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="mt-2 rounded-md shadow-inner">
      <Collapse in={open}>
        <Suspense fallback={<LoadingElement/>}>
          <InputCard listPosition={listPosition} open={open} activeProjectNameListCardCollection={activeProjectNameListCardCollection} cardPosition={cardPosition} setOpen={setOpen}/>
        </Suspense>
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
