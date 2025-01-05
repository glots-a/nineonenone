import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {MapSvg} from '../assets';
import {RootStackParamList} from '../types/RootStackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type Props = {
  loc: 'wifi' | 'bl';
};
export const MapButton: React.FC<Props> = ({loc}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      style={S.navigateMap}
      onPress={() => navigation.navigate('Map', {loc: loc})}>
      <MapSvg />
      <Text style={[S.item_text, S.text_color]}>Карта </Text>
    </TouchableOpacity>
  );
};

const S = StyleSheet.create({
  navigateMap: {
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    borderRadius: 8,
    backgroundColor: '#D128A1',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 32,
    bottom: 32,
  },
  item_text: {
    fontSize: 16,
    fontWeight: '600',
  },
  text_color: {
    color: '#fff',
  },
});
