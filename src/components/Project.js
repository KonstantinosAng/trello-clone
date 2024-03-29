import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { actionTypes } from '../store/reducer'
import { useStateValue } from '../store/StateProvider'
import PeopleIcon from '@material-ui/icons/People'

export default function Project({
	projectBackgroundImage,
	projectBackgroundColor,
	projectId,
	projectName,
	collaboration,
	collaborationUser,
}) {
	//eslint-disable-next-line
	const [state, dispatch] = useStateValue()
	const history = useHistory()
	const [background, setBackground] = useState('')

	/* Handle project clicked doc id and pass it on the query */
	const handleActiveProject = () => {
		dispatch({
			type: actionTypes.SET_ACTIVE_PROJECT,
			activeProject: projectId,
		})
		dispatch({
			type: actionTypes.SET_USER_EMAIL,
			userEmail: collaborationUser,
		})
		history.push(`home/board/${projectId}/${collaboration}/${collaborationUser}`, {
			collaboration: collaboration,
			collaborationUser: collaborationUser,
		})
	}

	useEffect(() => {
		if (projectBackgroundColor === 'blank') {
			document.getElementById(projectId).style.backgroundImage = `url(${projectBackgroundImage})`
			document.getElementById(projectId).style.backgroundRepeat = 'no-repeat'
			document.getElementById(projectId).style.backgroundSize = 'cover'
			document.getElementById(projectId).style.boxSizing = 'border-box'
		} else {
			setBackground(projectBackgroundColor)
			document.getElementById(projectId).style.backgroundImage = 'none'
		}
	}, [projectBackgroundImage, projectBackgroundColor, projectId])

	return (
		<div
			id={projectId}
			onClick={() => handleActiveProject()}
			className={`${background} rounded-lg cursor-pointer hover:bg-opacity-700 m-5 px-5 py-16 w-full xs:max-w-xs flex flex-grow justify-center place-items-center relative`}
		>
			<h3 className='text-center text-xl xs:text-2xl font-semibold'>{projectName}</h3>
			<PeopleIcon
				className={`${
					collaboration ? 'flex' : 'hidden'
				} absolute bottom-0 right-[0.3rem] w-10 h-10 text-white shadow-lg`}
			/>
		</div>
	)
}
