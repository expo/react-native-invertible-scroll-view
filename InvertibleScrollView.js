/**
 * Copyright (c) 2015-present, 650 Industries, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT License
 *
 * @flow
 */
'use strict';

var React = require('React');
var ScrollView = require('ScrollView');
var StyleSheet = require('StyleSheet');

var PropTypes = React.PropTypes;

var InvertibleScrollView = React.createClass({
  propTypes: {...ScrollView.propTypes,
    inverted: PropTypes.bool,
  },

  render() {
    if (this.props.inverted) {
      var invertedChildren = React.Children.map(this.props.children, (child) => {
        if (child) {
          // Figure out how to not use a wrapper View when not necessary
          // For ListViews, we use them because StaticRenderers, are used
          // for all of children
          return <View style={styles.inverted}>{child}</View>;
        } else {
          return child;
        }
      }, this.context);
      return <ScrollView {...this.props} style={[styles.inverted, this.props.style,]}>{invertedChildren}</ScrollView>;
    } else {
      return <ScrollView {...this.props} />;
    }
  },

});

var styles = StyleSheet.create({
  inverted: {
    transformMatrix:
      [ -1,  0,  0,  0,
         0, -1,  0,  0,
         0,  0,  1,  0,
         0,  0,  0,  1,
      ],
  },
});

module.exports = InvertibleScrollView;
