export interface WifiNetwork {
  BSSID?: string;
  SSID?: string;
  capabilities?: string;
  frequency?: number;
  level?: number;
  timestamp?: number;
  location?: Location;
}

export interface Location {
  latitude: number;
  longitude: number;
}
