import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MainHomeScreen from '../screens/MainHomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatListScreen from '../screens/ChatListScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Community') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: 65,
        },
      })}
    >
      <Tab.Screen 
        name="Community" 
        component={ExploreScreen} 
      />
      <Tab.Screen 
        name="Messages" 
        component={ChatListScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={SettingsScreen} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
