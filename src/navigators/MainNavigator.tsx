import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BluetothScreen, Home, QRScreen, WifiScreen} from '../screens';
import {MapScreen} from '../screens/MapScreen';
import {permission} from '../helpers/permission';

const {Navigator, Screen} = createNativeStackNavigator();

export const MainNavigator = () => {
  useEffect(() => {
    permission();
  }, []);

  return (
    <Navigator initialRouteName="Home">
      <Screen name="Home" component={Home} options={{headerShown: false}} />
      <Screen
        name="QrScreen"
        component={QRScreen}
        options={{
          title: 'QR Scanner',
          headerTitleAlign: 'center',
          gestureEnabled: false,
        }}
      />
      <Screen
        name="Wifi"
        component={WifiScreen}
        options={{title: 'Wifi', headerTitleAlign: 'center'}}
      />
      <Screen
        name="Bluetoth"
        component={BluetothScreen}
        options={{title: 'Bluetoth', headerTitleAlign: 'center'}}
      />
      <Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Map', headerTitleAlign: 'center'}}
      />
    </Navigator>
  );
};
