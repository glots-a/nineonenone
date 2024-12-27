import {PermissionsAndroid, Platform} from 'react-native';

export const permission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted;
    } catch (error) {
      console.log('Error requesting location permission:', error);
      return PermissionsAndroid.RESULTS.DENIED;
    }
  }
  return PermissionsAndroid.RESULTS.GRANTED;
};
