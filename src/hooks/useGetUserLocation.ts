import {useEffect, useState} from 'react';
import GetLocation from 'react-native-get-location';

const useGetUserLocation = (permissionGranted: boolean) => {
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permissionGranted) return;

    const fetchLocation = async () => {
      setLoading(true); // Reset loading state when refetching
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
        });
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      } catch (error) {
        console.error(error);
        setUserLocation({
          latitude: 50.44151138023848,
          longitude: 30.4996872396613,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [permissionGranted]);

  return {userLocation, loading};
};

export default useGetUserLocation;
