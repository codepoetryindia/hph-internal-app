import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Text from '../../Components/common/Text';
import Theme from '../../Components/common/Theme';
import {GlobalFontSize} from '../../Components/common/CustomText';

import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import GlobalButton from '../../Components/common/GlobalButton/GlobalButton';
import {useState, useContext, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {PutMethod, GetRawurl} from '../../../Utils/Utils';
import AuthContext from '../../Context/AuthContext';
import {StackActions} from '@react-navigation/native';

const ChangePassword = ({navigation, route}) => {
  const Cancel = route?.params?.Cancel;
  const [loader, setLoader] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [massage, setMassage] = useState('');
  const [error, setError] = useState('');
  const [errorMassage, setErrorMassage] = useState(false);
  const {appState, authContext} = useContext(AuthContext);
  const token = appState.token;
  let UserData = appState.data;
  let verificationStatus = appState.status;

  const ChangePasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, 'Password must contain at least 8 characters')
      .required('Please enter your password')
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'One uppercase, one number and one special case character',
      ),

    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword'), null], "Passwords don't match."),
  });

  const handleSubmit = values => {
    setLoader(true);
    let data = {
      password: values.confirmPassword,
    };

    PutMethod('api/v1/password', data, token)
      .then(Response => {
        setLoader(false);
        if (Response.success === true) {
          setMassage(Response.message);
          setSuccessModal(true);
        } else {
          // alert('please try again');
          setError(Response.message);
          setErrorMassage(true);
        }
      })
      .catch(error => {
        setLoader(false);
        setError(error.message);
        setErrorMassage(true);
      });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Theme.backgroundColor}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: Theme.white,
        }}>
        <Image
          source={require('../../Assets/Images/AppLogo.png')}
          style={styles.appLogoStyle}
          resizeMode="contain"
        />
        <Text
          style={{
            color: Theme.secondary,
            fontSize: GlobalFontSize.H2,
            fontWeight: '700',
            marginLeft: -90,
          }}></Text>
        <View>
          <Text></Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: Theme.primary,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          Bold
          style={{
            fontSize: 16,
            paddingHorizontal: 10,
            color: '#fff',
          }}>
          Change password
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(StackActions.replace('TabNav'));
          }}
          Bold
          style={{
            fontSize: 16,
            paddingHorizontal: 10,
            color: '#fff',
          }}>
          <Text
            Bold
            style={{
              fontSize: 16,
              paddingHorizontal: 10,
              color: '#fff',
            }}>
            {Cancel ? 'Cancel' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>

      {loader == true ? (
        <View style={styles.LoadarView}>
          <ActivityIndicator size={'large'} color={Theme.secondary} />
        </View>
      ) : (
        <ScrollView>
          <View style={{alignItems: 'center', marginTop: 60}}>
            <Image
              source={require('../../Assets/Images/unlock.png')}
              style={styles.WaitingImage}
              resizeMode="contain"
            />

            <Formik
              validationSchema={ChangePasswordSchema}
              initialValues={{
                newPassword: '',
                confirmPassword: '',
              }}
              onSubmit={values => {
                handleSubmit(values);
                // if (values) {
                //   setSuccessModal(true);
                // }
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <>
                  <>
                    <Modal transparent={true} visible={successModal}>
                      <Pressable
                        onPress={() => {
                          setSuccessModal(false);
                        }}
                        style={{
                          backgroundColor: '#000000aa',
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#fff',
                            padding: 30,
                            borderRadius: 15,
                            width: '90%',
                            // height: '43%',
                            // justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}>
                          {/* <View style={{ flexDirection: 'row', marginBottom: 15 }}> */}

                          <Image
                            source={require('../../Assets/Images/successicon.png')}
                          />

                          <View style={{marginTop: 10}}>
                            <Text
                              Bold
                              style={{
                                color: Theme.black,
                                opacity: 0.5,
                                fontSize: 18,
                                textAlign: 'center',
                              }}>
                              {/* Profile updated successfully!
                               */}
                              {massage}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 11,
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.dispatch(
                                  StackActions.replace('TabNav'),
                                );
                                // setSuccessModal(false);
                              }}
                              style={{}}>
                              <View
                                style={[
                                  {
                                    backgroundColor: Theme.secondary,
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 25,
                                    marginTop: 10,
                                    marginHorizontal: 20,
                                    borderRadius: 10,
                                    width: 120,
                                    height: 55,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  },
                                ]}>
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    Bold
                                    style={{
                                      color: Theme.white,
                                      fontSize: 16,
                                    }}>
                                    OK
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                          {/* </View> */}
                        </View>
                      </Pressable>
                    </Modal>

                    <View style={{marginTop: 30, paddingHorizontal: 15}}>
                      <View
                        style={[
                          styles.textInput,
                          {flexDirection: 'row', alignItems: 'center'},
                        ]}>
                        <TextInput
                          style={styles.textinputstyle}
                          placeholder="New password"
                          placeholderTextColor={Theme.lightgray}
                          onChangeText={handleChange('newPassword')}
                          onBlur={handleBlur('newPassword')}
                          value={values.newPassword}
                        />
                      </View>
                      {errors.newPassword && touched.newPassword && (
                        <View style={styles.errorstyle}>
                          <Text
                            style={{
                              fontSize: GlobalFontSize.Error,
                              color: 'red',
                            }}>
                            {errors.newPassword}
                          </Text>
                        </View>
                      )}

                      <View
                        style={[
                          styles.textInput,
                          {flexDirection: 'row', alignItems: 'center'},
                        ]}>
                        <TextInput
                          style={styles.textinputstyle}
                          placeholder="Confirm password"
                          placeholderTextColor={Theme.lightgray}
                          onChangeText={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          value={values.confirmPassword}
                        />
                      </View>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <View style={styles.errorstyle}>
                          <Text
                            style={{
                              fontSize: GlobalFontSize.Error,
                              color: 'red',
                            }}>
                            {errors.confirmPassword}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={{marginHorizontal: 20}}>
                      <GlobalButton
                        title={'Save'}
                        inlineStyle={{margin: 20}}
                        onPress={() => handleSubmit()}
                      />
                    </View>
                  </>
                </>
              )}
            </Formik>
          </View>
          <Modal transparent={true} visible={errorMassage}>
            <Pressable
              onPress={() => {
                setErrorMassage(false);
              }}
              style={{
                backgroundColor: '#000000aa',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 30,
                  borderRadius: 15,
                  width: '90%',
                  height: '43%',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                {/* <View style={{ flexDirection: 'row', marginBottom: 15 }}> */}

                <Image
                  source={require('../../Assets/Images/errorimage.jpg')}
                  style={{width: 150, height: 150}}
                />

                <View style={{marginTop: 10}}>
                  <Text
                    Bold
                    style={{
                      color: Theme.black,
                      opacity: 0.5,
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                    {error}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 11,
                  }}>
                  <TouchableOpacity
                    // onPress={() => {
                    //   navigation.navigate('Homepage',{refress:"refress"});
                    // }}
                    style={{}}>
                    <TouchableOpacity
                      onPress={() => {
                        setErrorMassage(false);
                      }}
                      style={[
                        {
                          backgroundColor: Theme.secondary,
                          justifyContent: 'space-between',
                          paddingHorizontal: 25,
                          marginTop: 10,
                          marginHorizontal: 20,
                          borderRadius: 10,
                          width: 120,
                          height: 55,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}>
                      <View>
                        <Text
                          Bold
                          style={{
                            color: Theme.white,
                            fontSize: 16,
                          }}>
                          OK
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
                {/* </View> */}
              </View>
            </Pressable>
          </Modal>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appLogoStyle: {
    width: 100,
    height: 30,
    // backgroundColor:"red"
  },
  WaitingImage: {
    width: 150,
    height: 150,
  },

  LoadarView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.white,
  },

  textInput: {
    backgroundColor: Theme.white,
    marginBottom: 15,
    paddingHorizontal: 15,
    padding: 7,
    width: '100%',
    // alignSelf: 'center',
    borderRadius: 10,
    shadowColor: Theme.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },

  errorstyle: {
    width: '97%',
    paddingHorizontal: 5,
    paddingBottom: 10,
  },

  textinputstyle: {
    color: Theme.lightgray,
    fontWeight: '600',
    fontSize: 16,
    width: '100%',
  },
});

export default ChangePassword;
