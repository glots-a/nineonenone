import {createSlice, nanoid} from '@reduxjs/toolkit';
import {Code} from '../types/Code';
import {WifiNetwork} from '../types/WIFI';
import {getMostFrequent} from '../helpers/getTheMostFrequentValue';
import {Peripheral} from '../types/BlTypes';

type State = {
  codes: Code[] | null;
  wifi: WifiNetwork[];
  bl: Peripheral[];
};

const initialState: State = {
  codes: null,
  wifi: [],
  bl: [],
};

const dataSlice = createSlice({
  name: 'storeddata',
  initialState,
  reducers: {
    addNewCode: (store, action) => {
      const mostFrequent = getMostFrequent(action.payload);

      if (mostFrequent) {
        if (Array.isArray(store.codes)) {
          const {type, value} = mostFrequent;

          const isDuplicate = store.codes.some(item => item.value === value);

          if (!isDuplicate) {
            const id = nanoid();
            store.codes = [{id, type, value}, ...store.codes];
          }
        } else {
          const id = nanoid();
          store.codes = [{...mostFrequent, id}];
        }
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

    addBlNetwork: (store, action) => {
      const peripherals = action.payload.peripherals;

      const uniquePeripherals = peripherals.filter(
        (newPeripheral: any) =>
          !store.bl.some(
            existingPeripheral => existingPeripheral.id === newPeripheral.id,
          ),
      );
      store.bl = [...store.bl, ...uniquePeripherals];
    },

    clearList: (store, action) => {
      const clearActions: Record<string, () => void> = {
        qr: () => (store.codes = null),
        wifi: () => (store.wifi = []),
        bl: () => (store.bl = []),
      };

      clearActions[action.payload]();
    },
  },
});

export default dataSlice.reducer;
export const {addNewCode, addNewNetwork, clearList, addBlNetwork} =
  dataSlice.actions;
