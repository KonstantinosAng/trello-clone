import React, { Suspense } from 'react';
import './App.css';
import { auth } from './utils/firebase.js';
import { actionTypes } from './utils/reducer.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useStateValue } from './utils/StateProvider.js';
import { useEffect } from 'react';
import LoadingPage from './pages/LoadingPage';
import Home from './pages/Home';
import Board from './pages/Board';
import NotFound from './pages/NotFound';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Error from './pages/Error';
import LoadingElement from './components/LoadingElement';
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
  }, [dispatch, user])

  /* If page loads */
  if (loading) {
    return (
      <Suspense fallback={<LoadingElement/>}>
        <LoadingPage />
      </Suspense>
    )
  }

  return (
    <div className="app">
      {!user ? 
        <Suspense fallback={<LoadingElement/>}>
          <Login /> 
        </Suspense>
      :
        <Suspense fallback={<LoadingPage/>}>
          <Router>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/home" exact component={Home}/>
              <Route path="/home/board/:projectID" exact component={Board}/>
              <Route path="/error/:id" exact component={Error}/>
              <Route component={NotFound}/>
            </Switch>
          </Router>
        </Suspense>
      }
    </div>
  );
}

export default App;
