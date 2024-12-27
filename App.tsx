import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import '@react-native-firebase/firestore';

import {persitor, store} from './src/redux/store';
import {RootStack} from './src/navigators';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persitor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <RootStack />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
