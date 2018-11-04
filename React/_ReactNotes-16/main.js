
// =====================================================================================================================
// Common

// Declare short hand for createElement
let cE = React.createElement

// =====================================================================================================================
// V1 - Raw createElement

// let rootElem =
// cE( 'div', {},
//   cE( 'h1', {}, 'Contacts' ),
//   cE( 'ul', {},
//     cE( 'li', {},
//       cE( 'a', {href: 'mailto:email@gmail.com'}, 'Person 1' )
//     ),
//     cE( 'li', {},
//       cE( 'a', {href: 'mailto:email@email.edu'}, 'Student 2' )
//     )
//   )
// )
// ReactDOM.render( rootElem, document.getElementById( 'root' ) )


// =====================================================================================================================
// V2 - React Components w/ data

class ContactItem extends React.Component {
  render() {
    return(
      // Assign a Key to help React identify the element: https://reactjs.org/docs/lists-and-keys.html#keys
      cE( 'li', {className: 'contact unstyled'},
        cE( 'h2', {className: 'contact-name'}, this.props.name ),
        cE( 'a', {href: `mailto:${this.props.email}`}, this.props.email ),
        cE( 'div', {}, this.props.description )
      )
    )
  }
}
// Configure properties
ContactItem.propTypes = {
  description: PropTypes.string,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}
ContactItem.defaultProps = {
  name: 'Default Name',
}

// Display all Contact data
var contacts = [

  {description: 'Unicorn', email: 'doingBigThings@me.co', key: 1, name: 'Colin King'},
  // {description: 'The older one', email: 'me@kyle.co', key: 2, name: 'Kyle King'},
  {description: 'HE HAS NO NAME!', email: 'someone@datOne.co', key: 3},
  {key: 4, name: 'EMPTY INPUT'},
]
var contactItems = contacts
  .filter( ( contact ) => contact.email )
  .map( ( contact ) => cE( ContactItem, contact ) )

// Render Basic Contact List
var rootElem = cE( 'div', {},
  cE( 'h1', {}, 'Contact List' ),
  cE( 'ul', {}, contactItems )
)
ReactDOM.render( rootElem, document.getElementById( 'root' ) )


// =====================================================================================================================
// V3 - Add Clock

class Clock extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {date: new Date()}
  }

  componentDidMount() {
    this.timerID = setInterval( () => this.tick(), this.props.updateInterval )
  }
  componentWillUnmount() {
    clearInterval( this.timerID )
  }

  tick() {
    this.setState( {date: new Date()} )
  }

  render() {
    return(
      cE( 'div', {},
        cE( 'h1', {}, `Clock Example (${this.props.updateInterval})` ),
        cE( 'span', {}, this.state.date.toLocaleString() )
      )
    )
  }
}
// Configure properties
Clock.propTypes = {
  updateInterval: PropTypes.number.isRequired,
}

var clockElements = cE( 'div', {},
  cE( Clock, {updateInterval: 1000} ),
  cE( Clock, {updateInterval: 2000} ),
  cE( Clock, {updateInterval: 4000} )
)
ReactDOM.render( clockElements, document.getElementById( 'tick' ) )

// // FYI: Use setState function to use previous state
// this.setState( ( state, props ) => ( {
//   counter: state.counter + props.increment
// } ) )
// // setState will overwrite a shallow copy (replace counter, but leave other keys intact)


// =====================================================================================================================
// V4 - Event Handling

class Toggle extends React.Component {
  // Need Babel to use static keyword
  // static propTypes = {
  //   id: PropTypes.string.isRequired,
  // }

  constructor( props ) {
    super( props )
    this.state = {isToggleOn: true}

    // FYI: This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind( this, `>${this.props.id}<` )
  }

  handleClick( id ) {
    // Demonstrate binding id
    console.log( `Clicked: "${id}"` )
    this.setState( state => ( {
      isToggleOn: !state.isToggleOn,
    } ) )
  }

  render() {
    const label = `${this.props.id}-${this.state.isToggleOn ? 'ON' : 'OFF'}`
    return(
      cE( 'p', {},
        cE( 'button', {onClick: this.handleClick}, label )
      )
    )
  }
}
Toggle.propTypes = {
  id: PropTypes.string.isRequired,
}

var toggleElements = cE( 'div', {},
  cE( 'h1', {}, 'Toggle Buttons' ),
  cE( Toggle, {id: true} ),  // Without Babel, this isn't caught
  cE( Toggle, {id: 'Button_1'} ),
  cE( Toggle, {id: 'Button_2'} ),
  cE( Toggle, {id: 'Button_3'} )
)
ReactDOM.render( toggleElements, document.getElementById( 'toggle-button' ) )


// =====================================================================================================================
// V5 -- Forms (Controlled State) > React Component is only source of "Truth"

class Dropdown extends React.Component {
  constructor( props ) {
    super( props )
    this.handleChange = this.handleChange.bind( this )
  }

  handleChange( e ) {
    this.props.onDropdownChange( e.target.value )  // FYI: lift state
  }

