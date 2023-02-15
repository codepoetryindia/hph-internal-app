import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signin from './../Screens/AuthPage/Signin'





const AuthNavigator = () => {
    const AuthStack = createStackNavigator()
  return (    
      <AuthStack.Navigator initialRouteName="Signin" screenOptions={{headerShown:false}}>
       <AuthStack.Screen name="Signin" component={Signin}/>
                  
       {/* <AuthStack.Screen name="Wellcomepage" component={Wellcomepage}/>              */}
      </AuthStack.Navigator>
    
  );
};

export default AuthNavigator;
