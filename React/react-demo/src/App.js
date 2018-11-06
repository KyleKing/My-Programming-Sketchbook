import React, { Component } from 'react'
import Login from './Login'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import './App.css'

const Alarms = () => <h1>Placeholder - Alarms</h1>
const NoMatch = () => <h1><Link to="/">404 - URL Not Found</Link></h1>

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Switch>
						<Route path="/" exact component={Login} />
						<Route path="/Alarms/" component={Alarms} />
						<Route component={NoMatch} />
					</Switch>
				</div>
			</Router>
		)
	}
}

export default App
