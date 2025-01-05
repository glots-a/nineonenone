import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useAppSelector} from '../redux/hooks/redux-hooks';

export const MapScreen = () => {
  const networkData = useAppSelector(state => state.storeddata.wifi);

  const initial =
    networkData.length > 0
      ? networkData[0].location
      : {latitude: 50.4501, longitude: 30.5234};

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
        {networkData.map((network, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: network.location.latitude,
              longitude: network.location.longitude,
            }}
            title={network.SSID}
            description={`Signal Strength: ${network.level}`}>
            <View style={styles.marker}>
              <Text style={styles.markerText}>{network.SSID}</Text>
            </View>
          </Marker>
        ))}
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
  },
  markerText: {
    color: '#000',
    fontSize: 12,
  },
});
