import React, {useContext, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import TabNav from './TabNav';
import ReferralDoctor from '../Screens/ReferralDoctor';
import EditProfile from '../Screens/EditProfile';
import AuthContext from '../Context/AuthContext';
import ChangePassword from '../Screens/ChangePassword';
import {GetRawurl} from '../../Utils/Utils';

const HomeNavigator = () => {
  const HomeStack = createStackNavigator();
  const {appState} = useContext(AuthContext);
  const token = appState.token;
  const [status, setStatus] = useState(false);

  const Verify_status = () => {
    GetRawurl('api/v1/session/first-login', token)
      .then(Response => {
        console.log('Verification Status 100', Response);
        if (Response.success) {
          setStatus(Response.first_login);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    Verify_status();
  }, []);

  return (
    <HomeStack.Navigator
      initialRouteName={status == true ? 'ChangePassword' : 'TabNav'}
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="TabNav" component={TabNav} />
      <HomeStack.Screen name="ReferralDoctor" component={ReferralDoctor} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen name="ChangePassword" component={ChangePassword} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
