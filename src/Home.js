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
    <div className="bg-[#111E2F] w-screen h-screen flex flex-col overflow-y-scroll">
      <div className="flex flex-wrap items-center text-center justify-evenly xs:justify-end p-5">
        <h2 className="xs:mr-5 text-center self-center font-medium text-sm xs:text-lg text-blue-200"> {state?.user?.displayName} </h2>
        <Avatar className="xs:mr-5 object-contain" src={state?.user?.photoURL}/>
        <Button className="rounded bg-[#0079BF] px-5 py-2 text-white text-xs sm:text-xl font-bold active:outline-none" onClick={()=>signOut()}> Logout </Button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold text-2xl sm:text-4xl text-[#0079BF] px-5 py-2"> Projects </h2>
        <div className="px-5 my-10 w-full flex flex-wrap justify-evenly place-items-left">
          <Project projectName="Trello Clone"/> 
          <Project projectName="Netflix Clone"/> 
          <Project projectName="Facebook Clone"/> 
          <Project projectName="Add Project"/> 
        </div>
        </div>
    </div>
  )
}

export default Home
