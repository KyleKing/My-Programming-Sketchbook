// Quick CRON guide
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12
// day of week    0-6 (Sun-Sat)

import './Alarm.css'
import PropTypes from 'prop-types'
import React from 'react'

class Alarm extends React.Component {
	static propTypes = {
		running: PropTypes.bool.isRequired,
		schedule: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		uniq: PropTypes.string.isRequired,
	}

	constructor( props ) {
		super( props )
		this.state = {
			changed: false,
			error: false,
			removed: false,
			running: this.props.running,
			schedule: this.props.schedule,
			title: this.props.title,
			uniq: this.props.uniq,
		}
		// Bind handlers
		this.EnDisableToggle = this.EnDisableToggle.bind( this )
		this.handleTitleChange = this.handleTitleChange.bind( this )
		this.handleScheduleChange = this.handleScheduleChange.bind( this )
		this.handleSubmit = this.handleSubmit.bind( this )
		this.removeAlarm = this.removeAlarm.bind( this )
	}

	EnDisableToggle() {
		// console.log(`Toggled: ${this.props.uniq}, but no direct action!`);
		this.setState( {
			changed: true,
			running: !this.state.running,
		} )
	}

	handleTitleChange( event ) {
		this.setState( {
			changed: true,
			title: event.target.value,
		} )
	}

	handleScheduleChange( event ) {
		const newSched = event.target.value
		// Check for correct Cron format. Note: the extra space
		if ( /^(?:[\d-,*]+ ){6}$/.test( `${newSched} ` ) ) {
			// console.log(event.target.value);
			this.setState( {
				changed: true,
				error: false,
				schedule: newSched,
			} )
		} else {
			this.setState( {
				error: true,
			} )
			console.warn( `[IC!]: Improper Cron formatting of ${newSched}` )
		}
	}

	handleSubmit() {
		const newState = {
			changed: false,
			error: false,
			removed: false,
			running: this.state.running,
			schedule: this.state.schedule,
			title: this.state.title,
			uniq: this.state.uniq,
		}
		this.setState( newState )
		// socket.emit( 'update', newState )
	}

	removeAlarm() {
		const newState = {
			changed: true,
			removed: true,
			title: 'DELETED',
			uniq: this.state.uniq,
		}
		this.setState( newState )
		// socket.emit( 'remove', this.props.uniq )
	}

	render() {
		const fc = 'flex-container'
		const fi = 'flex-item'
		const buttonBase = 'btn custom-button-formatting'
		const buttonValue = this.state.running ? 'Enabled' : 'Disabled'
		const buttonState = this.state.running ? 'info' : 'danger'
		const buttonClasses = `${buttonBase} btn-${buttonState} ${buttonValue}`
		const removed = this.state.removed ? 'removed' : 'alarm-exists'
		const changed = this.state.changed ? 'changed' : 'unchanged'

		return (
			<div className={`alarm ${removed} ${fc}`}>
				<button
					type="button"
					className={`${fi} ${buttonClasses}`}
					onClick={this.EnDisableToggle}
				>
					{buttonValue}
				</button>

				<input
					type="text"
					className={`${fi} input-title`}
					defaultValue={this.state.title}
					onChange={this.handleTitleChange}
				/>
				<input
					type="text"
					className={`${fi} input-schedule ${( this.state.error ) ? 'input-error' : ''}`}
					defaultValue={this.state.schedule}
					onChange={this.handleScheduleChange}
				/>

				<button
					className={`${fi} ${buttonBase} ${changed}`}
					onClick={this.handleSubmit}
					type="submit"
				>Save</button>
				<button
					type="button"
					className={`${fi} ${buttonBase} btn-danger remove`}
					id={this.props.uniq}
					onClick={this.removeAlarm}
				>REMOVE</button>
			</div>
		)
	}
}

// Alarm.propTypes = {
// 	running: PropTypes.bool.isRequired,
// 	schedule: PropTypes.string.isRequired,
// 	title: PropTypes.string.isRequired,
// 	uniq: PropTypes.string.isRequired,
// }

export default Alarm
