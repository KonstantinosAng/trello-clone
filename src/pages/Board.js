import React, { useEffect } from 'react'
import List from '../components/List';
import { actionTypes } from '../utils/reducer';
import { useStateValue } from '../utils/StateProvider';
import { useParams, useHistory } from 'react-router-dom';
import db from '../utils/firebase';


function Board() {
  
  const [state, dispatch] = useStateValue();
  let { id } = useParams();
  const history = useHistory()
  
  useEffect(() => {
    function handleProjectId() {
      const params = new URLSearchParams()
      
      db.collection(state.user.email).doc(id).get().then(docSnapshot => {
        if (docSnapshot.exists) {
          params.append('q', true);
          history.push({search: params.toString()})
          dispatch({
            type: actionTypes.SET_ACTIVE_PROJECT,
            activeProject: id
          })
        } else {
          params.append('=', 'project not found')
          window.location.replace('/error/' + params.toString())
        }
      })
    }
    handleProjectId()
  }, [])

  return (
    <div className="bg-[#111E2F] h-screen">
      {/* Header */}
      {/* Lists */}
      <List />
    </div>
  )
}

export default Board
