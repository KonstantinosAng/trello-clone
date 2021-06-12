import React, { useEffect, useState } from 'react'
import List from '../components/List';
import BoardHeader from '../components/BoardHeader';
import { actionTypes } from '../utils/reducer';
import { useStateValue } from '../utils/StateProvider';
import { useParams, useHistory } from 'react-router-dom';
import db from '../utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import InputList from '../components/InputList';


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
          params.append('=', 'project not found')
          history.push(`/error/${params.toString()}`)
        }
      }).catch(error => console.error(error))
    }
    handleProjectId()
  }, [projectID, state.user.email, history, dispatch])

  /* Pull color only on restart */
  useEffect(() => {
    async function pullBackgroundColor() {
      await db.collection(state.user.email).doc(projectID).get().then(docSnapshot => {
        if (docSnapshot?.data().backgroundColor !== 'blank') {
          setBackgroundColor(docSnapshot.data().backgroundColor);
        }
      })
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
        if (docSnapshot?.data().backgroundImage !== 'blank') {
          setPhotoUrl(docSnapshot.data().backgroundImage);
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
        console.log(docSnapshot.docs.length)
        setListPosition(docSnapshot.docs.length);
      })
    }
    calculateNewListPosition()
  }, [state.user.email, projectID, lists])

  return (
    <div id="board__root__element" className={`${backgroundColor} h-screen w-full overflow-y-auto`}>
      {/* Header */}
      <BoardHeader setPhotoUrl={setPhotoUrl} setBackgroundColor={setBackgroundColor} name={activeProjectName} setActiveProjectName={setActiveProjectName}/>
      {/* Lists */}
      <div className="flex flex-grow">
        {lists?.docs.map(doc => (
          <List listID={doc.id} key={doc.id} title={doc.data().title} activeProjectNameListsCollection={activeProjectNameListsCollection}/>
        ))}
        <InputList activeProjectNameListsCollection={activeProjectNameListsCollection} listPosition={listPosition}/>
      </div>
    </div>
  )
}

export default Board
