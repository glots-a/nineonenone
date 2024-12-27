import React from 'react';
import {BarcodeScanner, Wrapper} from '../components';

export const QRScreen = () => {
  return (
    <Wrapper>
      <BarcodeScanner />
    </Wrapper>
  );
};
