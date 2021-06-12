import { Button, Collapse, IconButton, InputBase, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import ClearIcon from '@material-ui/icons/Clear';

function InputList({ activeProjectNameListsCollection, listPosition }) {
  const [open, setOpen] = useState(false);
  const [listTitle, setListTitle] = useState('');

  /* Create new list */
  const handleNewList = async () => {
    if (listTitle.trim() !== '') {
      await activeProjectNameListsCollection.add({
        position: listPosition,
        title: listTitle
      }).then().catch(error => {
        console.error(error);
      })
      setOpen(false);
      setListTitle('');
    }
  }

  const handleBlur = (e) => {
    // e = e || window.event;
    // console.log(e.target.text)
    // console.log(e.srcElement)
    // console.log(e.target.textContent)
    // console.log(e.target.innerText)
    // console.log(e.target.tagName)
    // console.log(e.target.innerHTML)
    // console.log(e.target.id)
  }

  return (
    <div className="ml-4">
      <Collapse in={open}>
      <div className="">
        <Paper className="m-1 pb-4 shadow-2xl">
          <InputBase onChange={(e)=>setListTitle(e.target.value)} value={listTitle} onBlur={(e)=>handleBlur(e)} multiline fullWidth className="m-1 pb-2" placeholder="Enter a title"/>
        </Paper>
      </div>
      <div className="m-1 w-20 whitespace-nowrap">
        <Button onClick={()=>handleNewList()} className="bg-green-500 text-white font-semibold shadow-xl focus:outline-none hover:bg-green-400"> Add List </Button>
        <IconButton onClick={()=> setOpen(!open)} className="ml-2 focus:outline-none shadow-sm">
          <ClearIcon className="focus:outline-none"/>
        </IconButton>
      </div>
      </Collapse>
      <Collapse in={!open}>
        <Paper onClick={()=>setOpen(!open)} elevation={0} className="cursor-pointer p-1 pl-2 m-1 mt-0 bg-[#EBECF0] hover:bg-gray-300">
          <Typography className="">
            + Add a list
          </Typography>
        </Paper>
      </Collapse>
    </div>
  )
}

export default InputList
