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
  let { id } = useParams();
  const history = useHistory()
  
  useEffect(() => {
    function handleProjectId() {
      const params = new URLSearchParams()
      
      db.collection(state.user.email).doc(id).get().then(docSnapshot => {
        if (docSnapshot.exists) {
          setActiveProjectName(docSnapshot.data().projectName)
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

  return (
    <div className="bg-[#111E2F] h-screen w-full overflow-y-scroll">
      {/* Header */}
      <BoardHeader name={activeProjectName}/>
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
