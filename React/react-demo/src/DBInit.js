// ONLY RUN LOCALLY with: node DBInit.js --password=YourPassword
// This will initialize the database with the default password hash

var bcrypt = require( 'bcryptjs' )
var fs = require( 'fs' )
var Datastore = require( 'nedb' )

// Delete then recreate database, this way only one password is stored
var dbFn = './data/users.db'
if ( fs.existsSync( dbFn ) )
	fs.unlinkSync( dbFn )

const users = new Datastore( { autoload: true, filename: dbFn } )

// Accept password argument (i.e. node DBInit.js --password=YourPassword)
const args = require( 'minimist' )( process.argv.slice( 2 ) )
console.log( bcrypt.hashSync( args.password, bcrypt.genSaltSync( 12 ) ) )

// Initialize user password in database
users.insert( {
	hash: bcrypt.hashSync( args.password, bcrypt.genSaltSync( 12 ) ),
}, ( err ) => {
	console.log( err )
	users.count( {}, ( err, count ) => {
		console.log( err )
		console.log( count )
	} )
} )
