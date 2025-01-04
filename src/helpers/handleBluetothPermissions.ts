import {PermissionsAndroid, Platform} from 'react-native';

export async function handleBluetoothPermissions() {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.debug(
          '[handleBluetoothPermissions] User accepts runtime permissions android 12+',
        );
        return true;
      } else {
        console.error(
          '[handleBluetoothPermissions] User refuses runtime permissions android 12+',
        );
        return false;
      }
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      const checkResult = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (checkResult) {
        console.debug(
          '[handleBluetoothPermissions] Runtime permission Android <12 already OK',
        );
        return true;
      } else {
        const requestResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (requestResult === PermissionsAndroid.RESULTS.GRANTED) {
          console.debug(
            '[handleBluetoothPermissions] User accepts runtime permission android <12',
          );
          return true;
        } else {
          console.error(
            '[handleBluetoothPermissions] User refuses runtime permission android <12',
          );
          return false;
        }
      }
    } else {
      return true; // Non-Android platforms or Android versions < 23
    }
  } catch (error) {
    console.error('handleBluetoothPermissions error:', error);
    return false;
  }
}
