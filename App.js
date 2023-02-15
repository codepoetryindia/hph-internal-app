import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
// import { Fonts } from './Src/Components/CustomText';
// import MainNav from './Src/Navigations/Route';
// import { Provider } from 'react-redux';
// import { mystore } from './Src/Redux/Store/Store';
import AppNavContainer from './src/Navigations';
import { Text, View } from 'react-native';
import RNBootSplash from "react-native-bootsplash";
import Theme from './src/Components/common/Theme';

const App = ({navigation}) => {
  useEffect(()=>{
    RNBootSplash.hide();
  },[])
  return (
    <>
      <StatusBar
      // backgroundColor={Theme.white} 
      />
      <AppNavContainer />
    </>
  );
};

export default App;
