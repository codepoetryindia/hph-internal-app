import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNav from './TabNav';
import ReferralDoctor from '../Screens/ReferralDoctor';
import DirectoryDoctor from '../Screens/DirectoryDoctor';
import DirectoryDoctorProfile from '../Screens/DirectoryDoctorProfile';
import ReferToDoctor from '../Screens/ReferToDoctor';
import EditProfile from '../Screens/EditProfile';

const Stack = createNativeStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="TabNav"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabNav" component={TabNav} />
      <Stack.Screen name="ReferralDoctor" component={ReferralDoctor} />
      <Stack.Screen name="DirectoryDoctor" component={DirectoryDoctor} />
      <Stack.Screen name="DirectoryDoctorProfile" component={DirectoryDoctorProfile} />
      <Stack.Screen name="ReferToDoctor" component={ReferToDoctor} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};
export default StackNav;
