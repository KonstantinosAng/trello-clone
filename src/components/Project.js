import React from 'react';
import { actionTypes } from '../utils/reducer';
import { useStateValue } from '../utils/StateProvider';
import { useHistory } from 'react-router-dom';

function Project({ projectId, projectName }) {
  //eslint-disable-next-line
  const [state, dispatch] = useStateValue();
  const history = useHistory();

  const handleActiveProject = () => {

    dispatch({
      type: actionTypes.SET_ACTIVE_PROJECT,
      activeProject: projectId
    })
    history.push(`home/board/${projectId}`)
  }

  return (
    <div onClick={()=>handleActiveProject()} className="bg-gray-400 rounded-lg cursor-pointer hover:bg-gray-300 m-5 px-5 py-16 w-full xs:max-w-xs flex flex-grow justify-center place-items-center">
      <h3 className="text-center text-xl xs:text-2xl font-semibold">
        {projectName}
      </h3>
    </div>
  )
}

export default Project
