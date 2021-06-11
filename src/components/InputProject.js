import { Button, IconButton, InputBase, Paper, Collapse } from '@material-ui/core'
import React, { useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import db from '../utils/firebase';
import { useStateValue } from '../utils/StateProvider'

function InputCard() {
  const [cardTitle, setCardTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  // eslint-disable-next-line
  const [state, dispatch] = useStateValue();

  const handleChange = (e) => {
    setCardTitle(e.target.value);
  }

  function handleNewProject() {
    if (cardTitle === "") {
      setInvalidInput(true);
      return
    } else {
      setInvalidInput(false);
    }

    db.collection(state.user.email).add({
      projectName: cardTitle,
      backgroundColor: 'bg-[#111E2F]'
    }).then().catch(err => {
      console.error(err);
    })
    setOpen(false);
    setCardTitle('');
  }

  function handleClearIcon() {
    setCardTitle('');
    setOpen(false);
  }

  return (
    <>
      {!open ? (
        <div onClick={()=>setOpen(true)} className="bg-gray-400 rounded-lg hover:bg-gray-300 m-5 px-5 py-16 w-full xs:max-w-xs flex flex-col flex-grow justify-center place-items-center cursor-pointer">
          <Collapse in={open}>
            <div className="">
              <Paper className="m-1 pb-4">
                <InputBase onChange={handleChange} onBlur={()=>setOpen(false)} value={cardTitle} multiline fullWidth className="m-1 pb-2" placeholder="Enter a project name"/>
              </Paper>
            </div>
            <div className="m-1 w-20 whitespace-nowrap">
              <Button onClick={()=>handleNewProject()} className="bg-green-500 text-white focus:outline-none hover:bg-green-400 cursor-pointer"> Add Card </Button>
              <IconButton onClick={()=>handleClearIcon()} className="focus:outline-none cursor-pointer">
                <ClearIcon className="focus:outline-none"/>
              </IconButton>
              <p className={`text-red-500 text-lg animate-fadeOut pointer-events-none ${!invalidInput && "hidden"}`}> Invalid project Name! </p>
            </div>
          </Collapse>
          <Collapse in={!open}>
            <h3 className="text-center text-xl xs:text-2xl font-semibold animate-bounce flex flex-1">
              + New project
            </h3>
          </Collapse>
        </div>  
      ) : (
        <div className="bg-gray-300 rounded-lg hover:bg-gray-300 m-5 px-5 py-16 w-full xs:max-w-xs flex flex-col flex-grow justify-center place-items-center">
          <Collapse in={open}>
            <div className="">
              <Paper className="m-1 pb-4">
                <InputBase onChange={handleChange} onBlur={()=>setOpen(false)} value={cardTitle} multiline fullWidth className="m-1 pb-2" placeholder="Enter a project name"/>
              </Paper>
            </div>
            <div className="m-1 w-20 whitespace-nowrap">
              <Button onClick={()=>handleNewProject()} className="bg-green-500 text-white focus:outline-none hover:bg-green-400 cursor-pointer"> Add Card </Button>
              <IconButton onClick={()=>handleClearIcon()} className="focus:outline-none cursor-pointer">
                <ClearIcon className="focus:outline-none"/>
              </IconButton>
              <p className={`text-red-500 text-lg animate-fadeOut pointer-events-none ${!invalidInput && "hidden"}`}> Invalid project Name! </p>
            </div>
          </Collapse>
          <Collapse in={!open}>
            <h3 onClick={() => setOpen(true)} className="text-center text-xl xs:text-2xl font-semibold animate-bounce flex flex-1">
              + New project
            </h3>
          </Collapse>
        </div>
      )}
    </>
    )
}

export default InputCard
