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
import React, {useState, useContext} from 'react';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import GlobalButton from '../../../Components/common/GlobalButton/GlobalButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Fonts, GlobalFontSize} from '../../../Components/common/CustomText';
import Theme from '../../../Components/common/Theme';
import Text from '../../../Components/common/Text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {AuthContext} from '../../../AuthContext/Context';
import {PostMethod} from '../../../../Utils/Utils';
import AuthContext from '../../../Context/AuthContext';

const SignIn = ({navigation}) => {
  // const {signIn} = React.useContext(AuthContext);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [signin, setSignin] = useState(true);
  const [errorMassage, setErrorMassage] = useState(false);
  const [error, setError] = useState('');
  const [hidePass, setHidePass] = useState(true);

  // const phoneRegExp =
  //  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const SignInSchema = Yup.object().shape({
    userName: Yup.string().required('User name is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = values => {
    console.log('first value', values);
    setLoader(true);
    let data = {
      email: values.userName,
      password: values.password,
    };
    // console.log('data', data);
    PostMethod('api/v1/session', data)
      .then(Response => {
        console.log('Send Otp', Response.data);
        setLoader(false);
        if (Response.success === true) {
          authContext.signIn({
            // data: Response.data,
            token: Response.data?.token?.access_token,
            user: Response.data?.user,
            status: Response.data?.user?.first_login,
          });
        } else {
          console.log('Response.message', Response.message);
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
                  Sign In
                </Text>
                {/* Input */}
                <Formik
                  validationSchema={SignInSchema}
                  initialValues={{
                    userName: 'subrataofficial059@gmail.com',
                    password: 'password',
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

                      <View
                        style={[
                          styles.textInput,
                          {flexDirection: 'row', alignItems: 'center'},
                        ]}>
                        <Ionicons
                          style={styles.searchIcon}
                          name="lock-closed-outline"
                          color={Theme.gray}
                          size={25}
                        />

                        <TextInput
                          style={styles.InputStyle}
                          placeholder="Password"
                          placeholderTextColor={Theme.lightgray}
                          secureTextEntry={hidePass ? true : false}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={values.password}
                        />
                        <Ionicons
                          style={[styles.searchIcon]}
                          name={hidePass ? 'eye-off-outline' : 'eye-outline'}
                          color={Theme.gray}
                          size={25}
                          onPress={() => setHidePass(!hidePass)}
                        />
                      </View>

                      {errors.password && touched.password && (
                        <View style={styles.errorView}>
                          <Text
                            style={{
                              fontSize: GlobalFontSize.Error,
                              color: Theme.Error,
                            }}>
                            {errors.password}
                          </Text>
                        </View>
                      )}
                      <GlobalButton
                        title={'Sign In '}
                        inlineStyle={{margin: 20, marginTop: 20}}
                        onPress={() => handleSubmit()}
                      />
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
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
              // height: '43%',
              // justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            {/* <View style={{ flexDirection: 'row', marginBottom: 15 }}> */}

            <Image
              source={require('../../../Assets/Images/errorimage.jpg')}
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
                onPress={() => {
                  setErrorMassage(false);
                }}
                // onPress={() => {
                //   navigation.navigate('Homepage',{refress:"refress"});
                // }}
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
                  <TouchableOpacity
                    onPress={() => {
                      setErrorMassage(false);
                    }}
                    style={{flexDirection: 'row'}}>
                    <Text
                      Bold
                      style={{
                        color: Theme.white,
                        fontSize: 16,
                      }}>
                      OK
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
            {/* </View> */}
          </View>
        </Pressable>
      </Modal>
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
    marginTop: 100,
    marginVertical: 40,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignIn;

{
  /*  */
}
