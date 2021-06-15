import React, { Suspense, useEffect, useState } from 'react';
import { CssBaseline, Paper } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import LoadingElement from './LoadingElement';
const InputContainer = React.lazy(() => import('./InputContainer.js'));
const Title = React.lazy(() => import('./Title.js'));
const Card = React.lazy(() => import('./Card.js'));

function List({ listID, title, activeProjectNameListsCollection, listPosition }) {

  const [ cards ] = useCollection(activeProjectNameListsCollection?.doc(listID).collection('tasks').orderBy('position', 'asc'));
  const [cardPosition, setCardPosition] = useState(0);
  const [listTitle, setListTitle] = useState(title);
  const [open, setOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(false);
  const [listMenu, setListMenu] = useState(false);
    
  /* Update card position */
  useEffect(() => {
    async function calculateNewCardPosition() {
      await activeProjectNameListsCollection.doc(listID).collection('tasks').get().then(docSnapshot => {
        setCardPosition(docSnapshot.docs.length);
      }).catch(error => {
        console.error(error)
      })
    }
    calculateNewCardPosition()
  }, [activeProjectNameListsCollection, listID, cards, cardPosition])

  /* Update List title */
  useEffect(() => {
    async function updateListTitle() {
      if (updateTitle) {
        if (listTitle.trim() !== '') {
          await activeProjectNameListsCollection.doc(listID).update({
            title: listTitle.trim()
          }).then().catch(error => {
            console.error(error)
          })
        }
        setUpdateTitle(false);
      }
    }
    updateListTitle()
  }, [activeProjectNameListsCollection, listID, updateTitle, listTitle])

  /* Handle Delete List */
  const handleListDeletion = async () => {
    await 
    activeProjectNameListsCollection.where('position', '>', listPosition)
      .orderBy('position')
      .get()
      .then(async (docSnapshot) => {
        for (const doc of docSnapshot.docs) {
          await
            activeProjectNameListsCollection.doc(doc.id).update({
                position: doc.data().position - 1
              }).then().catch(error => {
                console.error(error)
              })
        }
      })
    await activeProjectNameListsCollection.doc(listID).delete().then().catch(error => console.error(error));
  }

  return (
    <Draggable index={listPosition} draggableId={listID}>
      {(provided)=>(
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <Paper className="w-[21rem] bg-[#EBECF0] ml-5 flex flex-col flex-grow shadow-2xl rounded-md">
            <CssBaseline />
            <Suspense fallback={<LoadingElement/>}>
              <Title id={listID} listMenu={listMenu} setListMenu={setListMenu} listTitle={listTitle} setListTitle={setListTitle} open={open} setOpen={setOpen} setUpdateTitle={setUpdateTitle}/>
            </Suspense>
            <Droppable droppableId={listID} type="card">
              {(provided)=>(
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {cards?.docs.map(doc => (
                    doc.data().taskTitle ? (
                      <Suspense key={doc.id} fallback={<LoadingElement/>}>
                        <Card id={doc.id} title={doc.data().taskTitle} position={doc.data().position} activeProjectNameListCardCollection={activeProjectNameListsCollection.doc(listID).collection('tasks')}/>
                      </Suspense>
                    ) : (
                      <span></span>
                    )
                  ))}
                  {provided.placeholder}
                  <Suspense fallback={<LoadingElement/>}>
                    <InputContainer listPosition={listPosition} cardPosition={cardPosition} activeProjectNameListCardCollection={activeProjectNameListsCollection.doc(listID).collection('tasks')} inputName="Add a Card"/>
                  </Suspense>
                </div>
              )}
            </Droppable>
            {listMenu &&
              <div onClick={()=>handleListDeletion()} onMouseLeave={()=>setListMenu(false)} className="p-2 flex justify-center items-center font-semibold text-lg text-gray-800 bg-red-500 rounded-b-md shadow-inner cursor-pointer hover:bg-red-600">
                <DeleteIcon />
              </div>
            }
          </Paper>
        </div>
      )}
    </Draggable>
  )
}

export default List
