import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeNavigator from './HomeNavigator';
// import { HOME_NAVIGATOR,LOGIN, REGISTER } from '../Constants/RouteNames';
import CustomDrawer from './CustomDrawer';
import Login from '../Screens/Login';
import Register from '../Screens/Register';

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  return (
    
    //   <Drawer.Navigator screenOptions={{
    //   headerShown: false,
    // }} drawerContent={props => <CustomDrawer {...props} />}>

      <Drawer.Navigator> 
        <Drawer.Screen name="Login" component={HomeNavigator} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Signup" component={Register} />
      </Drawer.Navigator>
    
  );
};

export default DrawerNavigator;
