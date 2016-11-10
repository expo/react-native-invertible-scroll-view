'use strict';

import React, {
  PropTypes,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  I18nManager,
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

    if (this.props.horizontal) {
      if (inverted && I18nManager.isRTL) {
        props.style = [styles.rtl, props.style];
        props.children = this._renderInvertedChildren(props.children, null, true);
      } else if (inverted) {
        props.style = [styles.horizontallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted);
      } else if (I18nManager.isRTL) {
        props.style = [styles.horizontallyInverted, props.style, styles.rtl];
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted, true);
      }
    } else if (inverted) {
      props.style = [styles.verticallyInverted, props.style];
      props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted);
    }

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component; },
    });
  },

  _renderInvertedChildren(children, inversionStyle, reverse) {
    let mapped = React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });

    if (reverse) {
      return mapped.reverse();
    }

    return mapped;
  },
});

let styles = StyleSheet.create({
  rtl: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  verticallyInverted: {
    transform: [
      { scaleY: -1 },
    ],
  },
  horizontallyInverted: {
    transform: [
      { scaleX: -1 },
    ],
  },
});

module.exports = InvertibleScrollView;
