import React, { Suspense, useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Paper, IconButton, InputBase } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import LabelIcon from '@material-ui/icons/Label';
import LoadingElement from './LoadingElement';
import Label from './Label';
import { deleteCard } from '../utils/functions';
import { useStateValue } from '../utils/StateProvider';
const Labels = React.lazy(() => import('./Labels'));

function Card({ title, id, position, activeProjectNameListCardCollection, listID }) {
  const [showInput, setShowInput] = useState(false);
  const [cardMenu, setCardMenu] = useState(false);
  const [inputValue, setInputValue] = useState(title);
  const [showLabels, setShowLabels] = useState(false);
  //eslint-disable-next-line
  const [state, _] = useStateValue();
  const [ labels ] = useCollection(activeProjectNameListCardCollection?.doc(id).collection('labels'));

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

  /* Handle Card menu focus */
  useEffect(() => {
    if (cardMenu) {
      document.getElementById('card__menu__root').focus();
    }
  }, [cardMenu])

  /* Handle Mouse out */
  function handleMouseOut() {
    setCardMenu(false);
    setShowLabels(false);
  }

  return (
    <Draggable draggableId={id} index={position}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} className="shadow-lg cursor-pointer">
          <Paper onMouseLeave={()=>handleMouseOut()} onClick={()=>handleClick()} {...provided.dragHandleProps} className="m-1 border-[1px] border-gray-300 hover:bg-gray-300 rounded-md flex flex-col">
            {labels &&
              <div className="flex flex-grow flex-wrap justify-start items-start">
                {labels?.docs.map(label => (
                  <Label key={label.id} color={label?.data().color} menu={false} activeProjectNameListCardLabelsCollection={null}/>
                ))}
              </div>
            }
            <div className="flex flex-grow w-full items-center">
              {showInput 
                ? 
                <InputBase id={id} className="flex-grow pl-3" value={inputValue} onChange={(e)=>setInputValue(e.target.value)} onBlur={()=>handleBlurInput()} />
                :
                <div className={`flex-grow text-lg font-semibold py-1 pl-3`}> {title} </div>
              }
              <IconButton onClick={()=>handleCardUpdate()} className="hover:bg-gray-400 p-[0.5rem] focus:outline-none h-full">
                <EditIcon />
              </IconButton>
            </div>
            <div className="flex">
              {cardMenu && (
                <div id="card__menu__root" tabIndex={-1} className="text-gray-800 flex items-center border-t-2 border-gray-300 w-full h-[2.7rem] shadow-lg focus:outline-none">
                  <AddIcon className="bg-green-500 rounded-bl-md flex-grow h-full hover:bg-green-600 focus:outline-none active:outline-none" />
                  <LabelIcon onClick={()=>setShowLabels(!showLabels)} className="flex-grow h-full bg-indigo-500 hover:bg-indigo-600"/>
                  <DeleteIcon onClick={()=>deleteCard(state.userEmail, state.activeProject, listID, id, position)} className="bg-red-500 rounded-br-md flex-grow h-full focus:outline-none hover:bg-red-600" />
                </div>
              )}
            </div>
            <div className="flex">
              {showLabels && 
                <Suspense fallback={<LoadingElement/>}>
                  <Labels activeProjectNameListCardLabelsCollection={activeProjectNameListCardCollection?.doc(id).collection('labels')}/>
                </Suspense>
              }
            </div>
          </Paper>
        </div>
      )}
    </Draggable>
  )
}

export default Card
