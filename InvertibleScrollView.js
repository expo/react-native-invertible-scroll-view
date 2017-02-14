'use strict';

import React, {
  PropTypes,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  I18nManager
} from 'react-native';
import ScrollableMixin from 'react-native-scrollable-mixin';

import cloneReferencedElement from 'react-clone-referenced-element';

type DefaultProps = {
  renderScrollComponent: (props: Object) => ReactElement;
};

let InvertibleScrollView = React.createClass({
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
        props.style = [styles.horizontal, styles.horizontallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, [styles.horizontal, styles.horizontallyInverted]);
      } else {
        props.style = [styles.verticallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted);
      }
    } else {
      if (this.props.horizontal) {
        props.style = [styles.horizontal, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.horizontal);
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

let styles = StyleSheet.create({
  horizontal: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  verticallyInverted: {
    flex: 1,
    transform: [
      { scaleY: -1 },
    ],
  },
  horizontallyInverted: {
    flex: 1,
    transform: [
      { scaleX: I18nManager.isRTL ? -1 : 1 },
    ],
  },
});

module.exports = InvertibleScrollView;