  render() {
    // Make sure to use: `this.PROPS.dropdown` rather than `.state.`
    return(
      cE( 'select', {onChange: this.handleChange, value: this.props.dropdown},
        this.props.dropdownOptions.map( ( opt ) =>
          cE( 'option', {key: opt.toString(), value: opt}, opt )
        )
      )
    )
  }
}
Dropdown.propTypes = {
  dropdownOptions: PropTypes.array.isRequired,
}

class Reservation extends React.Component {
  constructor( props ) {
    super( props )

    const dropdownOptions = ['Lime', 'Coconut', 'Watermelon', 'Lump Crab Meat']
    this.state = {
      dropdown: dropdownOptions[0],
      dropdownOptions,
      isGoing: true,
      numberOfGuests: 2,
      textarea: 'Please write an essay about your favorite DOM element.',
      username: 'bRIAn',  // WARN: will not be transformed to CAPS until edited
    }

    // Create reference
    this.fileInput = React.createRef()

    // Must bind this to each handler
    this.handleInputChange = this.handleInputChange.bind( this )
    this.handleDropdownChange = this.handleDropdownChange.bind( this )
    this.handleSubmit = this.handleSubmit.bind( this )
    this.handleTextareaChange = this.handleTextareaChange.bind( this )
  }

  handleInputChange( e ) {
    // Example parsing and enforcing formatting
    let value = null
    if ( e.target.type === 'checkbox' )
      value = e.target.checked
    else {
      value = e.target.value
      if ( e.target.name === 'username' ) {
        value = value.toUpperCase()
        // FYI: Test changing dropdown options using lifted state
        this.state.dropdownOptions[4] = value
      }
    }

    // With the ES6 computed property name syntax, update the state
    this.setState( {
      [e.target.name]: value,
    } )
  }

  handleDropdownChange( dropdown ) {
    this.setState( {dropdown} )
  }

  handleSubmit( e ) {
    e.preventDefault()

    console.info( `Currently selected Dropdown item: ${this.state.dropdown}` )
    Object.values(this.fileInput.current.files).map( ( file, idx ) =>
      console.log( `[${idx}] File name: '${file.name}' (${file.type})` )
    )

    const name = this.state.username
    const numGs = this.state.numberOfGuests
    alert( `${name}'s ${numGs} guest${numGs > 1 ? 's are' : ' is'} ${this.state.isGoing ? '' : 'not '}going.` )
  }

  handleTextareaChange( e ) {
    this.setState( {textarea: e.target.value} )
  }

  render() {
    return (
      cE( 'div', {},
        cE( 'h1', {}, 'Controlled Component Examples' ),
        cE( 'form', {onSubmit: this.handleSubmit},
          cE( 'h2', {}, 'Form:' ),
          cE( 'label', {},
            cE( 'span', {}, 'Username:' ),
            cE( 'input', {
              name: 'username',
              onChange: this.handleInputChange,
              type: 'text',
              value: this.state.username,
            } )
          ),
          cE( 'br' ),
          cE( 'label', {},
            cE( 'span', {}, 'Is going:' ),
            cE( 'input', {
              checked: this.state.isGoing,
              name: 'isGoing',
              onChange: this.handleInputChange,
              type: 'checkbox',
            } )
          ),
          cE( 'br' ),
          cE( 'label', {},
            cE( 'span', {}, 'Number of Guests:' ),
            cE( 'input', {
              name: 'numberOfGuests',
              onChange: this.handleInputChange,
              type: 'number',
              value: this.state.numberOfGuests,
            } )
          ),
          cE( 'br' ),
          // Test using components (select) within a form
          cE( Dropdown, {
            dropdownOptions: this.state.dropdownOptions,
            onDropdownChange: this.handleDropdownChange,
          } ),
          cE( 'br' ),
          // FYI: Example use ref (input type:file is always an uncontrolled component)
          cE( 'input', {multiple: true, ref: this.fileInput, type: 'file'} ),
          cE( 'br' ),
          cE( 'input', {type: 'submit', value: 'Submit'} )
        ),
        cE( 'h2', {}, 'Text Area:' ),
        cE( 'textarea', {
          onChange: this.handleTextareaChange,
          value: this.state.textarea,
        }  )
      )
    )
  }
}

const mountNode = document.getElementById( 'reservation' )

ReactDOM.render( cE( Reservation ), mountNode )

// // Example - The input is locked at first but becomes editable after a short delay.
// ReactDOM.render( cE( 'input', {value: 'hi'} ), mountNode )
// setTimeout( () => {
//   ReactDOM.render( cE( 'input', {value: 'NULL!'} ), mountNode )
//   ReactDOM.render( cE( 'input', {value: null} ), mountNode )
// }, 2500 )

// When building forms, see https://jaredpalmer.com/formik

// =====================================================================================================================
// V6 - Lifting State

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit',
}

function BoilingVerdict( props ) {
  return cE( 'p', {}, `The water would${props.celsius >= 100 ? '' : ' not'} boil.` )
}

function toCelsius( fahrenheit ) {
  return ( fahrenheit - 32 ) * 5 / 9
}

function toFahrenheit( celsius ) {
  return ( celsius * 9 / 5 ) + 32
}

