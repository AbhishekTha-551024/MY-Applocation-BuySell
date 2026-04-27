import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import { geohashForLocation } from 'geofire-common';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/userService';

const { width } = Dimensions.get('window');

const LocationOnboardingScreen = () => {
  const { user, updateUserData } = useAuth();
  const [loadingText, setLoadingText] = useState('Securing your location...');

  useEffect(() => {
    handleLocationOnboarding();
  }, []);

  const handleLocationOnboarding = async () => {
    try {
      // 1. Request Permission
      setLoadingText('Requesting location permissions...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to provide relevant local content. Please enable it in settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // 2. Fetch Location
      setLoadingText('Fetching your coordinates...');
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // 3. Reverse Geocoding
      setLoadingText('Resolving your address...');
      let [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const readableAddress = address 
        ? `${address.district || address.city || ''}, ${address.region || ''}, ${address.country || ''}`.replace(/^, |, $/, '').trim()
        : 'Unknown Location';

      // 4. Calculate Geohash
      const geohash = geohashForLocation([latitude, longitude]);

      // 5. Save to Database
      setLoadingText('Saving your profile...');
      const locationData = {
        latitude,
        longitude,
        geohash,
        readableAddress,
        locationSet: true,
      };

      await UserService.updateUserProfile(user.uid, locationData);

      // 6. Update local state
      updateUserData(locationData);
      
    } catch (error) {
      console.error('Location Onboarding Error:', error);
      Alert.alert(
        'Error',
        'Something went wrong while setting your location. Please try again.',
        [{ text: 'Retry', onPress: handleLocationOnboarding }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_myejioos.json' }}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Setting Up Your Bio</Text>
        <Text style={styles.subtitle}>{loadingText}</Text>
      </View>
    </View>
  );
};

export default LocationOnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationContainer: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
