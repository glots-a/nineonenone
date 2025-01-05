import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {WifiSvg} from '../assets';
import {useAppDispatch, useAppSelector} from '../redux/hooks/redux-hooks';
import WifiManager from 'react-native-wifi-reborn';
import {addNewNetwork} from '../redux/dataSlice';
import {permission} from '../helpers/permission';
import {delay} from '../helpers/delay';
import {Location, WifiNetwork} from '../types/WIFI';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/RootStackParamList';
import useGetUserLocation from '../hooks/useGetUserLocation';
import {saveWifiNetwork} from '../helpers/saveWiFiNetwork';
import {ModalInfo} from './ModalInfo';
import {MapButton} from './MapButton';

const WIDTH = Dimensions.get('screen').width;

export const WifiScaner = () => {
  const [scaning, setScanning] = useState(false);
  const dispatch = useAppDispatch();
  const networkData = useAppSelector(state => state.storeddata.wifi);
  const [selectedSSID, setSelectedSSID] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [permissionGranted, setPermissionGranted] = useState(false);

  const {userLocation, loading} = useGetUserLocation(permissionGranted);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getWifiList = async (userCoordinates: Location) => {
    if (userCoordinates.latitude === 0 || userCoordinates.longitude === 0) {
      console.log('User location is not available yet');
      setModalVisible(true);
      return;
    }

    setScanning(true);
    try {
      const enabled = await WifiManager.isEnabled();

      if (!enabled) {
        setModalVisible(true);
        return;
      }

      const res = await WifiManager.loadWifiList();
      await delay(2000);
      res.forEach(async network => {
        await saveWifiNetwork({
          ...network,
          location: userCoordinates,
        });
      });

      dispatch(
        addNewNetwork({
          networks: res,
          location: userLocation,
        }),
      );
    } catch (error) {
      console.error('error message', error);
    } finally {
      setScanning(false);
    }
  };

  const keyExtractor = (item: WifiNetwork, index: number) => {
    return item.BSSID || index.toString();
  };

  const handleConnectToNetwork = (SSID: string | undefined) => {
    //string | undefined
    if (SSID) {
      setTimeout(() => {
        Alert.alert(`Імітація: успішно підключено до мережі "${SSID}"`);
        setSelectedSSID(SSID);
      }, 500);
    } else {
      Alert.alert('Імітація: не вдалося підключитися до мережі');
    }
  };

  const renderItem = ({item}: {item: WifiNetwork}) => {
    return (
      <TouchableOpacity
        style={[S.renderItem, item.SSID === selectedSSID && S.selected]}
        onPress={() => {
          handleConnectToNetwork(item?.SSID);
        }}>
        <Text style={S.item_text}>SSID: {item?.SSID}</Text>
        <Text style={S.item_text}>Потужність: {item?.level}</Text>
      </TouchableOpacity>
    );
  };

  const handleDecline = useCallback(() => {
    setModalVisible(false);
    navigation.goBack();
  }, []);

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await permission();
      setPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
    };
    checkPermission();
  }, []);

  useEffect(() => {
    const checkWifi = async () => {
      try {
        const enabled = await WifiManager.isEnabled();
        if (!enabled) {
          WifiManager.setEnabled(true);
        }
      } catch (error) {
        console.log('setEnabled', error);
      }
    };

    checkWifi();
  }, []);

  return (
    <View style={S.container}>
      {loading ? (
        <ActivityIndicator color={'#D128A1'} />
      ) : (
        <TouchableOpacity
          style={S.startScan}
          onPress={() => getWifiList(userLocation)}>
          {scaning ? (
            <ActivityIndicator color={'#D128A1'} />
          ) : (
            <>
              <WifiSvg />
              <Text style={S.scan}>{'Сканувати'} </Text>
            </>
          )}
        </TouchableOpacity>
      )}
      <Text style={S.title}>Знайдені мережі:</Text>
      {networkData && networkData?.length > 0 ? (
        <FlatList
          data={networkData}
          contentContainerStyle={S.flatlist}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          windowSize={19}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={S.noDevicesText}>Список Wifi мереж пустий</Text>
      )}

      {networkData.length > 0 && <MapButton loc="wifi" />}

      <ModalInfo
        visible={modalVisible}
        onClose={handleDecline}
        title={
          'Щоб продовжити, пристрій має використовувати точну геолокацію та WiFi.'
        }
        message={
          'Потрібно увімкнути місцеположення пристрою та переконатичь що WiFi увімкненний.'
        }
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
    width: '60%',
  },
  scan: {
    fontSize: 16,
    color: '#343b36',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
    color: '#000',
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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
  item_text: {
    fontSize: 16,
    fontWeight: '600',
  },
  text_color: {
    color: '#fff',
  },
  selected: {
    backgroundColor: 'rgba(207, 43, 193, 0.2)',
  },
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
});
