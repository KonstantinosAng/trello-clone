import { Button, IconButton, InputBase, Paper, Collapse } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import { useStateValue } from '../utils/StateProvider'
import { createProject } from '../utils/functions';

function InputProject() {
  const [cardTitle, setCardTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  // eslint-disable-next-line
  const [state, dispatch] = useStateValue();

  /* Update list title */
  const handleChange = (e) => {
    setCardTitle(e.target.value);
  }

  /* Create project */
  async function handleNewProject() {
    
    if (cardTitle.trim() === "") {
      setInvalidInput(true);
      return
    } else {
      setInvalidInput(false);
    }

    /* Create project with default values */
    await createProject(state.user.email, cardTitle.trim(), 'bg-indigo-500', 'blank', false)
    
    setOpen(false);
    setCardTitle('');
  }

  /* Hide project input */
  function handleClearIcon() {
    setOpen(false);
    setCardTitle('');
  }

  /* Handle Project Input focus */
  useEffect(() => {
    function handleFocusInput() {
      if (open) {
        document.getElementById('input__project__root').focus();
      }
    }
    handleFocusInput()
  }, [open])

  return (
    <>
      {!open ? (
        <div onClick={()=>setOpen(true)} className="bg-gray-400 rounded-lg hover:bg-gray-300 m-5 px-5 py-16 w-full xs:max-w-xs flex flex-col flex-grow justify-center place-items-center cursor-pointer">
          <Collapse in={open}>
            <div className="">
              <Paper className="m-1 pb-4">
                <InputBase onChange={handleChange} value={cardTitle} multiline fullWidth className="m-1 pb-2" placeholder="Enter a project name"/>
              </Paper>
            </div>
            <div className="m-1 w-20 whitespace-nowrap">
              <Button onClick={()=>handleNewProject()} className="bg-green-500 text-white font-semibold focus:outline-none hover:bg-green-400 cursor-pointer"> Add Card </Button>
              <IconButton onClick={()=>handleClearIcon()} className="ml-2 focus:outline-none cursor-pointer">
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
        <div tabIndex={-1} className="bg-gray-300 rounded-lg hover:bg-gray-300 m-5 p-[1.3rem] w-full xs:max-w-xs flex flex-col flex-grow justify-center place-items-center">
          <Collapse in={open}>
            <div className="">
              <Paper className="m-1 pb-4 shadow-xl">
                <InputBase id="input__project__root" onChange={handleChange} value={cardTitle} multiline fullWidth className="m-1 pb-2" placeholder="Enter a project name"/>
              </Paper>
            </div>
            <div className="m-1 w-20 whitespace-nowrap">
              <Button onClick={()=>handleNewProject()} className="bg-green-500 text-white shadow-xl font-semibold focus:outline-none hover:bg-green-400 cursor-pointer"> Add Card </Button>
              <IconButton onClick={()=>handleClearIcon()} className="ml-2 shadow-sm focus:outline-none cursor-pointer">
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

export default InputProject
