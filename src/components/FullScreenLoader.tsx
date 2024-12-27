import {StyleSheet, View} from 'react-native';
import React from 'react';
import {BlobLoader} from './BllobLoader';

export const FullScreenLoader = () => {
  return (
    <View style={S.CTR}>
      <BlobLoader />
    </View>
  );
};

const S = StyleSheet.create({
  CTR: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
