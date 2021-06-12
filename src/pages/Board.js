import React, { useEffect, useState } from 'react'
import List from '../components/List';
import BoardHeader from '../components/BoardHeader';
import { actionTypes } from '../utils/reducer';
import { useStateValue } from '../utils/StateProvider';
import { useParams, useHistory } from 'react-router-dom';
import db from '../utils/firebase';


function Board() {
  
  const [state, dispatch] = useStateValue();
  const [activeProjectName, setActiveProjectName] = useState();
  const [backgroundColor, setBackgroundColor] = useState('');
  const [photoUrl, setPhotoUrl] = useState('')
  let { id } = useParams();
  const history = useHistory()
  
  /* Search for project in database */
  useEffect(() => {
    function handleProjectId() {
      const params = new URLSearchParams()
      
      db.collection(state.user.email).doc(id).get().then(docSnapshot => {
        if (docSnapshot.exists) {
          setActiveProjectName(docSnapshot.data().projectName);
          params.append('q', true);
          history.push({search: params.toString()})
          dispatch({
            type: actionTypes.SET_ACTIVE_PROJECT,
            activeProject: id
          })
        } else {
          params.append('=', 'project not found')
          history.push(`/error/${params.toString()}`)
        }
      }).catch(error => console.error(error))
    }
    handleProjectId()
  }, [id, state.user.email, history, dispatch])

  /* Pull color only on restart */
  useEffect(() => {
    function pullBackgroundColor() {
      db.collection(state.user.email).doc(id).get().then(docSnapshot => {
        if (docSnapshot.data().backgroundColor !== 'blank') {
          setBackgroundColor(docSnapshot.data().backgroundColor);
        }
      })
    }
    pullBackgroundColor()
  }, [state.user.email, id])

  /* Update Background color */
  useEffect(() => {
    function updateBackgroundColor() {
      db.collection(state.user.email).doc(id).update({
        backgroundColor: backgroundColor
      })
    }
    if (backgroundColor !== '') {
      updateBackgroundColor()
    }
  }, [id, state.user.email, backgroundColor])

  /* Pull imageBackground only on restart */
  useEffect(() => {
    function pullBackgroundImage() {
      db.collection(state.user.email).doc(id).get().then(docSnapshot => {
        if (docSnapshot.data().backgroundImage !== 'blank') {
          setPhotoUrl(docSnapshot.data().backgroundImage);
        }
      })
    }
    pullBackgroundImage()
  }, [state.user.email, id])

  /* Update image background */
  useEffect(() => {
    function updateBackgroundImage() {
      db.collection(state.user.email).doc(id).update({
        backgroundImage: photoUrl
      })
    }
    if (photoUrl !== '') {
      updateBackgroundImage()
    }
  }, [state.user.email, id, photoUrl])

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

  return (
    <div id="board__root__element" className={`${backgroundColor} h-screen w-full overflow-y-auto`}>
      {/* Header */}
      <BoardHeader setPhotoUrl={setPhotoUrl} setBackgroundColor={setBackgroundColor} name={activeProjectName}/>
      {/* Lists */}
      <div className="flex flex-grow">
        <List title="Todo"/>
        <List title="Assigned"/>
        <List title="Testing"/>
        <List title="Done"/>
      </div>
    </div>
  )
}

export default Board
