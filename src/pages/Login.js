import React, { useEffect } from 'react'
import { auth, provider } from '../utils/firebase.js';
import { actionTypes } from '../utils/reducer.js';
import { useStateValue } from '../utils/StateProvider.js';
import Logo from '../assets/logo.png';

function Login() {
  // eslint-disable-next-line
  const [state, dispatch] = useStateValue();
  
  /* Sign in with google redirect */
  const signInRedirect = () => {
    auth.signInWithRedirect(provider);
  }
  
  /* Sign in with google popup */
  // const signInPopUP = () => {
  //   auth.signInWithPopup(provider).then((result) => {
  //     dispatch({
  //       type: actionTypes.SET_USER,
  //       user: result.user
  //     })
  //   }).catch((error) => {
  //     alert(error.message);
  //   })
  // }

  /* Get google redirect results */
  useEffect(() => {
    auth.getRedirectResult().then((result) => {
      if (result.credential) {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user
        })
      }
    })
  }, [dispatch])

  return (
    <div className="flex flex-col place-items-center justify-center flex-center h-screen">
      <img className="object-contain w-80 mb-40" src={Logo} alt="App Logo"/>
      <button className="rounded bg-[#0079BF] px-5 py-2 text-white text-xl font-bold active:outline-none focus:outline-none" onClick={()=>signInRedirect()}> Log In </button>
    </div>
  )
}

export default Login
