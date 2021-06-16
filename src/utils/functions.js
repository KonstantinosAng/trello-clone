import { auth, provider } from "./firebase";
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

export const deleteCard = async (user, projectID) => {

}