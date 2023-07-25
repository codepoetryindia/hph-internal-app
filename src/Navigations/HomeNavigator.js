import React, {useContext, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import TabNav from './TabNav';
import ReferralDoctor from '../Screens/ReferralDoctor';
import EditProfile from '../Screens/EditProfile';
import AuthContext from '../Context/AuthContext';
import ChangePassword from '../Screens/ChangePassword';
import RepeatWellcomePage from './../Screens/AuthPage/RepeatWellcomePage';
import LogoutPage from '../Screens/AuthPage/LogoutPage';

const HomeNavigator = () => {
  const HomeStack = createStackNavigator();
  const {appState} = useContext(AuthContext);

  return (
    <HomeStack.Navigator
      initialRouteName={appState.status ? 'ChangePassword' : 'RepeatWellcomePage'}
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="RepeatWellcomePage" component={RepeatWellcomePage} />
      <HomeStack.Screen name="TabNav" component={TabNav} />
      <HomeStack.Screen name="ReferralDoctor" component={ReferralDoctor} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen name="ChangePassword" component={ChangePassword} />
      <HomeStack.Screen name="LogoutPage" component={LogoutPage}/>
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
