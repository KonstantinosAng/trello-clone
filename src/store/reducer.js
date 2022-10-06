export const initialState = {
  user: null,
  activeProject: null,
  userEmail: 'null'
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_USER_EMAIL: "SET_USER_EMAIL",
  UNSET_USER: "UNSET_USER",
  SET_ACTIVE_PROJECT: "SET_ACTIVE_PROJECT"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_USER_EMAIL:
      return {
        ...state,
        userEmail: action.userEmail,
      };
    case actionTypes.UNSET_USER:
      return {
        user: null
      }
    case actionTypes.SET_ACTIVE_PROJECT:
      return {
        ...state,
        activeProject: action.activeProject,
      };
    default:
      return state;
  }
};

export default reducer;
