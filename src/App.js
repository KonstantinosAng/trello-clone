import './App.css';
import List from './components/List.js';
import Login from './Login';
import { auth } from './utils/firebase.js';
import { actionTypes } from './utils/reducer.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useStateValue } from './utils/StateProvider.js';
import { useEffect } from 'react';
import LoadingPage from './LoadingPage';
import Home from './Home';
import NotFound from './NotFound';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';


function App() {
  const [{user}, dispatch] = useStateValue();
  // eslint-disable-next-line
  const [_, loading] = useAuthState(auth);

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

  if (loading) {
    return (
      <LoadingPage />
    )
  }

  return (
    <div className="app">
      {!user ? <Login /> :
        <Router>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/home" exact component={Home}/>
            <Route component={NotFound}/>
          </Switch>
          {/* <List /> */}
        </Router>
      }
    </div>
  );
}

export default App;
