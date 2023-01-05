import React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { Header } from '@components/Header';
import { Container } from './styles';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { Alert, FlatList } from 'react-native';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';

type RootParamList = {
  groups: undefined;
  new: undefined;
  players: {
    group: string
  }
}


export function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('new')
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const data = await groupsGetAll();

      setGroups(data);
    }
    catch (error) {
      console.log(error);
      Alert.alert('Turmas', 'Nao foi possivel carregar as turmas')
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group })
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []));

  // useEffect(() => {
  //   fetchGroups();
  // }, [])

  return (
    <Container>
      <Header />
      <Highlight
        title={'Turmas'}
        subtitle='Jogue com a sua turma'
      />

      {
        isLoading ? <Loading /> :
          <FlatList
            data={groups}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <GroupCard
                title={item}
                onPress={() => handleOpenGroup(item)}
              />
            )}
            contentContainerStyle={groups.length === 0 && { flex: 1 }}
            ListEmptyComponent={() => (
              <ListEmpty
                message='Que tal cadastrar a primeira turma?'
              />
            )}
            showsVerticalScrollIndicator={false}
          />
      }
      <Button
        title='Criar nova turma'
        onPress={handleNewGroup}
      />
    </Container>
  );
}
