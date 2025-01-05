type UserLocation = {
  latitude?: number;
  longitude?: number;
};

type AdvertisingData = {
  isConnectable?: boolean;
  manufacturerData?: Record<string, any>;
  serviceData?: Record<string, any>;
  serviceUUIDs?: string[];
  txPowerLevel?: number;
};

export type Peripheral = {
  advertising?: AdvertisingData;
  id?: string;
  name?: string | null;
  rssi?: number;
  location?: UserLocation;
};
