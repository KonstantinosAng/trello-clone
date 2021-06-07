import { Avatar, Button } from '@material-ui/core'
import React from 'react'
import Project from './components/Project';
import { actionTypes } from './utils/reducer';
import { useStateValue } from './utils/StateProvider'

function Home() {

  const [state, dispatch] = useStateValue();
  
  const signOut = () => {
    dispatch({
      type: actionTypes.UNSET_USER
    })
  }

  return (
    <div>
      <div className="flex flex-grow w-screen justify-end p-5">
        <h2 className="mr-5 text-center self-center font-medium text-gray-600"> {state?.user?.displayName} </h2>
        <Avatar className="mr-5" src={state?.user?.photoURL}/>
        <Button className="rounded bg-[#0079BF] px-5 py-2 text-white text-xl font-bold active:outline-none" onClick={()=>signOut()}> Logout </Button>
      </div>
      <div className="bg-blue-300 w-3/5 mx-auto h-1/2 rounded-md">
        <h2 className="font-bold text-2xl text-gray-900 p-2"> Projects </h2>
        <div className="w-auto sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap justify-center" >
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
