import React, {useEffect, useRef, useMemo} from 'react';
import {StyleSheet, View, Animated, Platform} from 'react-native';

export const BlobLoader = () => {
  const scaleM = useRef(new Animated.Value(1.2)).current;
  const opacityBase = useRef(new Animated.Value(0)).current;
  const scaleL = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(0)).current;

  const animationConfig = (value, toValue, duration, delay = 0) => ({
    toValue,
    duration,
    delay,
    useNativeDriver: true,
  });

  useEffect(() => {
    let animation;

    animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleM, animationConfig(scaleM, 0, 500)),
          Animated.timing(
            opacityBase,
            animationConfig(opacityBase, 1, 350, 500),
          ),
          Animated.timing(scaleL, animationConfig(scaleL, 1, 350, 850)),
          Animated.timing(scaleX, animationConfig(scaleX, 1, 350, 1200)),
        ]),
        Animated.delay(100),
      ]),
    );
    animation.start();

    return () => animation?.stop();
  }, [scaleM, opacityBase, scaleL, scaleX]);

  const dotStyles = useMemo(
    () => ({
      baseDot: [S.dot, {opacity: opacityBase}],
      scale6Dot: [S.dot, S.scale6, {opacity: scaleX}],
      scale9Dot: [S.dot, S.scale9, {opacity: scaleL}],
      shadowDot: [
        S.dot,
        S.shadow,
        S.scaleExtra(scaleM),
        {position: 'absolute'},
      ],
    }),
    [opacityBase, scaleX, scaleL, scaleM],
  );

  return (
    <View style={S.container}>
      <View style={S.dotContainer}>
        <Animated.View style={dotStyles.scale6Dot} />
        <Animated.View style={dotStyles.scale9Dot} />
        <Animated.View style={dotStyles.baseDot} />
        <Animated.View style={dotStyles.shadowDot} />
        <Animated.View style={dotStyles.baseDot} />
        <Animated.View style={dotStyles.scale9Dot} />
        <Animated.View style={dotStyles.scale6Dot} />
      </View>
    </View>
  );
};

const S = StyleSheet.create({
  container: {
    height: Platform.OS === 'android' ? 140 : 120,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dotContainer: {
    flexDirection: 'row',
    columnGap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#D128A1',
  },
  shadow: {
    shadowColor: '#D128A1',
    shadowOpacity: 0.9,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    elevation: 10,
  },
  scaleExtra: scale => ({
    transform: [{scale: scale}],
  }),
  scale9: {
    transform: [{scale: 0.8}],
  },
  scale6: {
    transform: [{scale: 0.6}],
  },
});
