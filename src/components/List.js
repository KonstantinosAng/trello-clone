import React, { useEffect, useState } from 'react';
import { CssBaseline, Paper } from '@material-ui/core';
import Title from './Title.js';
import Card from './Card.js';
import InputContainer from './InputContainer.js';
import { useCollection } from 'react-firebase-hooks/firestore';

function List({ listID, title, activeProjectNameListsCollection, listPosition }) {

  const [ cards ] = useCollection(activeProjectNameListsCollection?.doc(listID).collection('tasks').orderBy('position'));
  const [cardPosition, setCardPosition] = useState(0);
  
  /* Update card position */
  useEffect(() => {
    async function calculateNewCardPosition() {
      await activeProjectNameListsCollection.doc(listID).collection('tasks').get().then(docSnapshot => {
        setCardPosition(docSnapshot.docs.length);
      })
    }
    calculateNewCardPosition()
  }, [activeProjectNameListsCollection, listID, cards, cardPosition])

  return (
    <div id={listID}>
      <Paper className="w-80 bg-[#EBECF0] ml-5 flex flex-col flex-grow shadow-2xl">
        <CssBaseline />
        <Title title={title}/>
        {cards?.docs.map(doc => (
          doc.data().taskTitle ? (
            <Card key={doc.id} title={doc.data().taskTitle} />
          ) : (
            <span></span>
          )
        ))}
        <InputContainer listPosition={listPosition} cardPosition={cardPosition} activeProjectNameListCardCollection={activeProjectNameListsCollection.doc(listID).collection('tasks')} inputName="Add a Card"/>
      </Paper>
    </div>
  )
}

export default List
