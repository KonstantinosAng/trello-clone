import { Avatar, Button } from '@material-ui/core'
import React from 'react'
import Project from './components/Project';
import { actionTypes } from './utils/reducer';
import { useStateValue } from './utils/StateProvider'
import { auth } from './utils/firebase';

function Home() {

  const [state, dispatch] = useStateValue();
  
  const signOut = () => {
    auth.signOut();
    dispatch({
      type: actionTypes.UNSET_USER
    })
  }

  return (
    <div className="bg-[#111E2F] h-screen flex flex-col justify-center items-center">
      <div>
        <div className="flex flex-grow w-screen justify-end p-5">
          <h2 className="mr-5 text-center self-center font-medium text-blue-200"> {state?.user?.displayName} </h2>
          <Avatar className="mr-5" src={state?.user?.photoURL}/>
          <Button className="rounded bg-[#0079BF] px-5 py-2 text-white text-xl font-bold active:outline-none" onClick={()=>signOut()}> Logout </Button>
        </div>
      </div>
      <div className="bg-[#0079BF] mx-auto h-full rounded-md flex flex-col items-left flex-1 p-5">
        <h2 className="font-bold text-2xl text-gray-900 p-2"> Projects </h2>
        <div className="w-auto flex flex-wrap justify-center items-center">
          <Project projectName="Trello Clone"/> 
          <Project projectName="Trello Clone"/> 
          <Project projectName="Trello Clone"/> 
          <Project projectName="Add Project"/> 
        </div>
      </div>
    </div>
  )
}

export default Home
