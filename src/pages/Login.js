import React, { useEffect } from 'react'
import { provider } from '../utils/firebase.js';
import { useStateValue } from '../utils/StateProvider.js';
import { signInWithRedirect, signIn } from '../utils/functions';
import Logo from '../assets/logo.png';

function Login() {
  // eslint-disable-next-line
  const [_, dispatch] = useStateValue();
  
  /* Get google redirect results */
  useEffect(() => {
    signIn(dispatch)
  }, [dispatch])

  return (
    <div className="flex flex-col place-items-center justify-center flex-center h-screen">
      <img loading="lazy" className="object-contain w-80 mb-40" src={Logo} alt="App Logo"/>
      <button className="rounded bg-[#0079BF] px-5 py-2 text-white text-xl font-bold active:outline-none focus:outline-none" onClick={()=>signInWithRedirect(provider)}> Log In </button>
    </div>
  )
}

export default Login
