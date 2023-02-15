import React, {useContext, useEffect, useState, useReducer} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import {ActivityIndicator} from 'react-native-paper';
import {View} from 'react-native';
import Theme from '../Components/common/Theme';
import AuthContext from '../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppNavContainer = () => {

// Declare Initial State 
const initialState = {
  token: null,
  data: null,
  status: false,
  ifFirstLogin:false, 
  isLoading:true
};

// Create Reducer function 
const LoginUserReducer = (prevState, action) =>{
  switch (action.type) {
    case "RETRIEVE_TOKEN":
          return {
            ...prevState, 
            token:action.payload.token,
            data:action.payload.userdetails,
            status: action.payload.status,
            isLoading:false,
          }
      break;
      case "LOGIN":
        return {
          ...prevState, 
          token:action.payload.token,
          data:action.payload.userdetails,
          status: action.payload.status,
          ifFirstLogin:action.payload.isfirstLogin,
          isLoading:false,
        }
      break;
      case "LOGOUT":
        return {
          ...prevState, 
          token: null,
          data: null,
          isLoading:false,
        }
      break;
      case "UPDATE_STATUS":
        return {
          ...prevState, 
          status: true,
          isLoading:false,
        }
      break;      
    default:
        return{
          ...prevState
        }
      break;
  }
}
// Declare reducer Function
const [appState, dispatch] = useReducer( LoginUserReducer, initialState );


const authContext = React.useMemo(
  () => ({
    signIn: async (data) => {
      try {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        await AsyncStorage.setItem('status', JSON.stringify(data?.status));

        if ((data.token, data.user)) {
          dispatch({ type: 'LOGIN', payload: 
            {
              token:data.token, 
              userdetails:data.user,
              status:data?.status,
              isfirstLogin: data?.isfirstLogin ? data?.isfirstLogin : false
            }
          });
        } 
      } catch (error) {
        console.log('Error Occurred while login', error);
      }
    },

    signOut: async() => {
      
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('status');
      } catch(e) {
        console.log("Unable to sign OUt");
      }      
      dispatch({ type: 'LOGOUT' })
    },
    updateStatus: () => dispatch({ type: 'UPDATE_STATUS' }),
    signUp: async (data) => {     
      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
  }),
  []
);


React.useEffect(() => {
  // Fetch the token from storage then navigate to our appropriate place
  const bootstrapAsync = async () => {
    let userToken;
    let userData;
    let statusData;
    try {
      userToken = await AsyncStorage.getItem('userToken');
      userData = await AsyncStorage.getItem('userData');
      statusData = await AsyncStorage.getItem('status');
    } catch (e) {
      // Restoring token failed      
    }
    dispatch({ type: 
      'RETRIEVE_TOKEN',
     payload:{
      token: userToken,
      userdetails: JSON.parse(userData),
      status:JSON.parse(statusData)
    }});
  };

  bootstrapAsync();
}, []);

return (
  <AuthContext.Provider value={{appState, authContext}}>
    <NavigationContainer>

    {
      appState.isLoading ? (
        <View style={{ justifyContent:'center', alignItems:'center', flex:1 }}>
            <ActivityIndicator/>
        </View>
      ):(
        <View style={{ flex:1 }}>
          {appState.token ? <HomeNavigator /> :<AuthNavigator /> }
        </View>
      )
    }
    </NavigationContainer>
  </AuthContext.Provider>
);


};

export default AppNavContainer;


