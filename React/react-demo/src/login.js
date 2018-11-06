import React, { Component } from 'react'
import './Login.css'

class Login extends Component {
	constructor( props ) {
		super( props )
		this.state = { password: '', hidePassword: true }
		// Bind handlers
		this.showHide = this.showHide.bind( this )
		this.handleChange = this.handleChange.bind( this )
		this.handleSubmit = this.handleSubmit.bind( this )
	}

	showHide(e) {
		e.preventDefault()
		e.stopPropagation()
		// Toggle showing/hiding the password input
		this.setState({ hidePassword: !this.state.hidePassword })
	}

	handleChange( e ) {
		// Parse the password while typed
		this.setState( { password: e.target.value } )
	}

	handleSubmit( e ) {
		e.preventDefault()
		// TODO: Check authentication and route to Alarms dashboard
		alert( `Submitted Password: ${this.state.password}` )
	}

	render() {
		// <Link to="/">Home</Link>
		const toggle_label = this.state.hidePassword ? 'Hide' : 'Show'
		return (
			<div className="center-up">
				<h1>PiAlarm</h1>
				<form onSubmit={this.handleSubmit}>
					<div className="password-group">
						<input
							className={`password ${toggle_label} dark`}
							type={this.state.hidePassword ? 'password' : 'text'}
							onChange={this.handleChange}
							placeholder="Password"
							value={this.state.password}
						/>
						<button
							className="password-toggle"
							onClick={this.showHide}
						>{toggle_label}</button>
					</div>
				</form>
			</div>
		)
	}
}

export default Login
