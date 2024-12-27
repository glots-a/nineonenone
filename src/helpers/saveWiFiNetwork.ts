import {WifiNetwork} from '../types/WIFI';
import firestore from '@react-native-firebase/firestore';

export const saveWifiNetwork = async (networkData: WifiNetwork) => {
  try {
    await firestore().collection('network').add(networkData);
    console.log('Wifi network saved!');
  } catch (error) {
    console.error('Error saving wifi network:', error);
  }
};
