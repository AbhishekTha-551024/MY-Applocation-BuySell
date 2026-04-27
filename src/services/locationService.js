import * as Location from 'expo-location';

export const LocationService = {
  /**
   * Request permissions and get current location
   */
  getCurrentLocation: async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  },

  /**
   * Reverse geocode to get neighborhood name
   */
  getNeighborhood: async (latitude, longitude) => {
    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const item = reverseGeocode[0];
        return item.district || item.city || item.name || 'Nearby';
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Nearby';
    }
  }
};
