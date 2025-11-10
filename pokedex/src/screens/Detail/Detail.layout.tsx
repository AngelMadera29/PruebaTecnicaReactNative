import React from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { usePokemonDetail } from '@/api/pokemon.fetch';
import { useFavorites } from '@/store/useFavorites.store';
import FastImage from 'react-native-fast-image';


export const DetailLayout: React.FC = () => {
  const route = useRoute();
  const { name } = (route.params || {}) as { name?: string };
  const { data, isLoading } = usePokemonDetail(name);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorite = !!name && favorites.includes(name);

 if (isLoading || !data)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );

  const handleToggleFavorite = () => {
    if (!name) return;
    if (isFavorite) {
      removeFavorite(name);
    } else {
      addFavorite(name);
    }
  };

  return (
    <View style={{ alignItems: 'center', padding: 20 , backgroundColor: '#fff'}}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textTransform: 'capitalize', color: '#000' }}>
        {data.name}
      </Text>

      <FastImage
        source={{ uri: data.sprites.front_default, priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable,}}
        style={{ width: 150, height: 150, marginVertical: 10 }}
        resizeMode={FastImage.resizeMode.contain}
      />

      <Text>Altura: {data.height / 10} m</Text>
      <Text>Peso: {data.weight / 10} kg</Text>
      <Text>Tipo(s): {data.types.map((t: any) => t.type.name).join(', ')}</Text>
            {data.abilities.map((a: any) => (
        <Text key={a.ability.name} style={{ color: '#000' }}>- {a.ability.name}</Text>
        ))}

      <TouchableOpacity
        onPress={handleToggleFavorite}
        style={{
          marginTop: 20,
          backgroundColor: isFavorite ? '#e53935' : '#43a047',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
