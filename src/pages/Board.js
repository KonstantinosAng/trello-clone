import React, { useEffect, useState } from 'react'
import List from '../components/List';
import BoardHeader from '../components/BoardHeader';
import { actionTypes } from '../utils/reducer';
import { useStateValue } from '../utils/StateProvider';
import { useParams, useHistory } from 'react-router-dom';
import db, { auth } from '../utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import InputList from '../components/InputList';
import LoadingPage from './LoadingPage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


function Board() {
  
  const [state, dispatch] = useStateValue();
  const [activeProjectName, setActiveProjectName] = useState('');
  const [activeProjectNameListsCollection, setActiveProjectNameListsCollection] = useState();
  const [backgroundColor, setBackgroundColor] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [listPosition, setListPosition] = useState(0);
  const { projectID } = useParams();
  const history = useHistory()
  const [ lists ] = useCollection(activeProjectNameListsCollection?.orderBy('position'));
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

  /* Update new List Position */
  useEffect(() => {
    async function calculateNewListPosition() {
      await db.collection(state.user.email).doc(projectID).collection('lists').get().then(docSnapshot => {
        setListPosition(docSnapshot.docs.length);
      })
    }
    calculateNewListPosition()
  }, [state.user.email, projectID, lists])

  if (loading) {
    return <LoadingPage />
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="board__root__element" className={`${backgroundColor} h-screen w-full overflow-y-auto`}>
        {/* Header */}
        <BoardHeader history={history} setPhotoUrl={setPhotoUrl} setBackgroundColor={setBackgroundColor} name={activeProjectName} setActiveProjectName={setActiveProjectName}/>
        {/* Lists */}
        <div className="flex flex-grow">
          {lists?.docs.map(doc => (
            <List listPosition={doc.data().position} listID={doc.id} key={doc.id} title={doc.data().title} activeProjectNameListsCollection={activeProjectNameListsCollection}/>
          ))}
          <InputList activeProjectNameListsCollection={activeProjectNameListsCollection} listPosition={listPosition}/>
        </div>
      </div>
    </DndProvider>
  )
}

export default Board
