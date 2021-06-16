import React, { Suspense, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { actionTypes } from '../utils/reducer';
import { useStateValue } from '../utils/StateProvider';
import db, { auth } from '../utils/firebase';
import LoadingPage from './LoadingPage';
import LoadingElement from '../components/LoadingElement';
const BoardHeader = React.lazy(() => import('../components/BoardHeader'));
const List = React.lazy(() => import('../components/List'));
const InputList = React.lazy(() => import('../components/InputList'));

function Board() {
  
  const [state, dispatch] = useStateValue();
  const [activeProjectName, setActiveProjectName] = useState('');
  const [activeProjectNameListsCollection, setActiveProjectNameListsCollection] = useState();
  const [backgroundColor, setBackgroundColor] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [listPosition, setListPosition] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [submitEmail, setSubmitEmail] = useState(false);
  const { projectID } = useParams();
  const history = useHistory()
  const [ lists ] = useCollection(activeProjectNameListsCollection?.orderBy('position', 'asc'));
  // eslint-disable-next-line
  const [_, loading] = useAuthState(auth);

  /* Search for project in database */
  useEffect(() => {
    async function handleProjectId() {
      const params = new URLSearchParams()
      await db.collection(state.user.email).doc(projectID).get().then(docSnapshot => {
        if (docSnapshot?.exists) {
          setActiveProjectName(docSnapshot.data().projectName);
          setActiveProjectNameListsCollection(db.collection(state.user.email).doc(projectID).collection('lists'));
          params.append('q', true);
          history.push({search: params.toString()})
          dispatch({
            type: actionTypes.SET_ACTIVE_PROJECT,
            activeProject: projectID
          })
        } else {
          /* Monitor user changed */
          let stateUser = false 
          if (state.user) {
            stateUser = true
          }
          params.append('q', 'project not found')
          params.append('user', stateUser)
          history.push({
            pathname: '/error/400',
            search: params.toString(),
            state: { stateUser: stateUser }
          })
        }
      }).catch(error => console.error(error))
    }
    handleProjectId()
  }, [projectID, state.user, history, dispatch])

  /* Pull color only on restart */
  useEffect(() => {
    async function pullBackgroundColor() {
      await db.collection(state.user.email).doc(projectID).get().then(docSnapshot => {
        if (docSnapshot?.exists) {
          if (docSnapshot.data().backgroundColor !== 'blank') {
            setBackgroundColor(docSnapshot.data().backgroundColor);
          }
        }
      }).catch(error => console.error(error))
    }
    pullBackgroundColor()
  }, [state.user.email, projectID])

  /* Update Background color */
  useEffect(() => {
    async function updateBackgroundColor() {
      await db.collection(state.user.email).doc(projectID).update({
        backgroundColor: backgroundColor
      })
    }
    if (backgroundColor !== '') {
      updateBackgroundColor()
    }
  }, [projectID, state.user.email, backgroundColor])

  /* Pull imageBackground only on restart */
  useEffect(() => {
    async function pullBackgroundImage() {
      await db.collection(state.user.email).doc(projectID).get().then(docSnapshot => {
        if (docSnapshot?.exists) {
          if (docSnapshot?.data().backgroundImage !== 'blank') {
            setPhotoUrl(docSnapshot.data().backgroundImage);
          }
        }
      })
    }
    pullBackgroundImage()
  }, [state.user.email, projectID])

  /* Update image background */
  useEffect(() => {
    async function updateBackgroundImage() {
      await db.collection(state.user.email).doc(projectID).update({
        backgroundImage: photoUrl
      })
    }
    if (photoUrl !== '') {
      updateBackgroundImage()
    }
  }, [state.user.email, projectID, photoUrl])

  /* Update Background Image */
  useEffect(() => {
    function addBackgroundImage() {
      if (photoUrl !== 'blank') {
        document.getElementById('board__root__element').style.backgroundImage = `url(${photoUrl})`
        document.getElementById('board__root__element').style.backgroundRepeat = 'no-repeat';
        document.getElementById('board__root__element').style.backgroundSize = 'cover';
        document.getElementById('board__root__element').style.boxSizing = 'border-box';
      } else {
        document.getElementById('board__root__element').style.backgroundImage = 'none';
      }
    }
    addBackgroundImage()
  }, [photoUrl])

  /* Update Project title */
  useEffect(() => {
    async function updateProjectName() {
      await db.collection(state.user.email).doc(projectID).update({
        projectName: activeProjectName
      })
    }
    if (activeProjectName !== '') {
      updateProjectName();
    }
  }, [activeProjectName, state.user.email, projectID])

  /* Update List Title */

  /* Update new List Position */
  useEffect(() => {
    async function calculateNewListPosition() {
      await db.collection(state.user.email).doc(projectID).collection('lists').get().then(docSnapshot => {
        setListPosition(docSnapshot.docs.length);
      })
    }
    calculateNewListPosition()
  }, [state.user.email, projectID, lists])

  /* Handle Drag End event */
  const handleDrag = async (event) => {
    const { destination, source, draggableId, type } = event;
    /* Update position of dragged element in same list */
    if (destination) {
      /* Handle card drag drop */
      if (type === 'card') {
        if (destination.droppableId === source.droppableId) {
          if (destination.index === source.index) {
            return
          }
          if (destination.index > source.index) {
            /* Update when the element is dragged lower in the list */
            await
              db.collection(state.user.email).doc(projectID)
                .collection('lists').doc(source.droppableId)
                .collection('tasks')
                .where('position', '<=', destination.index)
                .orderBy('position')
                .get()
                .then(async (docSnapshot) => {
                  for (const doc of docSnapshot.docs) {
                    const pos = doc.data().position;
                    if (pos > source.index && pos <= destination.index) {
                      await 
                        db.collection(state.user.email).doc(projectID)
                        .collection('lists').doc(source.droppableId)
                        .collection('tasks').doc(doc.id)
                        .update({
                          position: pos - 1
                        }).then().catch(error => {
                          console.error(error)
                        })
                    }
                  }
                  }).catch(error => {
                    console.error(error)
                  })
          } else {
            /* Update when the element is dragged higher on the list */
            /* Update pushed elements */
            await
              db.collection(state.user.email).doc(projectID)
                .collection('lists').doc(source.droppableId)
                .collection('tasks')
                .where('position', '>=', destination.index)
                .orderBy('position')
                .get()
                .then(async (docSnapshot) => {
                  for (const doc of docSnapshot.docs) {
                    const pos = doc.data().position;
                    if (pos >= destination.index && pos < source.index) {
                      await 
                        db.collection(state.user.email).doc(projectID)
                          .collection('lists').doc(source.droppableId)
                          .collection('tasks').doc(doc.id)
                          .update({
                            position: pos + 1
                          }).then().catch(error => {
                            console.error(error)
                          })
                    }
                  }
                }).catch(error => {
                  console.error(error)
                })
          }
          /*  update dragged element */
          await 
            db.collection(state.user.email).doc(projectID)
              .collection('lists').doc(source.droppableId)
              .collection('tasks').doc(draggableId)
              .update({
                position: destination.index 
              }).then()
              .catch(error => {
                console.error(error)
              })
        } else {
          /* Handle different list drop */
          /* Store dragged card data */
          let draggedTitle, draggedLabelData=[];
          await
            db.collection(state.user.email).doc(projectID)
            .collection('lists').doc(source.droppableId)
            .collection('tasks').doc(draggableId)
            .get()
            .then(docSnapshot => {
              draggedTitle = docSnapshot.data().taskTitle;
            })
          await
            db.collection(state.user.email).doc(projectID)
            .collection('lists').doc(source.droppableId)
            .collection('tasks').doc(draggableId)
            .collection('labels').get().then(docSnapshot => {
              for (const label of docSnapshot.docs) {
                draggedLabelData.push(label.data().color)
              }  
            })
          /* Update position on the source list */
          await 
            db.collection(state.user.email).doc(projectID)
              .collection('lists').doc(source.droppableId)
              .collection('tasks')
              .where('position', '>', source.index)
              .orderBy('position')
              .get()
              .then(async (docSnapshot) => {
                for (const doc of docSnapshot.docs) {
                  const pos = doc.data().position;
                  await 
                    db.collection(state.user.email).doc(projectID)
                      .collection('lists').doc(source.droppableId)
                      .collection('tasks').doc(doc.id)
                      .update({
                        position: pos - 1
                      }).then().catch(error => {
                        console.error(error)
                      })
                }
              }).catch(error => {
                console.error(error);
              })
          /* Update position on the destination list */
          await
            db.collection(state.user.email).doc(projectID)
              .collection('lists').doc(destination.droppableId)
              .collection('tasks')
              .where('position', '>=', destination.index)
              .orderBy('position')
              .get()
              .then( async (docSnapshot) => {
                for (const doc of docSnapshot.docs) {
                  const pos = doc.data().position;
                  await 
                    db.collection(state.user.email).doc(projectID)
                      .collection('lists').doc(destination.droppableId)
                      .collection('tasks').doc(doc.id)
                      .update({
                        position: pos + 1
                      }).then().catch(error => {
                        console.error(error)
                      })
                }
              }).catch(error => {
                console.error(error);
              })
          /* Add card to destination list */
          let newDocAddedID;
          await
            db.collection(state.user.email).doc(projectID)
              .collection('lists').doc(destination.droppableId)
              .collection('tasks').add({
                    position: destination.index,
                    taskTitle: draggedTitle
              }).then(doc => {
                console.log(doc)
                newDocAddedID = doc.id
              }).catch(error => {
                console.error(error);
              })
          /* Add labels too */
          draggedLabelData?.forEach(async (label) => {
            await
              db.collection(state.user.email).doc(projectID)
              .collection('lists').doc(destination.droppableId)
              .collection('tasks').doc(newDocAddedID).collection('labels').add({
                color: label
              })
          })
          /* Remove labels from card */
          await
            db.collection(state.user.email).doc(projectID)
              .collection('lists').doc(source.droppableId)
              .collection('tasks').doc(draggableId)
              .collection('labels')
              .get()
              .then(async labels => {
                for (const label of labels.docs) {
                  if (label.exists) {
                    await 
                      db.collection(state.user.email).doc(projectID)
                      .collection('lists').doc(source.droppableId)
                      .collection('tasks').doc(draggableId)
                      .collection('labels').doc(label.id)
                      .delete()
                      .then()
                      .catch(error => console.error(error))
                  }
                }
              })
          /* Remove card from source list */
          await
            db.collection(state.user.email).doc(projectID)
              .collection('lists').doc(source.droppableId)
              .collection('tasks').doc(draggableId).delete({recursive: true})
              .then().catch(error => {
                console.error(error);
              })
        }
      } else {
        /* Handle list drag drop */
        /* Handle same position */
        if (destination.index === source.index) {
          return
        } else if (destination.index > source.index) {
          /* Handle going to the right */
          /* Update list position */
          await
            db.collection(state.user.email).doc(projectID)
              .collection('lists')
              .where('position', '<=', destination.index)
              .orderBy('position')
              .get()
              .then(async (docSnapshot) => {
                for (const doc of docSnapshot.docs) {
                  const pos = doc.data().position;
                  if (pos > source.index && pos <= destination.index) {
                    await 
                      db.collection(state.user.email).doc(projectID)
                      .collection('lists').doc(doc.id)
                      .update({
                        position: pos - 1
                      }).then().catch(error => {
                        console.error(error)
                      })
                  }
                }
              }).catch(error => {
                console.log(error);
              })
        } else {
          /* Handle going to the left */
          /* Update list position */
          await
            db.collection(state.user.email).doc(projectID)
              .collection('lists')
              .where('position', '>=', destination.index)
              .orderBy('position')
              .get()
              .then(async (docSnapshot) => {
                for (const doc of docSnapshot.docs) {
                  const pos = doc.data().position;
                  if (pos >= destination.index && pos < source.index) {
                    await 
                      db.collection(state.user.email).doc(projectID)
                        .collection('lists').doc(doc.id)
                        .update({
                          position: pos + 1
                        }).then().catch(error => {
                          console.error(error)
                        })
                  }
                }
              }).catch(error => {
                console.error(error)
              })
        } 
        /* Update dragged list */
        await
        db.collection(state.user.email).doc(projectID)
          .collection('lists').doc(draggableId).update({
            position: destination.index
          }).then().catch(error=>console.log(error))     
      }
    }
  }

  /* Handle user input */
  useEffect(() => {
    if (submitEmail) {
      setSubmitEmail(false);
    }
  }, [userEmail, submitEmail])

  if (loading) {
    return (
      <Suspense fallback={<LoadingElement/>}>
        <LoadingPage />
      </Suspense>
      )
  }

  return (
    <div id="board__root__element" className={`${backgroundColor} h-screen w-full overflow-y-auto`}>
        {/* Header */}
        <Suspense fallback={<LoadingElement />}>
          <BoardHeader setSubmitEmail={setSubmitEmail} setUserEmail={setUserEmail} projectID={projectID} history={history} setPhotoUrl={setPhotoUrl} setBackgroundColor={setBackgroundColor} name={activeProjectName} setActiveProjectName={setActiveProjectName}/>
        </Suspense>
        {/* Lists */}
        <Suspense fallback={<LoadingElement />}>
          <div className="flex flex-grow">
            <DragDropContext onDragEnd={(event)=>handleDrag(event)}>
              <Droppable droppableId="list__drop__zone" type="list" direction="horizontal">
                {(provided)=>(
                  <div ref={provided.innerRef} {...provided.droppableProps} className="flex">
                    {lists?.docs.map(doc => (
                      <List listPosition={doc.data().position} listID={doc.id} key={doc.id} title={doc.data().title} activeProjectNameListsCollection={activeProjectNameListsCollection}/>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <InputList activeProjectNameListsCollection={activeProjectNameListsCollection} listPosition={listPosition}/>
          </div>
          </Suspense>
      </div>
  )
}

export default Board
