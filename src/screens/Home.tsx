import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BluetoothSvg, QrCodeSvg, WifiSvg} from '../assets';
import {RootStackParamList} from '../types/RootStackParamList';

type Button = {
  id: string;
  label: string;
  screen: keyof RootStackParamList;
  icon: React.FC;
};

export const Home = () => {
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const buttons: Button[] = [
    {id: 'qr', label: 'QR-code scanner', screen: 'QrScreen', icon: QrCodeSvg},
    {id: 'wifi', label: 'WiFi network inspect', screen: 'Wifi', icon: WifiSvg},
    {
      id: 'bluetooth',
      label: 'Bluetooth device detector',
      screen: 'Bluetoth',
      icon: BluetoothSvg,
    },
  ];

  const handlePress = (id: string | null): void => {
    setPressedButton(id);
  };

  return (
    <View style={S.CTR}>
      {buttons.map(button => (
        <Pressable
          key={button.id}
          style={({pressed}) => [S.nav_button, pressed && S.pressed]}
          onPressIn={() => handlePress(button.id)}
          onPressOut={() => handlePress(null)}
          onPress={() => {
            navigation.navigate(button.screen);
          }}>
          <button.icon />
          <Text
            style={[
              S.button_text,
              pressedButton === button.id && S.button_text_presed,
            ]}>
            {button.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const S = StyleSheet.create({
  CTR: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 16,
  },
  nav_button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 8,
    paddingVertical: 16,
    borderRadius: 8,
    width: '75%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: '#D128A1',
    borderColor: 'transparent',
  },
  button_text: {
    color: '#000',
    fontWeight: '600',
  },
  button_text_presed: {
    color: '#fff',
  },
});
