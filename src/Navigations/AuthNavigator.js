import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signin from './../Screens/AuthPage/Signin'
import ForgotPassword from './../Screens/AuthPage/ForgotPassword'

const AuthNavigator = () => {
    const AuthStack = createStackNavigator()
  return (    
      <AuthStack.Navigator initialRouteName="Signin" screenOptions={{headerShown:false}}>
       <AuthStack.Screen name="Signin" component={Signin}/>
       <AuthStack.Screen name="ForgotPassword" component={ForgotPassword}/>
      </AuthStack.Navigator>
  );
};

export default AuthNavigator;
