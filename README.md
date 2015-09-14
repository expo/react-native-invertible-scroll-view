# InvertibleScrollView [![Slack](http://slack.exponentjs.com/badge.svg)](http://slack.exponentjs.com)

InvertibleScrollView is a React Native scroll view that can be inverted so that content is rendered starting from the bottom, and the user must scroll down to reveal more. This is a common design in chat applications and the command-line terminals. InvertibleScrollView also supports horizontal scroll views to present content from right to left.

It conforms to [ScrollableMixin](https://github.com/exponentjs/react-native-scrollable-mixin) so you can compose it with other scrollable components.

[![npm package](https://nodei.co/npm/react-native-invertible-scroll-view.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-native-invertible-scroll-view/)

## Installation
Use this with react-native 0.8.0-rc or later.

```
npm install react-native-invertible-scroll-view
```

## Usage

Compose InvertibleScrollView with the scrollable component you would like to invert. In the case of a ListView, you would write:

```js
var React = require('react-native');
var InvertibleScrollView = require('react-native-invertible-scroll-view');
var {
  ListView,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
} = React;

class InvertedScrollComponent extends React.Component {
  constructor(props) {
    super(props);
    this._data = [];
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      })
    };
  }

  onPress() {
    this._data.push(`${new Date}`);
    var rows = this._data;
    // It's important to keep row ID's consistent to avoid extra renders
    // But the ID's need to be "reversed" so that the inversion will order the rows correctly
    var rowIds = this._data.map((row, index) => index).reverse();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rows, rowIds)
    });
  }

  renderRow(row) {
    return <Text style={{paddingVertical: 5}}>{row}</Text>
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.onPress.bind(this)} style={styles.button}>
          <Text>Add a row</Text>
        </TouchableHighlight>
        <ListView
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    marginBottom: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  container: {
    paddingTop: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
```

**NOTE:** When inverting a ListView, you must create a ListView that delegates to an InvertibleScrollView as shown above and not the other way around. Otherwise it will not be able to invert the rows and the content will look upside down. This is true for any scroll view that adds its own children, not just ListView.

## Tips and Caveats

- Horizontal scroll views are supported
- To scroll to the bottom, call `scrollTo(0)` on a ref to the scroll view
- When the scroll view is inverted, InvertibleScrollView wraps each child in a View that is flipped
- Scroll views that add children (ex: ListViews) must delegate to InvertibleScrollViews so that the children can be properly inverted
- List section headers are unsupported
- Styles like `padding` are not corrected, so top padding will actually pad the bottom of the component
- Properties like `contentOffset` and `contentInset` are not flipped; for example, the top inset adjusts the bottom of an inverted scroll view

## Implementation

InvertibleScrollView uses transformation matrices to efficiently invert the view. The scroll view's viewport is inverted to flip the entire component, and then each child is inverted again so that the content appears unflipped.
