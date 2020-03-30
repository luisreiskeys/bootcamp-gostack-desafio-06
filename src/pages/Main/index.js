import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

export default function Main({ navigation }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);

  async function initialLoad() {
    const memoUsers = await AsyncStorage.getItem('users');

    if (memoUsers) {
      setUsers(JSON.parse(memoUsers));
    }
  }

  useEffect(() => {
    initialLoad();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  async function handleSubmit() {
    setLoading(true);
    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    setUsers([...users, data]);
    setNewUser('');
    setLoading(false);
    Keyboard.dismiss();
  }

  function renderUser(user) {
    return (
      <User>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>

        <ProfileButton onPress={() => navigation.navigate('User', { user })}>
          <ProfileButtonText>Ver Perfil</ProfileButtonText>
        </ProfileButton>
      </User>
    );
  }
  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          value={newUser}
          onChangeText={txt => setNewUser(txt)}
          returnKeyType="send"
          onSubmitEditing={() => handleSubmit()}
        />
        <SubmitButton loading={loading} onPress={() => handleSubmit()}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        renderItem={({ item }) => renderUser(item)}
        keyExtractor={user => user.login}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Usuários',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
