import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {FullScreenLoader} from '.';
import {QrCodeSvg} from '../assets';
import {useAppDispatch, useAppSelector} from '../redux/hooks/redux-hooks';
import {addNewCode} from '../redux/dataSlice';
import {Code} from '../types/Code';

const WIDTH = Dimensions.get('screen').width;

export const BarcodeScanner = () => {
  const device = useCameraDevice('back');
  const [showScanner, setShowScanner] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const dispatch = useAppDispatch();
  const codeData = useAppSelector(state => state.storeddata.codes);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      const code = {value: codes[0].value, type: codes[0].type};
      dispatch(addNewCode(code));
    },
  });

  const keyExtractor = (item: Code, index: number): string => {
    return item.id || index.toString();
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const renderItem = useCallback(
    ({item}: {item: Code}) => (
      <View style={S.renderItem}>
        <Text style={S.item_text}>{item.type}</Text>
        <Text style={S.item_text}>{item.value}</Text>
      </View>
    ),
    [codeData],
  );

  if (!hasPermission) {
    return <FullScreenLoader />;
  }

  if (!device) {
    return;
  }

  return (
    <View style={S.container}>
      <View style={S.cameraContainer}>
        <Camera
          style={S.cameraContainer}
          device={device}
          isActive={showScanner}
          codeScanner={codeScanner}
        />
      </View>

      <TouchableOpacity
        style={S.startScan}
        onPress={() => setShowScanner(!showScanner)}>
        <QrCodeSvg />
        <Text style={S.scan}>{!showScanner ? 'Сканувати' : 'Відключити'} </Text>
      </TouchableOpacity>

      <FlatList
        data={codeData || []}
        contentContainerStyle={S.flatlist}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        windowSize={19}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const S = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: 'center',
    rowGap: 16,
    flex: 1,
  },
  cameraContainer: {
    width: 320,
    alignSelf: 'center',
    height: 180,
  },
  startScan: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9a9da1',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  scan: {
    fontSize: 16,
    color: '#343b36',
    textAlign: 'center',
  },
  renderItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    columnGap: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9a9da1',
    width: WIDTH - 32,
    paddingHorizontal: 8,
    paddingVertical: 32,
  },
  flatlist: {
    rowGap: 8,
  },
  item_text: {fontSize: 16, fontWeight: '600'},
});
