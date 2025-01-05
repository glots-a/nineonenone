import {Animated, StyleSheet, useAnimatedValue} from 'react-native';
import React, {ReactNode, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

interface WrapperProps {
  children: ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({children}) => {
  const fadeAnim = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={S.WRAPPER}>
      <Animated.View style={[S.ctr, {opacity: fadeAnim}]}>
        {children}
      </Animated.View>
    </SafeAreaView>
  );
};

const S = StyleSheet.create({
  WRAPPER: {
    paddingTop: 0,
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  ctr: {
    flex: 1,
  },
});
