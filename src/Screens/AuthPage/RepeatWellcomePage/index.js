import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import GlobalButton from '../../../Components/common/GlobalButton/GlobalButton';
import Theme from '../../../Components/common/Theme';
import Text from '../../../Components/common/Text';
import { StackActions } from '@react-navigation/native';

const RepeatWellcomePage = ({navigation, route}) => {
  const [loader] = useState(false);

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
            source={require('../../../Assets/Images/wellcomeimage.png')}
            style={styles.imageStyle}
            resizeMode="contain"
          />

          <View style={styles.textView}>
            <Text style={styles.WellcomeText}>Welcome Back !</Text>
            <Text style={styles.Paragraph}>
              HPH Management
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <GlobalButton
              title={'Continue '}
              inlineStyle={styles.Button}
              onPress={() => {
                navigation.dispatch(
                  StackActions.replace('TabNav')
                );
              }}
            />
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
  buttonContainer: {
    marginLeft: 20,
    marginRight: 20,
  }
});

export default RepeatWellcomePage;

{
  /*  */
}
