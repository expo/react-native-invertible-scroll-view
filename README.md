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
} = React;

// Inside of a component's render() method:
render() {
  return (
    <ListView
      renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
      dataSource={...}
      renderRow={...}
    />
  );
}
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

InvertibleScrollView uses a scale transformation to efficiently invert the view. The scroll view's viewport is inverted to flip the entire component, and then each child is inverted again so that the content appears unflipped.
