import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useContext } from 'react';
import GlobalButton from '../../../Components/common/GlobalButton/GlobalButton';
import Theme from '../../../Components/common/Theme';
import Text from '../../../Components/common/Text';
import { StackActions } from '@react-navigation/native';
import AuthContext from '../../../Context/AuthContext';

const LogoutPage = ({navigation, route}) => {
  const [loader] = useState(false);
  const {authContext} = useContext(AuthContext);

  useEffect(
    () => {
      const timer = setTimeout(() => {
        console.log('This will run after 1 second!')
        authContext.signOut();
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    },

    []
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#fff', paddingHorizontal: 20}}>
      {loader == true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <ActivityIndicator size={'large'} color="#fff" />
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            source={require('../../../Assets/Images/AppLogo.png')}
            style={styles.appLogoStyle}
            resizeMode="contain"
          />
          <Image
            source={require('../../../Assets/Images/logout.png')}
            style={styles.imageStyle}
            resizeMode="contain"
          />

          <View style={styles.textView}>
            <Text style={styles.WellcomeText}>Thank you !</Text>
            <Text style={styles.Paragraph}>
              for using  HPH Management
            </Text>
          </View>

        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appLogoStyle: {
    width: 250,
    height: 200,
    alignSelf: 'center',
  },
  imageStyle: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    top: 20,
  },

  WellcomeText: {
    fontSize: 29,
    color: Theme.secondary,
    fontWeight: '800',
    textAlign: 'center',
  },
  Paragraph: {
    fontSize: 14,
    color: Theme.secondary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
  textView: {
    marginTop: 30,
  },
  Button: {
    marginTop: 30,
  },
});

export default LogoutPage;

{
  /*  */
}
