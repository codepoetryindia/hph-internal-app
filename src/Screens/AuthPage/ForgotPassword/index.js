import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import GlobalButton from '../../../Components/common/GlobalButton/GlobalButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GlobalFontSize} from '../../../Components/common/CustomText';
import Theme from '../../../Components/common/Theme';
import Text from '../../../Components/common/Text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {PostMethod} from '../../../../Utils/Utils';
import Toast from 'react-native-simple-toast';

const ForgotPassword = ({navigation}) => {
  const [loader, setLoader] = useState(false);

  const SignInSchema = Yup.object().shape({
    userName: Yup.string().required('User name is required'),
  });

  const showToast = (message) => {
    Toast.showWithGravity(message, Toast.LONG, Toast.TOP, { backgroundColor: 'blue' });
  }

  const handleLogin = values => {
    setLoader(true);
    let data = {
      email: values.userName,
    };
    PostMethod('api/v1/send/reset/email', data)
      .then(Response => {
        setLoader(false);
        showToast(Response.message);
        navigation.navigate('Signin');
      })
      .catch(error => {
        showToast(error.message);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Theme.white}}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          {loader == true ? (
            <View style={styles.LoadarView}>
              <ActivityIndicator size={'large'} color={Theme.secondary} />
            </View>
          ) : (
            <View style={styles.container}>
              <View style={styles.appLogoStyleContainer}>
                <Image
                  source={require('../../../Assets/Images/AppLogo.png')}
                  style={styles.appLogoStyle}
                  resizeMode="contain"
                />
              </View>

              {/* SignIn Text */}

              <View style={styles.bluebackground}>
                <Text Bold style={[styles.HeadingText]}>
                  Forgot Password
                </Text>
                {/* Input */}
                <Formik
                  validationSchema={SignInSchema}
                  initialValues={{
                    userName: '',
                  }}
                  onSubmit={values => {
                    handleLogin(values);
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
                    <View style={{paddingHorizontal: 20, marginBottom: 50}}>
                      <View
                        style={[
                          styles.textInput,
                          {flexDirection: 'row', alignItems: 'center'},
                        ]}>
                        <Ionicons
                          style={styles.searchIcon}
                          name="person-circle-outline"
                          color={Theme.gray}
                          size={25}
                        />
                        <TextInput
                          style={styles.InputStyle}
                          placeholder="User name"
                          placeholderTextColor={Theme.lightgray}
                          // keyboardType="phone-pad"
                          onChangeText={handleChange('userName')}
                          onBlur={handleBlur('userName')}
                          value={values.userName}
                        />
                      </View>
                      {errors.userName && touched.userName && (
                        <View style={styles.errorView}>
                          <Text
                            style={{
                              fontSize: GlobalFontSize.Error,
                              color: Theme.Error,
                            }}>
                            {errors.userName}
                          </Text>
                        </View>
                      )}

                      <GlobalButton
                        title={'Forgot Password'}
                        inlineStyle={{margin: 20, marginTop: 20}}
                        onPress={() => handleSubmit()}
                      />

                      <View style={styles.BottomPart}>
                        <Text style={styles.bottomContent}>
                          If you want to Sign In ?
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('Signin');
                          }}>
                          <Text
                            style={[
                              styles.bottomContent,
                              {color: Theme.primary},
                            ]}>
                            {' '}
                            Sign In
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    backgroundColor: Theme.white,
    marginTop: 30,
    color: Theme.black,
    paddingHorizontal: 7,
    paddingVertical: 7,

    width: '100%',
    alignSelf: 'center',
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
  appLogoStyleContainer: {
    flex: 1,
    minHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appLogoStyle: {
    width: 290,
    height: 200,
    resizeMode: 'contain',
    // top: 70,
  },
  searchIcon: {
    paddingHorizontal: 7,
    opacity: 0.5,
  },
  LoadarView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.white,
  },
  bluebackground: {
    backgroundColor: Theme.secondary,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    width: '100%',
    flex: 1,
  },
  HeadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: GlobalFontSize.H1,
    color: Theme.white,
    // fontFamily:"OpenSans-SemiBold"
  },
  InputStyle: {
    color: Theme.gray,
    fontWeight: '600',
    fontSize: GlobalFontSize.InputText,
    width: '75%',
    fontFamily: 'OpenSans-Regular',
    minHeight: 45,
  },
  errorView: {
    width: '99%',
    alignSelf: 'center',
    paddingTop: 10,
  },
  Paragraph: {
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center',
  },
  bottomContent: {
    color: Theme.white,
    fontSize: GlobalFontSize.P,
  },
  BottomPart: {
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ForgotPassword;
