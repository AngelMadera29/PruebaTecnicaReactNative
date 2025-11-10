import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeLayout } from '@/screens/Home/Home.layout';
import { DetailLayout } from '@/screens/Detail/Detail.layout';
import { FavoritesLayout } from '@/screens/Favorites/Favorites.layout';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeLayout} options={{ title: 'Pokédex' }} />
      <Stack.Screen name="Detail" component={DetailLayout} options={{ title: 'Detalle' }} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorites" component={FavoritesLayout} options={{ title: 'Favoritos' }} />
      <Stack.Screen name="Detail" component={DetailLayout} options={{ title: 'Detalle' }} />
    </Stack.Navigator>
  );
}

export const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#ef5350',
      tabBarInactiveTintColor: '#999',
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        if (route.name === 'HomeTab') iconName = 'list';
        if (route.name === 'FavoritesTab') iconName = 'heart';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{ title: 'Inicio' }}
    />
    <Tab.Screen
      name="FavoritesTab"
      component={FavoritesStack}
      options={{ title: 'Favoritos' }}
    />
  </Tab.Navigator>
);