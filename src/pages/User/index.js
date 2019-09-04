import React from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';
import {
  Author,
  Avatar,
  Bio,
  Container,
  Header,
  Info,
  LoadingIndicator,
  Name,
  OwnerAvatar,
  Starred,
  Stars,
  StarsFooter,
  Title,
} from './styles';

export default class User extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: true,
      page: 1,
      refreshing: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      loading: false,
    });
  }

  loadMore = async () => {
    const { navigation } = this.props;
    const { page, stars } = this.state;

    const user = navigation.getParam('user');

    const response = await api.get(
      `/users/${user.login}/starred?page=${page + 1}`
    );

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
      page: page + 1,
    });
  };

  refreshList = async () => {
    const { navigation } = this.props;

    const user = navigation.getParam('user');

    this.setState({ refreshing: true });
    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      refreshing: false,
    });
  };

  render() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, loading, refreshing } = this.state;

    if (loading) return <LoadingIndicator />;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {refreshing ? (
          <LoadingIndicator />
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            ListFooterComponent={<StarsFooter />}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred
                onPress={() =>
                  navigation.navigate('StarView', {
                    name: item.full_name,
                    url: item.html_url,
                  })
                }
              >
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
