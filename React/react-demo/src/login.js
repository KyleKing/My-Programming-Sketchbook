import React, { Component } from 'react'
import bcrypt from 'bcryptjs'
import './Login.css'

// TODO: Move to nedDB (Store `hash` in your DB)
var basicPass = 'hello_world'  // FIXME: Store password only as hash
var hash = bcrypt.hashSync( basicPass, bcrypt.genSaltSync( 15 ) )


class Login extends Component {
	// Login input text

	constructor( props ) {
		super( props )
		this.state = { loadState: false, password: '', hidePass: false }
		// Bind handlers
		this.showHide = this.showHide.bind( this )
		this.handleChange = this.handleChange.bind( this )
		this.handleSubmit = this.handleSubmit.bind( this )
	}

	showHide(e) {
		e.preventDefault()
		e.stopPropagation()
		// Toggle showing/hiding the password input
		this.setState({ hidePass: !this.state.hidePass })
	}

	handleChange( e ) {
		// Parse the password while typed
		this.setState( { password: e.target.value } )
	}

	handleSubmit( e ) {
		e.preventDefault()
		// Hide password and disable form input while loading
		this.setState({hidePass: true, loadState: true})
		bcrypt.compare( this.state.password, hash ).then( ( res ) => {
			if ( res ) {
				console.log( 'Update route' )
			} else {
				console.log( this.state.password )
			}
		} ).catch( ( err ) => {
			alert( err )
		} ).finally( () => {
			this.setState({loadState: false})
		})
	}

	render() {
		// <Link to="/">Home</Link>
		const toggle_label = this.state.hidePass ? 'Hide' : 'Show'
		return (
			<div className="center-up">
				<h1>PiAlarm</h1>
				<form onSubmit={this.handleSubmit}>
					<div className="pass-container">
						<input
							className={`password ${toggle_label} dark`}
							type={this.state.hidePass ? 'password' : 'text'}
							onChange={this.handleChange}
							placeholder="Password"
							value={this.state.password}
							required={true}
							disabled={this.state.loadState}
						/>
						<div className="pass-container-buttons">
							<button
								className="password-toggle"
								onClick={this.showHide}
								type="button"
							>{toggle_label}</button>
							<button
								type="submit"
								className="login"
								disabled={this.state.loadState}
							>Login</button>
						</div>
					</div>
				</form>
			</div>
		)
	}
}

export default Login
