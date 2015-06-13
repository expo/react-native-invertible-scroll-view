/**
 * @flow weak
 */
'use strict';

var React = require('react-native');
var ScrollableMixin = require('react-native-scrollable-mixin');
var {
  PropTypes,
  ScrollView,
  StyleSheet,
  View,
} = React;

type DefaultProps = {
  renderScrollComponent: (props: Object) => ReactComponent;
};

var InvertibleScrollView = React.createClass({
  mixins: [ScrollableMixin],

  propTypes: {
    ...ScrollView.propTypes,
    inverted: PropTypes.bool,
    renderScrollComponent: PropTypes.func.isRequired,
  },

  getDefaultProps(): DefaultProps {
    return {
      renderScrollComponent: (props) => <ScrollView {...props} />,
    };
  },

  getScrollResponder(): ReactComponent {
    return this._scrollView.getScrollResponder();
  },

  setNativeProps(props: Object) {
    this._scrollView.setNativeProps(props);
  },

  render() {
    var {
      inverted,
      renderScrollComponent,
      ...props,
    } = this.props;

    if (inverted) {
      if (this.props.horizontal) {
        props.style = [styles.horizontallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted);
      } else {
        props.style = [styles.verticallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted);
      }
    }

    return React.cloneElement(renderScrollComponent(props), {
      ref: component => {
        this._scrollView = component;
      },
    });
  },

  _renderInvertedChildren(children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });
  },
});

var styles = StyleSheet.create({
  verticallyInverted: {
    transformMatrix: [
       1,  0,  0,  0,
       0, -1,  0,  0,
       0,  0,  1,  0,
       0,  0,  0,  1,
    ],
  },
  horizontallyInverted: {
    transformMatrix: [
      -1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       0,  0,  0,  1,
    ],
  },
});

module.exports = InvertibleScrollView;
