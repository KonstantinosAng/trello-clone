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
        setBackgroundColor(docSnapshot.data().backgroundColor);
      })
    }
    pullBackgroundColor()
  }, [])

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

  return (
    <div className={`${backgroundColor} h-screen w-full overflow-y-auto`}>
      {/* Header */}
      <BoardHeader setBackgroundColor={setBackgroundColor} name={activeProjectName}/>
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
