import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

import { LoadingIndicator } from './styles';

export default class StarView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name'),
  });

  render() {
    const { navigation } = this.props;
    const uri = navigation.getParam('url');
    return (
      <WebView
        source={{ uri }}
        startInLoadingState
        renderLoading={() => <LoadingIndicator />}
      />
    );
  }
}

StarView.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
