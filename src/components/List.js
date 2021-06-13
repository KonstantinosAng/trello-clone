import React, { useEffect, useState } from 'react';
import { CssBaseline, Paper } from '@material-ui/core';
import Title from './Title.js';
import Card from './Card.js';
import InputContainer from './InputContainer.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Droppable } from 'react-beautiful-dnd';

function List({ listID, title, activeProjectNameListsCollection, listPosition }) {

  const [ cards ] = useCollection(activeProjectNameListsCollection?.doc(listID).collection('tasks').orderBy('position', 'asc'));
  const [cardPosition, setCardPosition] = useState(0);
  const [listTitle, setListTitle] = useState(title);
  const [open, setOpen] = useState(false);
    
  /* Update card position */
  useEffect(() => {
    async function calculateNewCardPosition() {
      await activeProjectNameListsCollection.doc(listID).collection('tasks').get().then(docSnapshot => {
        setCardPosition(docSnapshot.docs.length);
      })
    }
    calculateNewCardPosition()
  }, [activeProjectNameListsCollection, listID, cards, cardPosition])

  /* Update List title */
  useEffect(() => {
    async function updateListTitle() {
      if (!open) {
        await activeProjectNameListsCollection.doc(listID).update({
          title: listTitle
        }).then().catch(error => {
          console.error(error)
        })
      }
    }
    updateListTitle()
  }, [open, listTitle, activeProjectNameListsCollection, listID])

  return (
    <div>
      <Paper className="w-80 bg-[#EBECF0] ml-5 flex flex-col flex-grow shadow-2xl">
        <CssBaseline />
        <Title listTitle={listTitle} setListTitle={setListTitle} open={open} setOpen={setOpen}/>
        <Droppable droppableId={listID}>
          {(provided)=>(
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {cards?.docs.map(doc => (
                doc.data().taskTitle ? (
                  <Card key={doc.id} id={doc.id} title={doc.data().taskTitle} position={doc.data().position} />
                ) : (
                  <span></span>
                )
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <InputContainer listPosition={listPosition} cardPosition={cardPosition} activeProjectNameListCardCollection={activeProjectNameListsCollection.doc(listID).collection('tasks')} inputName="Add a Card"/>
      </Paper>
    </div>
  )
}

export default List
