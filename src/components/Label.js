import React from 'react';

function Label({ color, activeProjectNameListCardLabelsCollection, menu }) {

  /* Handle label input */
  async function handleLabelInput() {
    let found = false
    /* Search if label exists */
      await activeProjectNameListCardLabelsCollection.where('color', '==', color).get().then(docSnapshot => {
        docSnapshot.forEach(doc => {
          if (doc?.data()?.color === color) {
            found = true;
          }
        });
      }).catch(error => console.error(error))
      /* If label does not exists add it */
      if (!found) {
          await activeProjectNameListCardLabelsCollection.add({
          color: color
        }).then().catch(error => console.error(error))
      }
  }

  return (
    <>
    {menu ? (
      <div onClick={()=>handleLabelInput()} className={`${color} w-full flex-grow h-full`} />
    ) :
      <div className={`${color} w-10 h-[0.5rem] rounded-lg ml-1 my-[0.2rem]`}/>
    }
    </>
  )
}

export default Label
