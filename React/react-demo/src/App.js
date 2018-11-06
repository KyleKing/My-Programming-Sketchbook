import React, { Component } from 'react'
import Login from './Login'
import Alarm from './Alarm'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import './Globals.css'
import './App.css'

const Alarms = () => <Alarm
	uniq="{alarm.uniq}"
	title="{alarm.title}"
	schedule="{alarm.schedule}"
	running="{alarm.running}" />  // FYI: will output error to console

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
