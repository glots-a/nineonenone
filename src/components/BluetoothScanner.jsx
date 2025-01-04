import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  FlatList,
  NativeModules,
  TouchableOpacity,
  NativeEventEmitter,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {BluetoothSvg} from '../assets';
import {handleBluetoothPermissions} from '../helpers/handleBluetothPermissions';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const WIDTH = Dimensions.get('screen').width;

export const BluetoothScanner = () => {
  const peripherals = useRef(new Map());
  const [isScanning, setIsScanning] = useState(false);

  const [discoveredDevices, setDiscoveredDevices] = useState([]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.renderItem}>
        <Text style={styles.item_text}>
          {item?.name || item?.id || 'Назва не доступна'}
        </Text>
        <Text style={styles.item_text}>RSSI: {item?.rssi}</Text>
      </View>
    );
  };

  const keyExtractor = (item, index) => {
    return item?.id || index.toString();
  };

  const scan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    const initializeBluetooth = async () => {
      const permissionsGranted = await handleBluetoothPermissions();

      if (!permissionsGranted) {
        Alert.alert(
          'Потрібні дозволи',
          'Для сканування та підключення до пристроїв потрібні дозволи Bluetooth',
        );
        return;
      }

      try {
        BleManager.checkState()
          .then(res => console.log('checked', res))
          .catch(e => {
            throw new Error(`BleManager state check failed: ${e.message}`);
          });

        await BleManager.start({showAlert: false});
        console.log('BleManager initialized');

        await BleManager.enableBluetooth();
        console.log('Bluetooth is turned on!');
      } catch (error) {
        console.error('Error initializing Bluetooth:', error);
        Alert.alert('Помилка', 'Не вдалося ініціалізувати Bluetooth');
        return;
      }

      try {
        const stopDiscoverListener = BleManagerEmitter.addListener(
          'BleManagerDiscoverPeripheral',
          peripheral => {
            peripherals.current.set(peripheral.id, peripheral);
            setDiscoveredDevices(Array.from(peripherals.current.values()));
          },
        );

        const stopConnectListener = BleManagerEmitter.addListener(
          'BleManagerConnectPeripheral',
          peripheral => {
            console.log('BleManagerConnectPeripheral:', peripheral);
          },
        );

        const stopScanListener = BleManagerEmitter.addListener(
          'BleManagerStopScan',
          () => {
            setIsScanning(false);
          },
        );

        return () => {
          stopDiscoverListener.remove();
          stopConnectListener.remove();
          stopScanListener.remove();
        };
      } catch (error) {
        console.error('Error setting up Bluetooth event listeners:', error);
        Alert.alert('Помилка', 'Помилка пр роботі із мережею');
      }
    };

    initializeBluetooth();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.startScan} onPress={scan}>
        {isScanning ? (
          <ActivityIndicator color={'#D128A1'} />
        ) : (
          <>
            <BluetoothSvg />
            <Text style={styles.scan}>{'Сканувати'} </Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.title}>Знайдені пристрої:</Text>
      {discoveredDevices.length > 0 ? (
        <FlatList
          data={discoveredDevices}
          contentContainerStyle={styles.flatlist}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          windowSize={19}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noDevicesText}>
          Пристроїв Bluetooth не знайдено
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: 'center',
    rowGap: 16,
    flex: 1,
  },

  title: {
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
    color: '#000',
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 14,
  },
  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
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
