import React, { Suspense, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { actionTypes } from '../utils/reducer';
import { useStateValue } from '../utils/StateProvider';
import db from '../utils/firebase';
import { createCollaborativeProject, searchUser } from '../utils/functions';
import LoadingElement from '../components/LoadingElement';
const BoardHeader = React.lazy(() => import('../components/BoardHeader'));
const List = React.lazy(() => import('../components/List'));
const InputList = React.lazy(() => import('../components/InputList'));

function Board({ location }) {
  
  const [state, dispatch] = useStateValue();
  const [activeProjectName, setActiveProjectName] = useState('');
  const [activeProjectNameListsCollection, setActiveProjectNameListsCollection] = useState();
  const [backgroundColor, setBackgroundColor] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [listPosition, setListPosition] = useState(0);
  const [collaborationUserEmail, setCollaborationUserEmail] = useState('');
  const [collaborationUserNotFound, setCollaborationUserNotFound] = useState(false);
  const [submitEmail, setSubmitEmail] = useState(false);
  const [authorImageURL, setAuthorImageURL] = useState('')
  const { projectID, collaboration, collaborationUser } = useParams();
  const history = useHistory()
  const [ lists ] = useCollection(activeProjectNameListsCollection?.orderBy('position', 'asc'));
  const [ collaborationUsers ] = useCollection(db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).collection('collaborationUsers'))

  useEffect(() => {
    /* Handle collaboration */
    if (collaboration === 'true') {
      dispatch({
        type: actionTypes.SET_USER_EMAIL,
        userEmail: collaborationUser
      })
    }
  }, [collaboration, collaborationUser, dispatch, state.user.email])
  
  /* Search for project in database */
  useEffect(() => {
    async function handleProjectId() {
      const params = new URLSearchParams()
      if (state.userEmail !== 'null') {
        await db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).get().then(docSnapshot => {
          if (docSnapshot?.exists) {
            setActiveProjectName(docSnapshot.data().projectName);
            setActiveProjectNameListsCollection(db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).collection('lists'));
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
        /* Update author image */
        await db.collection('users').doc(state.userEmail).get().then(doc => setAuthorImageURL(doc.data().userImageURL))
      }
    }
    handleProjectId()
  }, [projectID, state.user, history, dispatch, location.state, state.userEmail, collaboration, collaborationUser])

  /* Pull color only on restart */
  useEffect(() => {
    async function pullBackgroundColor() {
      await db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).get().then(docSnapshot => {
        if (docSnapshot?.exists) {
          if (docSnapshot.data().backgroundColor !== 'blank') {
            setBackgroundColor(docSnapshot.data().backgroundColor);
          }
        }
      }).catch(error => console.error(error))
    }
    pullBackgroundColor()
  }, [state.userEmail, projectID])

  /* Update Background color */
  useEffect(() => {
    async function updateBackgroundColor() {
      await db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).update({
        backgroundColor: backgroundColor
      })
    }
    if (backgroundColor !== '') {
      updateBackgroundColor()
    }
  }, [projectID, state.userEmail, backgroundColor])

  /* Pull imageBackground only on restart */
  useEffect(() => {
    async function pullBackgroundImage() {
      await db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).get().then(docSnapshot => {
        if (docSnapshot?.exists) {
          if (docSnapshot?.data().backgroundImage !== 'blank') {
            setPhotoUrl(docSnapshot.data().backgroundImage);
          }
        }
      })
    }
    pullBackgroundImage()
  }, [state.userEmail, projectID])

  /* Update image background */
  useEffect(() => {
    async function updateBackgroundImage() {
      await db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).update({
        backgroundImage: photoUrl
      })
    }
    if (photoUrl !== '') {
      updateBackgroundImage()
    }
  }, [state.userEmail, projectID, photoUrl])

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
      await db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).update({
        projectName: activeProjectName
      })
    }
    if (activeProjectName !== '') {
      updateProjectName();
    }
  }, [activeProjectName, state.userEmail, projectID])

  /* Update List Title */

  /* Update new List Position */
  useEffect(() => {
    async function calculateNewListPosition() {
      await db.collection('users').doc(state.userEmail).collection(state.userEmail).doc(projectID).collection('lists').get().then(docSnapshot => {
        setListPosition(docSnapshot.docs.length);
      })
    }
    calculateNewListPosition()
  }, [state.userEmail, projectID, lists])

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
              db.collection('users').doc(state.userEmail)
                .collection(state.userEmail).doc(projectID)
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
                        db.collection('users').doc(state.userEmail)
                          .collection(state.userEmail).doc(projectID)
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
              db.collection('users').doc(state.userEmail)
                .collection(state.userEmail).doc(projectID)
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
                        db.collection('users').doc(state.userEmail)
                          .collection(state.userEmail).doc(projectID)
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
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
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
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
              .collection('lists').doc(source.droppableId)
              .collection('tasks').doc(draggableId)
              .get()
              .then(docSnapshot => {
                draggedTitle = docSnapshot.data().taskTitle;
              })
          await
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
              .collection('lists').doc(source.droppableId)
              .collection('tasks').doc(draggableId)
              .collection('labels').get().then(docSnapshot => {
                for (const label of docSnapshot.docs) {
                  draggedLabelData.push(label.data().color)
                }  
              })
          /* Update position on the source list */
          await 
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
              .collection('lists').doc(source.droppableId)
              .collection('tasks')
              .where('position', '>', source.index)
              .orderBy('position')
              .get()
              .then(async (docSnapshot) => {
                for (const doc of docSnapshot.docs) {
                  const pos = doc.data().position;
                  await 
                    db.collection('users').doc(state.userEmail)
                      .collection(state.userEmail).doc(projectID)
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
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
              .collection('lists').doc(destination.droppableId)
              .collection('tasks')
              .where('position', '>=', destination.index)
              .orderBy('position')
              .get()
              .then( async (docSnapshot) => {
                for (const doc of docSnapshot.docs) {
                  const pos = doc.data().position;
                  await 
                    db.collection('users').doc(state.userEmail)
                      .collection(state.userEmail).doc(projectID)
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
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
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
              db.collection('users').doc(state.userEmail)
                .collection(state.userEmail).doc(projectID)
                .collection('lists').doc(destination.droppableId)
                .collection('tasks').doc(newDocAddedID).collection('labels').add({
                  color: label
                })
          })
          /* Remove labels from card */
          await
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
              .collection('lists').doc(source.droppableId)
              .collection('tasks').doc(draggableId)
              .collection('labels')
              .get()
              .then(async labels => {
                for (const label of labels.docs) {
                  if (label.exists) {
                    await 
                      db.collection('users').doc(state.userEmail)
                        .collection(state.userEmail).doc(projectID)
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
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
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
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
              .collection('lists')
              .where('position', '<=', destination.index)
              .orderBy('position')
              .get()
              .then(async (docSnapshot) => {
                for (const doc of docSnapshot.docs) {
                  const pos = doc.data().position;
                  if (pos > source.index && pos <= destination.index) {
                    await 
                      db.collection('users').doc(state.userEmail)
                        .collection(state.userEmail).doc(projectID)
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
            db.collection('users').doc(state.userEmail)
              .collection(state.userEmail).doc(projectID)
              .collection('lists')
              .where('position', '>=', destination.index)
              .orderBy('position')
              .get()
              .then(async (docSnapshot) => {
                for (const doc of docSnapshot.docs) {
                  const pos = doc.data().position;
                  if (pos >= destination.index && pos < source.index) {
                    await 
                      db.collection('users').doc(state.userEmail)
                        .collection(state.userEmail).doc(projectID)
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
        db.collection('users').doc(state.userEmail)
          .collection(state.userEmail).doc(projectID)
          .collection('lists').doc(draggableId).update({
            position: destination.index
          }).then().catch(error=>console.log(error))
      }
    }
  }

  /* Handle user input */
  useEffect(() => {
    async function handleUserInput() {
      if (submitEmail) {
        if (await searchUser(collaborationUserEmail)) {
          /* User exists */
          await createCollaborativeProject(collaborationUserEmail, state.user.email, projectID)
          setCollaborationUserNotFound(false);
        } else {
          /* User does not exist */
          setCollaborationUserNotFound(true);
        }
        setSubmitEmail(false);
      }
    }
    handleUserInput()
  }, [collaborationUserEmail, submitEmail, state.user.email, projectID])

  return (
    <div id="board__root__element" className={`${backgroundColor} h-screen w-full overflow-y-auto`}>
        {/* Header */}
        <Suspense fallback={<LoadingElement />}>
          <BoardHeader 
          author={collaboration==="true"? false : true}
          authorImageURL={authorImageURL}
          setCollaborationUserNotFound={setCollaborationUserNotFound}
          collaborationUserNotFound={collaborationUserNotFound} 
          setSubmitEmail={setSubmitEmail} 
          setCollaborationUserEmail={setCollaborationUserEmail} 
          projectID={projectID}
          history={history}
          setPhotoUrl={setPhotoUrl}
          setBackgroundColor={setBackgroundColor} 
          name={activeProjectName} 
          setActiveProjectName={setActiveProjectName}
          collaborationUsers={collaborationUsers}
          />
        </Suspense>
        {/* Lists */}
        <div className="flex flex-grow">
          <DragDropContext onDragEnd={(event)=>handleDrag(event)}>
            <Droppable droppableId="list__drop__zone" type="list" direction="horizontal">
              {(provided)=>(
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex">
                  {lists?.docs.map(doc => (
                    <Suspense fallback={<LoadingElement/>} key={doc.id}>
                      <List listPosition={doc.data().position} listID={doc.id} title={doc.data().title} activeProjectNameListsCollection={activeProjectNameListsCollection}/>
                    </Suspense>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Suspense fallback={<LoadingElement />}>
            <InputList activeProjectNameListsCollection={activeProjectNameListsCollection} listPosition={listPosition}/>
          </Suspense>
        </div>
      </div>
  )
}

export default Board
