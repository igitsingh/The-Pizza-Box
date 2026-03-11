import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <AppNavigator />
    </>
  );
};

export default App;
