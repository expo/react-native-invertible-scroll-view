'use strict';

import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import React from 'react';
import cloneReferencedElement from 'react-clone-referenced-element';
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import ScrollableMixin from 'react-native-scrollable-mixin';

type DefaultProps = {
  renderScrollComponent: (props: Object) => ReactElement;
};

let InvertibleScrollView = createReactClass({
  mixins: [ScrollableMixin],

  propTypes: {
    ...ScrollView.propTypes,
    inverted: PropTypes.bool,
    renderScrollComponent: PropTypes.func.isRequired,
  },

  getDefaultProps(): DefaultProps {
    return {
      renderScrollComponent: props => <ScrollView {...props} />,
    };
  },

  getScrollResponder(): ReactComponent {
    return this._scrollComponent.getScrollResponder();
  },

  setNativeProps(props: Object) {
    this._scrollComponent.setNativeProps(props);
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

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component; },
    });
  },

  _renderInvertedChildren(children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });
  },
});

const verticalTransform = [
  { scaleY: -1 },
];

const horizontalTransform = [
  { scaleX: -1 },
];

if (Platform.OS === 'android') {
  verticalTransform.push({
    perspective: 1280,
  });
  horizontalTransform.push({
    perspective: 1280,
  })
}

let styles = StyleSheet.create({
  verticallyInverted: {
    flex: 1,
    transform: verticalTransform,
  },
  horizontallyInverted: {
    flex: 1,
    transform: horizontalTransform,
  },
});

module.exports = InvertibleScrollView;
