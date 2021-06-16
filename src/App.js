import React, { Suspense, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import { auth } from './utils/firebase.js';
import { actionTypes } from './utils/reducer.js';
import { useStateValue } from './utils/StateProvider.js';
import Home from './pages/Home';
import Board from './pages/Board';
import NotFound from './pages/NotFound';
import Error from './pages/Error';
import LoadingElement from './components/LoadingElement';
const LoadingPage = React.lazy(() => import('./pages/LoadingPage'));
const Login = React.lazy(() => import('./pages/Login'));


function App() {
  const [{user}, dispatch] = useStateValue();
  // eslint-disable-next-line
  const [_, loading] = useAuthState(auth);

  /* Track if user is logged in */
  useEffect(() => {
    const authorization = auth.onAuthStateChanged((Auth) => {
      if (Auth) {
        dispatch({
          type: actionTypes.SET_USER,
          user: Auth
        })
      } else {
        dispatch({
          type: actionTypes.UNSET_USER
        })
      }
    })
    return authorization;
  }, [dispatch])

  /* If page loads */
  if (loading) {
    return (
      <Suspense fallback={<LoadingElement color="bg-white"/>}>
        <LoadingPage />
      </Suspense>
    )
  }

  return (
    <div className="app">
      {!user ? 
        <Suspense fallback={<LoadingElement color="bg-white"/>}>
          <Login /> 
        </Suspense>
      :
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/home" exact component={Home}/>
            <Route path="/home/board/:projectID" exact component={Board}/>
            <Route path="/error/:id" exact component={Error}/>
            <Route component={NotFound}/>
          </Switch>
        </Router>
      }
    </div>
  );
}

export default App;
