import React, { Suspense, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Avatar, Button } from '@material-ui/core';
import { useStateValue } from '../utils/StateProvider'
import { signOut } from '../utils/functions';
import db from '../utils/firebase';
import LoadingElement from '../components/LoadingElement';
const InputProject = React.lazy(() => import('../components/InputProject'));
const Project = React.lazy(() => import('../components/Project'));

function Home() {

  const [state, dispatch] = useStateValue();
  const [projects] = useCollection(db.collection('users').doc(state.user.email).collection(state.user.email));

  /* Handle creating user on first login */
  useEffect(() => {
    async function createUser() {
      await db.collection('users').doc(state.user.email).get().then(async doc => {
        if (!doc.exists) {
          await db.collection('users').doc(state.user.email).set({
            username: state.user.email
          })
        }
      })
    }
    createUser()
  }, [state.user.email])
  
  return (
    <div className="bg-[#111E2F] w-screen h-screen flex flex-col overflow-y-auto">
      <div className="flex flex-wrap items-center text-center justify-evenly xs:justify-end p-5">
        <h2 className="xs:mr-5 text-center self-center font-medium text-sm xs:text-lg text-blue-200"> {state?.user?.displayName} </h2>
        <Suspense fallback={<LoadingElement color="bg-gray-500"/>}>
          <Avatar loading="lazy" className="xs:mr-5 object-contain cursor-pointer w-10 h-10" src={state?.user?.photoURL}/>
          <Button className="rounded bg-red-500 px-5 py-2 text-gray-300 hover:text-gray-100 text-xs sm:text-xl font-bold active:outline-none focus:outline-none" onClick={()=>signOut(dispatch)}> Logout </Button>
        </Suspense>
      </div>
      <div className="flex flex-col justify-center items-center">
          <h2 className="font-bold text-2xl sm:text-4xl text-[#0079BF] px-5 py-2"> Projects </h2>
          <div className="px-5 my-10 w-full flex flex-wrap items-center justify-center md:justify-start">
            {projects?.docs.map(doc => (
              <Suspense key={doc.id} fallback={<LoadingElement color={'bg-[#111E2F]'}/>}>
                <Project projectBackgroundColor={doc.data().backgroundColor} projectBackgroundImage={doc.data().backgroundImage} projectId={doc.id} projectName={doc.data().projectName}/>
              </Suspense>
            ))}
            <Suspense fallback={<LoadingElement color={'bg-[#111E2F]'}/>}>
              <InputProject />
            </Suspense>
          </div>
        </div>
    </div>
  )
}

export default Home
