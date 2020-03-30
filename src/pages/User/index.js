import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  List,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const user = navigation.getParam('user');

  async function loadFavorites(pg = 1) {
    setLoading(true);
    const response = await api.get(`/users/${user.login}/starred?page=${pg}`);
    setStars(pg > 1 ? [...stars, ...response.data] : response.data);
    setLoading(false);
    setPage(pg);
  }

  function loadMore() {
    loadFavorites(page + 1);
  }

  function renderRefreshing() {
    loadFavorites(1);
    return <ActivityIndicator />;
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      <List
        data={stars}
        keyExtractor={star => String(star.id)}
        refreshing={loading}
        onRefresh={() => renderRefreshing()}
        onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
        onEndReached={() => loadMore()} // Função que carrega mais itens
        ListFooterComponent={() => loading && page > 1 && <ActivityIndicator />}
        renderItem={({ item }) => (
          <Starred
            onPress={() =>
              navigation.navigate('Repository', { repository: item })
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
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
