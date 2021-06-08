import React from 'react'
import { auth, provider } from './utils/firebase.js';
import { actionTypes } from './utils/reducer.js';
import { useStateValue } from './utils/StateProvider.js';
import Logo from './assets/logo.png';

function Login() {
  // eslint-disable-next-line
  const [state, dispatch] = useStateValue();

  const signIn = () => {
    auth.signInWithPopup(provider).then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user
        })
      }).catch((error) => {
        alert(error.message);
      })
  }

  return (
    <div className="flex flex-col place-items-center justify-center flex-center h-screen">
      <img className="object-contain w-80 mb-40" src={Logo} alt="App Logo"/>
      <button className="rounded bg-[#0079BF] px-5 py-2 text-white text-xl font-bold active:outline-none" onClick={()=>signIn()}> Log In </button>
    </div>
  )
}

export default Login
