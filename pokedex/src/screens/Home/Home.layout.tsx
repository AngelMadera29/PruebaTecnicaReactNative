import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { usePokemons, usePokemonTypes } from '@/api/pokemon.fetch';
import axios from 'axios';
import { useTypesStore } from '@/store/useTypes.store';

export const HomeLayout: React.FC<any> = ({ navigation }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePokemons();
  const { types, setTypes } = useTypesStore();
  const { data: remoteTypes, isLoading: loadingTypes } = usePokemonTypes();

  const [search, setSearch] = useState('');
  const [remoteResult, setRemoteResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [typeFilteredPokemons, setTypeFilteredPokemons] = useState<any[]>([]);

  const pokemons = useMemo(() => data?.pages.flatMap((p) => p.results) || [], [data]);

  useEffect(() => {
    if (remoteTypes && remoteTypes.length && types.length === 0) {
      setTypes(remoteTypes);
    }
  }, [remoteTypes, setTypes, types]);

  const filtered = useMemo(() => {
    if (!search.trim()) return pokemons;
    return pokemons.filter((p) =>
      p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [search, pokemons]);

  const handleSearchChange = useCallback(
    async (text: string) => {
      setSearch(text);
      setRemoteResult(null);

      if (!text.trim()) return;

      const localFound = pokemons.find(
        (p) => p.name.toLowerCase() === text.trim().toLowerCase()
      );
      if (localFound) return;

      try {
        setIsSearching(true);
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${text.toLowerCase()}`
        );
        setRemoteResult({
          name: data.name,
          types: data.types.map((t: any) => t.type.name),
        });
      } catch {
        setRemoteResult(null);
      } finally {
        setIsSearching(false);
      }
    },
    [pokemons]
  );

  const handleTypeSelect = useCallback(
    async (type: string) => {
      setSelectedType(type);

      if (type === 'all') {
        setTypeFilteredPokemons([]);
        return;
      }

      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
        const typePokemons = data.pokemon.map((p: any) => p.pokemon.name);
        const filteredLocal = filtered.filter((p) => typePokemons.includes(p.name));
        setTypeFilteredPokemons(filteredLocal);
      } catch {
        setTypeFilteredPokemons([]);
      }
    },
    [filtered]
  );

  const combinedList = useMemo(() => {
    let list = typeFilteredPokemons.length ? typeFilteredPokemons : filtered;

    if (remoteResult && !list.find((p) => p.name === remoteResult.name)) {
      if (selectedType === 'all' || remoteResult.types?.includes(selectedType)) {
        list = [remoteResult, ...list];
      }
    }

    return list;
  }, [filtered, typeFilteredPokemons, remoteResult, selectedType]);

  if (isLoading || loadingTypes)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#fff'  }}>
      <TextInput
        placeholder="Buscar Pokémon..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={handleSearchChange}
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginBottom: 10,
          fontSize: 16,
          color: '#000',
        }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
        {['all', ...types].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => handleTypeSelect(type)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: selectedType === type ? '#4CAF50' : '#ddd',
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: selectedType === type ? '#fff' : '#333',
                textTransform: 'capitalize',
              }}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isSearching && (
        <Text style={{ textAlign: 'center', color: '#999', marginBottom: 5 }}>
          Buscando...
        </Text>
      )}

      <FlatList
        data={combinedList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: '#f2f2f2',
              marginVertical: 5,
              padding: 10,
              borderRadius: 8,
            }}
            onPress={() => navigation.navigate('Detail', { name: item.name })}
          >
            <Text style={{ fontSize: 18, textTransform: 'capitalize', color: '#000' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ margin: 10 }} /> : null}
      />
    </View>
  );
};
