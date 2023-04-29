import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
// import { Fonts } from './Src/Components/CustomText';
// import MainNav from './Src/Navigations/Route';
// import { Provider } from 'react-redux';
// import { mystore } from './Src/Redux/Store/Store';
import AppNavContainer from './src/Navigations';
import {Text, View} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Theme from './src/Components/common/Theme';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import PushNotification from 'react-native-push-notification';


const App = ({navigation}) => {
  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  useEffect(() => {
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('A new FCM message arrived!', JSON.stringify(remoteMessage))
    //   Alert.alert(remoteMessage?.notification?.title, remoteMessage?.notification?.body);
     
    // });

    return unsubscribe;
  }, []);

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
