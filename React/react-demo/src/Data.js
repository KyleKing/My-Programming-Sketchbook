import moment from 'moment'
import nedb from 'nedb'

const alarms = new nedb( { autoload: true, filename: './data/alarms.db' } )
// const users = new nedb( { autoload: true, filename: './data/users.db' } )

function generateUniq() {
	const randVal = Math.floor( Math.random() * ( 50 ) )
	return ( moment().format( `YYMMDD_mm-ss_${randVal}` ) )
}

function freshCron() {
	const prefs = [1]
	const schedule = '20 0,5,10,15,20,25,30,35,40,45,50,55 * * * *'
	prefs.forEach( ( pref ) => {
		const uniq = generateUniq()
		alarms.insert( {
			running: true,
			schedule,
			title: `ALARM: ${uniq} - ${pref}`,
			uniq,
		} )
	} )
}

module.exports = { alarms, freshCron, generateUniq }
