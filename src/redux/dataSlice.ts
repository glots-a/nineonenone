import {createSlice, nanoid} from '@reduxjs/toolkit';
import {Code} from '../types/Code';
import {WifiNetwork} from '../types/WIFI';

type State = {
  codes: Code[] | null;
  wifi: WifiNetwork[];
};

const initialState: State = {
  codes: null,
  wifi: [],
};

const dataSlice = createSlice({
  name: 'storeddata',
  initialState,
  reducers: {
    addNewCode: (store, action) => {
      if (Array.isArray(store.codes)) {
        const {type, value} = action.payload;

        const isDuplicate = store.codes.some(item => item.value === value);

        if (!isDuplicate) {
          const id = nanoid();
          store.codes = [{id, type, value}, ...store.codes];
        }
      } else {
        const id = nanoid();
        store.codes = [{...action.payload, id}];
      }
    },
    addNewNetwork: (store, action) => {
      const {networks, location} = action.payload;
      networks.forEach((network: WifiNetwork) => {
        const BSSID = network?.BSSID;
        const SSID = network?.SSID;
        const capabilities = network?.capabilities;
        const frequency = network?.frequency;
        const level = network?.level;
        const timestamp = network?.timestamp;

        // Check if the network already exists in the list based on BSSID
        const isDuplicate = store.wifi.some(item => item?.BSSID === BSSID);

        if (!isDuplicate) {
          store.wifi = [
            {BSSID, SSID, capabilities, frequency, level, timestamp, location},
            ...store.wifi,
          ];
        }
      });
    },
  },
});

export default dataSlice.reducer;
export const {addNewCode, addNewNetwork} = dataSlice.actions;
