import React, { Suspense, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useHistory, useLocation } from 'react-router-dom';
import { auth } from '../utils/firebase';
import LoadingElement from '../components/LoadingElement';
import LoadingPage from './LoadingPage';

function Error() {
  const location = useLocation();
  const history = useHistory();
  //eslint-disable-next-line
  const [_, loading] = useAuthState(auth);
  
  /* Handle If user changed on project page authorization  */
  useEffect(() => {
    if (location?.state?.stateUser) {
      history.push('/home');
    }
  }, [location?.state?.stateUser, history])
  
  if (loading) {
    return (
      <Suspense fallback={<LoadingElement/>}>
        <LoadingPage />
      </Suspense>
    )
  }

  return (
    <div className="h-screen bg-[#111E2F] flex flex-col items-center justify-center">
      <h2 className="text-white text-6xl font-bold font-serif mb-20 motion-safe:animate-pulse pointer-events-none"> 400 </h2>
      <h3 className="text-white text-3xl font-bold font-serif"> Sorry project not found {`:(`} </h3>
    </div>
  )
}

export default Error
