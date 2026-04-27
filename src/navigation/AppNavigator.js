import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import PostScreen from '../screens/PostScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Post" 
        component={PostScreen} 
        options={{ 
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
      <Stack.Screen 
        name="ChatDetail" 
        component={ChatDetailScreen} 
        options={{ 
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
