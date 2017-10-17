var React = require('React')
var ReactDOM = require('react-dom')
var createReactClass = require('create-react-class')

var Scatter = require('./scatter.jsx')

document.body.style.margin = 0
document.body.style.background = '#333'
document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'

var container = document.createElement('div')
container.style.display = 'flex'
container.style.justifyContent = 'center'
container.style.alignItems = 'center'
container.style.height = '100vh'

document.body.appendChild(container)

var ScatterContainer = createReactClass({

  displayName: 'ScatterContainer',

  getInitialState () {
    return {
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
      dataset: 'https://azure-respect.glitch.me/iris.json'
    }
  },

  componentDidMount () {
    var _this = this

    window.onresize = function () {
      _this.setState({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8
      })
    }
  },

  render () {
    return (
      <Scatter
        width={this.state.width}
        height={this.state.height}
        dataset={this.state.dataset}
      />
    )
  }
})

ReactDOM.render(<ScatterContainer />, container)
