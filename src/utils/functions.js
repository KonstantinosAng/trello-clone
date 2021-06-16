import db, { auth, provider } from "./firebase";
import { actionTypes } from '../utils/reducer';

/* Handle Sign out */
export const signOut = (dispatch) => {
  auth.signOut();
  dispatch({
    type: actionTypes.UNSET_USER
  })
}

/* Handle user change log out/log in */
export const signInWithRedirect = async () => {
  await auth.signInWithRedirect(provider);
}

export const signIn = async (dispatch) => {
  await auth.getRedirectResult().then((result) => {
    if (result.credential) {
      dispatch({
        type: actionTypes.SET_USER,
        user: result.user
      })
    }
  })
}

export const deleteLabel = async (user, projectID, listID, taskID, labelID) => {
  await db.collection('users').doc(user)
          .collection(user).doc(projectID)
          .collection('lists').doc(listID)
          .collection('tasks').doc(taskID)
          .collection('labels').doc(labelID)
          .delete().then().catch(error=>console.error(error))
}
export const deleteCard = async (user, projectID, listID, taskID, position) => {
  const tasksCollection = db.collection('users').doc(user)
                            .collection(user).doc(projectID)
                            .collection('lists').doc(listID)
                            .collection('tasks')
  /* Update tasks position for consistency */
  await 
    tasksCollection.where('position', '>', position).get().then(async (docSnapshot) => {
        for (const doc of docSnapshot.docs) {
          await
            tasksCollection.doc(doc.id).update({
                position: doc.data().position - 1
              }).then().catch(error => {
                console.error(error);
              })
        }
      }).catch(error => console.error(error))
    /* Delete labels from task */
    await tasksCollection.doc(taskID).collection('labels').get().then(async labels => {
      for (const label of labels.docs) {
        if (label.exists) {
          deleteLabel(user, projectID, listID, taskID, label.id)
        }
      }
    })
    /* Delete task */
    await tasksCollection.doc(taskID).delete().then().catch(error => console.error(error));
}

export const deleteList = async (user, projectID, listID, listPosition) => {
  const listCollection = db.collection('users').doc(user)
                           .collection(user).doc(projectID)
                           .collection('lists')
  /* Update list position for consistency */
  await 
    listCollection.where('position', '>', listPosition).orderBy('position').get().then(async (docSnapshot) => {
      for (const doc of docSnapshot.docs) {
        await
        listCollection.doc(doc.id).update({
              position: doc.data().position - 1
            }).then().catch(error => {
              console.error(error)
            })
      }
    })
  /* Delete tasks and labels */
  await listCollection.doc(listID).collection('tasks').get().then(tasks => {
    for (const task of tasks.docs) {
      deleteCard()
    }
  })
  /* Delete list */
  await listCollection.doc(listID).delete().then().catch(error => console.error(error));

}