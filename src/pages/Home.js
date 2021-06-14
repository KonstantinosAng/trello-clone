import { Avatar, Button } from '@material-ui/core'
import React from 'react';
import Project from '../components/Project';
import { actionTypes } from '../utils/reducer';
import { useStateValue } from '../utils/StateProvider'
import { auth } from '../utils/firebase';
import db from '../utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import InputProject from '../components/InputProject';

function Home() {

  const [state, dispatch] = useStateValue();
  const [projects] = useCollection(db.collection(state.user.email));
  
  /* Handle user signOut */
  const signOut = () => {
    auth.signOut();
    dispatch({
      type: actionTypes.UNSET_USER
    })
  }

  return (
    <div className="bg-[#111E2F] w-screen h-screen flex flex-col overflow-y-auto">
      <div className="flex flex-wrap items-center text-center justify-evenly xs:justify-end p-5">
        <h2 className="xs:mr-5 text-center self-center font-medium text-sm xs:text-lg text-blue-200"> {state?.user?.displayName} </h2>
        <Avatar className="xs:mr-5 object-contain cursor-pointer" src={state?.user?.photoURL}/>
        <Button className="rounded bg-red-500 px-5 py-2 text-gray-300 hover:text-gray-100 text-xs sm:text-xl font-bold active:outline-none" onClick={()=>signOut()}> Logout </Button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold text-2xl sm:text-4xl text-[#0079BF] px-5 py-2"> Projects </h2>
        <div className="px-5 my-10 w-full flex flex-wrap items-center justify-center md:justify-start">
          {projects?.docs.map(doc => (
            <Project projectId={doc.id} key={doc.id} projectName={doc.data().projectName}/>
          ))}
          <InputProject />
        </div>
        </div>
    </div>
  )
}

export default Home
