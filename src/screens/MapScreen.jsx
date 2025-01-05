import {StyleSheet, View} from 'react-native';
import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useAppSelector} from '../redux/hooks/redux-hooks';
import {MapPinSvg} from '../assets';

export const MapScreen = ({route}) => {
  const {params} = route;

  const networkData = useAppSelector(state => state.storeddata.wifi);
  const bluetothData = useAppSelector(state => state.storeddata.bl);

  const isWifi = params.loc === 'wifi';

  const initialWifi =
    networkData.length > 0
      ? networkData[0].location
      : {latitude: 50.4501, longitude: 30.5234};

  const initialBl =
    bluetothData.length > 0
      ? bluetothData[0].location
      : {latitude: 50.4501, longitude: 30.5234};

  const initial = isWifi ? initialWifi : initialBl;

  const locationData = isWifi ? networkData : bluetothData;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        zoomEnabled
        showsUserLocation={true}
        zoomControlEnabled
        showsMyLocationButton={true}
        initialRegion={{
          ...initial,
          latitudeDelta: 1.0922,
          longitudeDelta: 1.0421,
        }}
        region={{
          latitude: 50.4501,
          longitude: 30.5234,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {locationData.map((network, index) => {
          console.log('network', network);
          const hasValidLocation =
            network?.location?.latitude && network?.location?.longitude;

          return hasValidLocation ? (
            <Marker
              key={index}
              coordinate={{
                latitude: network.location.latitude,
                longitude: network.location.longitude,
              }}
              title={isWifi ? network.SSID : network?.id}
              description={`Signal Strength: ${
                isWifi ? network.level : network?.rssi
              }`}>
              <MapPinSvg />
            </Marker>
          ) : null;
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    backgroundColor: 'rgba(209, 40, 161, 0.5))',
    padding: 5,
    borderRadius: 5,
    zIndex: 100,
  },
  markerText: {
    color: '#000',
    fontSize: 12,
  },
});
