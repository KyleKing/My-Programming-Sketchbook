import Login from './Login'
import React from 'react'
import ReactDOM from 'react-dom'

// FIXME: Placeholder
it( 'renders without crashing', () => {
	const div = document.createElement( 'div' )
	ReactDOM.render( <Login />, div )
	ReactDOM.unmountComponentAtNode( div )
} )
