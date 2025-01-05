import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const CameraNotAvalible = () => {
  return (
    <View style={styles.ctr}>
      <Text style={styles.text}>Сканування коду не доступно</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ctr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'semibold',
    fontStyle: 'italic',
  },
});
