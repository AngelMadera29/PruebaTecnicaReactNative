import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFavorites } from '@/store/useFavorites.store';
import { usePokemonDetail } from '@/api/pokemon.fetch';
import FastImage from 'react-native-fast-image';
export const FavoritesLayout: React.FC<any> = ({ navigation }) => {
  const favorites = useFavorites((s) => s.favorites);

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#999' }}>No tienes Pokémon favoritos aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(name) => name}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item: name }) => <FavoriteCard name={name} navigation={navigation} />}
    />
  );
};

const FavoriteCard = ({ name, navigation }: { name: string; navigation: any }) => {
  const { data } = usePokemonDetail(name);

  if (!data) return null;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detail', { name })}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        elevation: 2,
      }}
    >
      <FastImage
        source={{   uri: data.sprites.front_default, priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.contain}
        style={{ width: 60, height: 60, marginRight: 12 }}
      />
      <View>
        <Text style={{ fontSize: 18, textTransform: 'capitalize', fontWeight: '600' }}>
          {data.name}
        </Text>
        <Text style={{ color: '#555' }}>
          {data.types.map((t: any) => t.type.name).join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
