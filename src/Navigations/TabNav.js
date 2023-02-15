import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from '../Components/common/Text';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Homepage from '../Screens/HomePage';
import Account from '../Screens/Account';
import Theme from '../Components/common/Theme';
import {GlobalFontSize} from '../Components/common/CustomText';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const Tab = createBottomTabNavigator();

export default function TabNav() {
  return (
    <Tab.Navigator
      initialRouteName="Homepage"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          minHeight: 55,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          width: '100%',
          backgroundColor: Theme.white,
          elevation: 0,
          // position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
        },
      }}>
      <Tab.Screen
        name="Homepage"
        component={Homepage}
        options={{
          unmountOnBlur: true,
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({focused, color}) => {
            return (
              <>
                {focused == true ? (
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      paddingVertical: 10,
                      alignItems: 'center',
                      flexDirection: 'column',
                      borderTopLeftRadius: 25,
                      backgroundColor: Theme.primary,
                    }}>
                    <Octicons
                      color={Theme.white}
                      name="arrow-switch"
                      size={RFValue(20)}
                    />
                    <Text
                      style={{
                        fontSize: GlobalFontSize.Error,
                        color: Theme.white,
                      }}>
                      Referrals
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      paddingVertical: 10,
                      alignItems: 'center',
                      flexDirection: 'column',
                      borderTopLeftRadius: 25,
                      backgroundColor: Theme.white,
                    }}>
                    <Octicons name="arrow-switch" size={RFValue(20)} />
                    <Text
                      style={{
                        fontSize: GlobalFontSize.Error,
                        textAlign: 'center',
                      }}>
                      Referrals
                    </Text>
                  </View>
                )}
              </>
            );
          },
        }}
      />

      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          unmountOnBlur: true,
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({focused, color}) => {
            return (
              <>
                {focused == true ? (
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      paddingVertical: 10,
                      alignItems: 'center',
                      flexDirection: 'column',
                      borderTopRightRadius: 25,
                      backgroundColor: Theme.primary,
                    }}>
                    <MaterialCommunityIcons
                      name="account-cog-outline"
                      size={RFValue(20)}
                      color={Theme.white}
                    />
                    <Text
                      style={{
                        fontSize: GlobalFontSize.Error,
                        color: Theme.white,
                        textAlign: 'center',
                      }}>
                      Account
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      paddingVertical: 10,
                      alignItems: 'center',
                      flexDirection: 'column',
                      borderTopRightRadius: 25,
                      backgroundColor: Theme.white,
                    }}>
                    <MaterialCommunityIcons
                      name="account-cog-outline"
                      size={RFValue(20)}
                    />
                    <Text
                      style={{
                        fontSize: GlobalFontSize.Error,
                        textAlign: 'center',
                      }}>
                      Account
                    </Text>
                  </View>
                )}
              </>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
