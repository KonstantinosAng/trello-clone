import React, { Suspense, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import './App.css'
import { auth } from './utils/firebase.js'
import { actionTypes } from './store/reducer.js'
import { useStateValue } from './store/StateProvider.js'
import Home from './pages/Home'
import Board from './pages/Board'
import NotFound from './pages/NotFound'
import Error from './pages/Error'
import LoadingElement from './components/LoadingElement'
import LoadingPage from './pages/LoadingPage'
const Login = React.lazy(() => import('./pages/Login'))

function App() {
	const [{ user }, dispatch] = useStateValue()
	// eslint-disable-next-line
	const [_, loading] = useAuthState(auth)

	/* Track if user is logged in */
	useEffect(() => {
		const authorization = auth.onAuthStateChanged(Auth => {
			if (Auth) {
				dispatch({
					type: actionTypes.SET_USER,
					user: Auth,
				})
				dispatch({
					type: actionTypes.SET_USER_EMAIL,
					userEmail: Auth.email,
				})
			} else {
				dispatch({
					type: actionTypes.UNSET_USER,
				})
			}
		})
		return authorization
	}, [dispatch])

	/* If page loads */
	if (loading) {
		return <LoadingPage />
	}

	return (
		<div className='app'>
			{!user ? (
				<Suspense fallback={<LoadingElement />}>
					<Login />
				</Suspense>
			) : (
				<Router basename='/'>
					<Switch>
						<Route path='/' exact component={Home} />
						<Route path='/home' exact component={Home} />
						<Route
							path='/home/board/:projectID/:collaboration/:collaborationUser'
							exact
							component={Board}
						/>
						<Route path='/error/:id' exact component={Error} />
						<Route component={NotFound} />
					</Switch>
				</Router>
			)}
		</div>
	)
}

export default App
