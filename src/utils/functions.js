import db, { auth, provider } from './firebase'
import { actionTypes } from '../store/reducer'

/* Handle Sign out */
export const signOut = (dispatch, history) => {
	auth.signOut()
	dispatch({
		type: actionTypes.UNSET_USER,
	})
	history.push('/home')
}

/* Handle user change log out/log in */
export const signInWithRedirect = async history => {
	await auth.signInWithRedirect(provider)
	history.push('/home')
}

export const signIn = async dispatch => {
	await auth.getRedirectResult().then(result => {
		if (result.credential) {
			dispatch({
				type: actionTypes.SET_USER,
				user: result.user,
			})
		}
	})
}

/* Handle delete Label */
export const deleteLabel = async (user, projectID, listID, taskID, labelID) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('lists')
		.doc(listID)
		.collection('tasks')
		.doc(taskID)
		.collection('labels')
		.doc(labelID)
		.delete()
		.then()
		.catch(error => console.error(error))
}

/* Handle delete Task */
export const deleteCard = async (user, projectID, listID, taskID, position) => {
	const tasksCollection = db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('lists')
		.doc(listID)
		.collection('tasks')
	/* Update tasks position for consistency */
	await tasksCollection
		.where('position', '>', position)
		.get()
		.then(async docSnapshot => {
			for (const doc of docSnapshot.docs) {
				await tasksCollection
					.doc(doc.id)
					.update({
						position: doc.data().position - 1,
					})
					.then()
					.catch(error => {
						console.error(error)
					})
			}
		})
		.catch(error => console.error(error))
	/* Delete labels from task */
	await tasksCollection
		.doc(taskID)
		.collection('labels')
		.get()
		.then(async labels => {
			for (const label of labels.docs) {
				if (label.exists) {
					await deleteLabel(user, projectID, listID, taskID, label.id)
				}
			}
		})
	/* Delete task */
	await tasksCollection
		.doc(taskID)
		.delete()
		.then()
		.catch(error => console.error(error))
}

/* Handle delete List */
export const deleteList = async (user, projectID, listID, listPosition) => {
	const listCollection = db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('lists')
	/* Update list position for consistency */
	await listCollection
		.where('position', '>', listPosition)
		.orderBy('position')
		.get()
		.then(async docSnapshot => {
			for (const doc of docSnapshot.docs) {
				await listCollection
					.doc(doc.id)
					.update({
						position: doc.data().position - 1,
					})
					.then()
					.catch(error => {
						console.error(error)
					})
			}
		})
	/* Delete tasks and labels */
	await listCollection
		.doc(listID)
		.collection('tasks')
		.get()
		.then(async tasks => {
			for (const task of tasks.docs) {
				if (task.exists) {
					await deleteCard(user, projectID, listID, task.id, task.data().position)
				}
			}
		})
	/* Delete list */
	await listCollection
		.doc(listID)
		.delete()
		.then()
		.catch(error => console.error(error))
}

/* Handle search User */
export const searchUser = async username => {
	let userFound
	await db
		.collection('users')
		.where('username', '==', username)
		.get()
		.then(async docSnapshot => {
			if (docSnapshot.empty) {
				/* User does not exist */
				userFound = false
			} else {
				/* User exists */
				userFound = true
			}
		})
		.catch(error => console.error(error))
	return userFound
}

/* Handle create Project */
export const createProject = async (
	user,
	projectName,
	backgroundColor,
	backgroundImage,
	collaboration
) => {
	await db.collection('users').doc(user).collection(user).add({
		projectName: projectName,
		backgroundColor: backgroundColor,
		backgroundImage: backgroundImage,
		collaboration: false,
	})
}

/* Handle collaborative project */
export const createCollaborativeProject = async (addedUser, user, projectID) => {
	/* Create project reference in addedUser */
	await db.collection('users').doc(addedUser).collection(addedUser).add({
		userID: user,
		projectID: projectID,
		collaboration: true,
	})
	/* Add user to collaborative users */
	let userImageURL
	await db
		.collection('users')
		.doc(addedUser)
		.get()
		.then(doc => {
			userImageURL = doc.data().userImageURL
		})
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('collaborationUsers')
		.add({
			userName: addedUser,
			imageURL: userImageURL,
		})
}

/* Handle remove user from collaboration */
export const removeCollaborativeUser = async (user, projectID, collaborationUserName) => {
	/* Remove user from project */
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('collaborationUsers')
		.where('userName', '==', collaborationUserName)
		.get()
		.then(async users => {
			if (!users.empty) {
				for (const userDoc of users.docs) {
					console.log(user, projectID, collaborationUserName)
					await db
						.collection('users')
						.doc(user)
						.collection(user)
						.doc(projectID)
						.collection('collaborationUsers')
						.doc(userDoc.id)
						.delete()
						.then()
						.catch(error => console.error(error))
				}
			}
		})
		.catch(error => console.error(error))

	/* Remove project from user */
	await db
		.collection('users')
		.doc(collaborationUserName)
		.collection(collaborationUserName)
		.where('projectID', '==', projectID)
		.get()
		.then(async projects => {
			if (!projects.empty) {
				for (const project of projects.docs) {
					await db
						.collection('users')
						.doc(collaborationUserName)
						.collection(collaborationUserName)
						.doc(project.id)
						.delete()
						.then()
						.catch(error => console.error(error))
				}
			}
		})
		.catch(error => console.error(error))
}

/* Handle update color background */
export const updateBackgroundColor = async (user, projectID, backgroundColor) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.update({
			backgroundColor: backgroundColor,
		})
		.then()
		.catch(error => console.error(error))
}

/* Handle update background image */
export const updateBackgroundImage = async (user, projectID, photoUrl) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.update({
			backgroundImage: photoUrl,
		})
		.then()
		.catch(error => console.error(error))
}

/* Handle create new note */
export const createNewNote = async (user, projectID) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('notes')
		.add({
			x: 215,
			y: 315,
			title: '#Note',
			notes: 'Write your notes here...',
			color: 'bg-yellow-500',
		})
		.then()
		.catch(error => console.error(error))
}

/* Handle update Note position on move */
export const updateNotePosition = async (user, projectID, noteID, x, y) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('notes')
		.doc(noteID)
		.update({ x: x, y: y })
		.then(() => true)
		.catch(error => console.error(error))
}

/* Handle update Note color */
export const updateNoteColor = async (user, projectID, noteID, color) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('notes')
		.doc(noteID)
		.update({ color: color })
		.then()
		.catch(error => console.error(error))
}

/* Handle update Note title */
export const updateNoteTitle = async (user, projectID, noteID, title) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('notes')
		.doc(noteID)
		.update({ title: title })
		.then()
		.catch(error => console.error(error))
}

/* Handle update Note notes */
export const updateNoteNotes = async (user, projectID, noteID, notes) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('notes')
		.doc(noteID)
		.update({ notes: notes })
		.then()
		.catch(error => console.error(error))
}

/* Handle delete Note from project */
export const deleteNote = async (user, projectID, noteID) => {
	await db
		.collection('users')
		.doc(user)
		.collection(user)
		.doc(projectID)
		.collection('notes')
		.doc(noteID)
		.delete()
		.then()
		.catch(error => console.error(error))
}
