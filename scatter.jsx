var React = require('React')
var linmap = require('linmap')
var jsonist = require('jsonist')
var createReactClass = require('create-react-class')

var DOT_SIZE = 10
var basicContainerStyle = {
  border: '1px solid #000',
  backgroundColor: '#222',
  position: 'relative',
  boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.5)'
}
var basicDotStyle = {
  width: `${DOT_SIZE}px`,
  height: `${DOT_SIZE}px`,
  borderRadius: '50%',
  position: 'absolute'
}
var tooltipStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  color: '#ddd'
}
var colorPalette = [
  '#1f77b4',
  '#2ca02c',
  '#ff7f0e',
]
var colorDictionary = {}

var Tooltip = createReactClass({
  render() {
    return (
      <div
        style={tooltipStyle}
      >
        <table>
          <tbody>
          <tr>
            <td>i:</td>
            <td>{this.props.index}</td>
          </tr>
          <tr>
            <td>species:</td>
            <td>{this.props.flower.species}</td>
          </tr>
          <tr>
            <td>petal width:</td>
            <td>{this.props.flower.petalWidth}</td>
          </tr>
          <tr>
            <td>petal length:</td>
            <td>{this.props.flower.petalLength}</td>
          </tr>
          <tr>
            <td>sepal width:</td>
            <td>{this.props.flower.sepalWidth}</td>
          </tr>
          <tr>
            <td>sepal length:</td>
            <td>{this.props.flower.sepalLength}</td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
})

module.exports = createReactClass({

  getInitialState() {
    return {
      flowers: [],
      minPetalWidth: 0,
      maxPetalWidth: 0,
      minPetalLength: 0,
      maxPetalLength: 0,
      activeFlowerIndex: -1
    }
  },

  componentDidMount() {
    var _this = this
    jsonist.get(this.props.dataset, {}, function(err, data) {
      if (!err && data.length) {
        var minPetalWidth = data[0].petalWidth
        var maxPetalWidth = data[0].petalWidth
        var minPetalLength = data[0].petalLength
        var maxPetalLength = data[0].petalLength

        data.forEach(function(flower) {
          if (flower.petalWidth < minPetalWidth) {
            minPetalWidth = flower.petalWidth
          } else if (flower.petalWidth > maxPetalWidth) {
            maxPetalWidth = flower.petalWidth
          }
          if (flower.petalLength < minPetalLength) {
            minPetalLength = flower.petalLength
          } else if (flower.petalLength > maxPetalLength) {
            maxPetalLength = flower.petalLength
          }
        })

        _this.setState({
          flowers: data,
          minPetalWidth: minPetalWidth,
          maxPetalWidth: maxPetalWidth,
          minPetalLength: minPetalLength,
          maxPetalLength: maxPetalLength
        })
      }
    })
  },

  drawVisualization() {
    var _this = this
    return this.state.flowers.map(function(flower, i) {

      var topOffset = _this.props.height - DOT_SIZE - linmap(
        _this.state.minPetalLength,
        _this.state.maxPetalLength,
        0,
        _this.props.height - DOT_SIZE,
        flower.petalLength
      )
      var leftOffset = linmap(
        _this.state.minPetalWidth,
        _this.state.maxPetalWidth,
        0,
        _this.props.width - DOT_SIZE,
        flower.petalWidth
      )
      if (!colorDictionary[flower.species]) {
        colorDictionary[flower.species] = colorPalette.pop()
      }
      var color = colorDictionary[flower.species]
      var dotStyle = Object.assign(
        {
          top: topOffset,
          left: leftOffset,
          backgroundColor: color
        },
        basicDotStyle
      )

      return (
        <div
          key={i}
          style={dotStyle}
          onMouseOver={function() {
            _this.setState({ activeFlowerIndex: i })
          }}
          onMouseOut={function() {
            _this.setState({ activeFlowerIndex: -1 })
          }}
        >
        </div>
      )
    })
  },

  render () {
    var containerStyle = Object.assign(
      {
        width: this.props.width,
        height: this.props.height
      },
      basicContainerStyle
    )

    return (
      <div
        style={containerStyle}
      >
        {
          this.state.activeFlowerIndex >= 0 &&
          <Tooltip
            index={this.state.activeFlowerIndex}
            flower={this.state.flowers[this.state.activeFlowerIndex]}
          />
        }
        {this.drawVisualization()}
      </div>
    )
  }
})
