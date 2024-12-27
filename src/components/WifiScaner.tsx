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
import {MapSvg, WifiSvg} from '../assets';
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

const WIDTH = Dimensions.get('screen').width;

export const WifiScaner = () => {
  const [scaning, setScanning] = useState(false);
  const dispatch = useAppDispatch();
  const networkData = useAppSelector(state => state.storeddata.wifi);
  const [selectedSSID, setSelectedSSID] = useState<string | null>(null);

  const [permissionGranted, setPermissionGranted] = useState(false);

  const {userLocation, loading} = useGetUserLocation(permissionGranted);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getWifiList = async (userCoordinates: Location) => {
    if (userCoordinates.latitude === 0 || userCoordinates.longitude === 0) {
      console.warn('User location is not available yet');
      return;
    }

    setScanning(true);
    try {
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

  const keyExtractor = useCallback(
    (item: WifiNetwork, index: number) => {
      return item.BSSID || index.toString();
    },
    [networkData],
  );

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

  const renderItem = useCallback(
    ({item}: {item: WifiNetwork}) => {
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
    },
    [networkData, selectedSSID],
  );

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await permission();
      setPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
    };
    checkPermission();
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
        <Text style={S.noDevicesText}>Мережу wifi не знайдено</Text>
      )}

      <TouchableOpacity
        style={S.navigateMap}
        onPress={() => navigation.navigate('Map')}>
        <MapSvg />
        <Text style={[S.item_text, S.text_color]}>Карта </Text>
      </TouchableOpacity>
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
