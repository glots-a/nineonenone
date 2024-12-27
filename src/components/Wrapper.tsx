import {StyleSheet} from 'react-native';
import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

interface WrapperProps {
  children: ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({children}) => {
  return <SafeAreaView style={S.WRAPPER}>{children}</SafeAreaView>;
};

const S = StyleSheet.create({
  WRAPPER: {
    paddingTop: 0,
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});
