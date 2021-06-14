import React, { useEffect, useState } from 'react';
import { Paper, IconButton, InputBase } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

function Card({ title, id, position, activeProjectNameListCardCollection }) {
  const [showInput, setShowInput] = useState(false);
  const [cardMenu, setCardMenu] = useState(false);
  const [inputValue, setInputValue] = useState(title);

  /* Handle Update card title */
  const handleCardUpdate = () => {
    setShowInput(true);
  }

  /* Handle user focus input */
  useEffect(() => {
    if (showInput) {
      document.getElementById(id)?.focus();
    }
  }, [showInput, id])

  /* Handle update card title */
  const handleBlurInput = async () => {
    if (inputValue.trim() !== '') {
      await 
        activeProjectNameListCardCollection.doc(id).update({
          taskTitle: inputValue.trim()
        })
      setShowInput(false);
    }
  }

  /* Handle Card menu */
  const handleClick = () => {
    setCardMenu(true);
  }

  /* Handle delete card instance and update docs position */
  const handleDeleteCard = async () => {
    await 
      activeProjectNameListCardCollection.where('position', '>', position)
      .orderBy('position')
      .get()
      .then(async (docSnapshot) => {
        for (const doc of docSnapshot.docs) {
          await
            activeProjectNameListCardCollection.doc(doc.id).update({
              position: doc.data().position - 1
            }).then().catch(error => {
              console.error(error);
            })
        }
      })
    await activeProjectNameListCardCollection.doc(id).delete().then().catch(error => console.error(error));
  }

  return (
    <Draggable draggableId={id} index={position}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} className="shadow-lg cursor-pointer">
          <Paper {...provided.dragHandleProps} onMouseLeave={()=>setCardMenu(false)} className="pl-3 m-1 border-[1px] border-gray-300 hover:bg-gray-300 rounded-md flex items-center">
            {showInput 
              ? 
              <InputBase id={id} className="flex-grow" value={inputValue} onChange={(e)=>setInputValue(e.target.value)} onBlur={()=>handleBlurInput()} />
              :
              <h3 onClick={()=>handleClick()} className="flex-grow text-lg font-semibold"> {title} </h3>
            }
            <IconButton onClick={()=>handleCardUpdate()} className="hover:bg-gray-400 text-[0.8rem] p-[0.5rem] focus:outline-none">
              <EditIcon />
            </IconButton>
            {cardMenu && (
              <>
              <AddIcon />
              <DeleteIcon onClick={()=>handleDeleteCard()} className="w-10 h-full bg-red-500 rounded-r-md p-[0.4rem] text-gray-800 focus:outline-none hover:bg-red-600 shadow-inner" />
              </>
            )}
          </Paper>
        </div>
      )}
    </Draggable>
  )
}

export default Card