function tryConvert( temperature, convert ) {
  const input = parseFloat( temperature )
  if ( Number.isNaN( input ) )
    return ''

  const output = convert( input )
  const rounded = Math.round( output * 1000 ) / 1000
  return rounded.toString()
}

// F|C Temperature Input Element
class TemperatureInput extends React.Component {
  constructor( props ) {
    super( props )
    this.handleChange = this.handleChange.bind( this )
  }

  handleChange( e ) {
    this.props.onTemperatureChange( e.target.value )
  }

  render() {
    return (
      cE( 'fieldset', {},
        cE( 'legend', {}, `Enter temperature in ${scaleNames[this.props.scale]}:` ),
        cE( 'input', {onChange: this.handleChange, value: this.props.temperature} )
      )
    )
  }
}

// Combined F & C Temperature Inputs. Determines if temperature would boil water
class Calculator extends React.Component {
  constructor( props ) {
    super( props )
    this.handleCelsiusChange = this.handleCelsiusChange.bind( this )
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind( this )
    this.state = {scale: 'c', temperature: ''}
  }

  handleCelsiusChange( temperature ) {
    // FYI: When state changes, the render() method is called, so C and F are recalculated
    this.setState( {scale: 'c', temperature} )
  }

  handleFahrenheitChange( temperature ) {
    this.setState( {scale: 'f', temperature} )
  }

  render() {
    const scale = this.state.scale
    const temperature = this.state.temperature
    // Handle case where input is not a number with tryConvert
    const celsius = scale === 'f' ? tryConvert( temperature, toCelsius ) : temperature
    const fahrenheit = scale === 'c' ? tryConvert( temperature, toFahrenheit ) : temperature

    return (
      cE( 'div', {},
        cE( 'h1', {}, 'Linked Calculator Inputs' ),
        cE( TemperatureInput, {
          onTemperatureChange: this.handleCelsiusChange,
          scale: 'c',
          temperature: celsius,
        } ),
        cE( TemperatureInput, {
          onTemperatureChange: this.handleFahrenheitChange,
          scale: 'f',
          temperature: fahrenheit,
        } ),
        cE( BoilingVerdict, {celsius: parseFloat( celsius )} )
      )
    )
  }
}

ReactDOM.render( cE( Calculator ), document.getElementById( 'calculator' ) )


// =====================================================================================================================
// V7 - Don't do Inheritance

// Containment example
function FancyBorder( props ) {
  return (
    cE( 'div', {className: `FancyBorder FancyBorder-${props.color}`}, props.children )
  )
}
// This lets other components pass arbitrary children to them by nesting the JSX:
function WelcomeDialog( props ) {
  return (
    cE( FancyBorder, {color: props.color},
      cE( 'h1', {className: 'dialog-title'}, 'Welcome' ),
      cE( 'p', {className: 'dialog-message'}, 'Thank you for visiting our spacecraft!' )
    )
  )
}
ReactDOM.render( cE( WelcomeDialog, {color: 'blue'} ), document.getElementById( 'containment-basic' ) )

// Example with specified children
function SplitPane( props ) {
  return (
    cE( 'div', {className: 'row'},
      cE( 'div', {className: 'col-6'}, props.left ),
      cE( 'div', {className: 'col-6'}, props.right )
    )
  )
}
ReactDOM.render(
  cE( SplitPane, {
    left: cE( WelcomeDialog, {color: 'red'} ),
    right: cE( WelcomeDialog, {color: 'blue'} ),
  } ), document.getElementById( 'containment-splitPane' ) )


// Specialization Example
function Dialog( props ) {
  return (
    cE( FancyBorder, {color: 'blue'},
      cE( 'h1', {className: 'dialog-title'}, props.title ),
      cE( 'p', {className: 'dialog-message'}, props.message ),
      props.children
    )
  )
}

class SignUpDialog extends React.Component {
  constructor( props ) {
    super( props )
    this.handleChange = this.handleChange.bind( this )
    this.handleSignUp = this.handleSignUp.bind( this )
    this.state = {login: ''}
  }

  render() {
    return (
      cE( 'div', {},
        cE( Dialog, {message: 'How should we refer to you?', title: 'Mars Exploration Program'},
          cE( 'input', {onChange: this.handleChange, value: this.state.login} ),
          cE( 'button', {onClick: this.handleSignUp}, 'Sign me up!' )
        ),
        cE( Dialog, {},
          cE( 'p', {}, 'Only children, no message or title example' )
        )
      )
    )
  }

  handleChange( e ) {
    this.setState( {login: e.target.value} )
  }

  handleSignUp() {
    alert( `Welcome aboard, ${this.state.login}!` )
  }
}
ReactDOM.render( cE( SignUpDialog ), document.getElementById( 'specialization' ) )


// =====================================================================================================================
// V8 - Thinking in React

// The easiest way is to build a version that takes your data model and renders the UI but has no interactivity.
// It’s best to decouple these processes because building a static version requires a lot of typing and no thinking,
//   and adding interactivity requires a lot of thinking and not a lot of typing.
