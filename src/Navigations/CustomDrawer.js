import React, {useContext} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Text,
} from 'react-native';

// import SignIn from '../Auth/SignIn';

function CustomDrawer(props) {
  const {navigation} = props;
  return (
    <DrawerContentScrollView style={{backgroundColor: '#ffffff'}} {...props}>
      <View style={styles.container}>
        <DrawerItem
          label="Sign In"
          onPress={() => navigation.navigate('Login')}
          //   icon={({color, size}) => (
          //     // <Icon name="calendar" color={'black'} size={size} />
          //     <Image
          //       source={require('../assets/Images/home/share.png')}
          //       style={styles.icon}
          //     />
          //   )}
          labelStyle={{color: '#aeaeae'}}
          //   style={{borderBottomWidth: 0.5, borderBottomColor: GlobalColor.PrimaryLight}}
        />

        {/* <DrawerItem
                    label="T&C"
                    onPress={() => navigation.navigate('TermsOfUse')}
                    //   icon={({color, size}) => (
                    //     // <Icon name="calendar" color={'black'} size={size} />
                    //     <Image
                    //       source={require('../assets/Images/home/share.png')}
                    //       style={styles.icon}
                    //     />
                    //   )}
                    labelStyle={{ color: "#aeaeae" }}
                //   style={{borderBottomWidth: 0.5, borderBottomColor: GlobalColor.PrimaryLight}}
                /> */}
        {/* <DrawerItem
                    label="Privacy Policy"
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                    //   icon={({color, size}) => (
                    //     // <Icon name="calendar" color={'black'} size={size} />
                    //     <Image
                    //       source={require('../assets/Images/home/share.png')}
                    //       style={styles.icon}
                    //     />
                    //   )}
                    labelStyle={{ color: "#aeaeae" }}
                //   style={{borderBottomWidth: 0.5, borderBottomColor: GlobalColor.PrimaryLight}}
                /> */}

        {/*           
            <DrawerItem
              label="Logout"
            //   onPress={() => {
            //     LogOutAlertOccurred('Warning', 'Are You Sure?', 'yes', 'No');
            //   }}
              icon={({color, size}) => (
                // <Icon name="calendar" color={'black'} size={size} />
                // <Image
                //   source={require('../assets/Images/home/power-off.png')}
                //   style={styles.icon}
                // />
                <Text>jhgsj</Text>
              )}
            //   labelStyle={{ fontSize:GlobalFontSize.Small, color:GlobalColor.Primary, fontFamily:'Roboto'}}
            //   style={{borderBottomWidth: 1, borderBottomColor: GlobalColor.PrimaryLight}}
            /> */}
      </View>
    </DrawerContentScrollView>
  );
}
const styles = StyleSheet.create({
  avtar: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  textTitle: {
    fontSize: 10,
    color: '#fff',
    letterSpacing: 1,
    flexShrink: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    maxWidth: '100%',
    // height: '85%',

    // marginBottom:10
  },
  hr: {
    borderTopWidth: 0.5,
    marginVertical: 10,
    borderColor: '#aeaeae',
  },
});
export default CustomDrawer;
