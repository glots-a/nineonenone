import React, {useCallback, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BluetothScreen, Home, QRScreen, WifiScreen} from '../screens';
import {MapScreen} from '../screens/MapScreen';
import {permission} from '../helpers/permission';
import {RemoveButton} from '../components';

const {Navigator, Screen} = createNativeStackNavigator();

export const MainNavigator = () => {
  useEffect(() => {
    permission();
  }, []);

  const renderRemoveButton = useCallback(
    (anchor: 'qr' | 'bl' | 'wifi') => <RemoveButton anchor={anchor} />,
    [],
  );

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
          headerRight: () => renderRemoveButton('qr'),
        }}
      />
      <Screen
        name="Wifi"
        component={WifiScreen}
        options={{
          title: 'Wifi',
          headerTitleAlign: 'center',
          headerRight: () => renderRemoveButton('wifi'),
        }}
      />
      <Screen
        name="Bluetoth"
        component={BluetothScreen}
        options={{
          title: 'Bluetooth',
          headerTitleAlign: 'center',
          headerRight: () => renderRemoveButton('bl'),
        }}
      />
      <Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Map', headerTitleAlign: 'center'}}
      />
    </Navigator>
  );
};
