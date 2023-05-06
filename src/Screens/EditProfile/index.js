import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import GlobalButton from '../../Components/common/GlobalButton/GlobalButton';
import Theme from '../../Components/common/Theme';
import Text from '../../Components/common/Text';
import NavigationHeaders from '../../Components/common/NavigationHeaders';
import ImagePicker from 'react-native-image-crop-picker';
import {GlobalFontSize} from '../../Components/common/CustomText';
import {PutMethod} from '../../../Utils/Utils';
import AuthContext from '../../Context/AuthContext';
import {phoneNumberAutoFormat, removehoneNumberFormat} from '../../../Utils/phoneNumberAutoFormat';

const EditProfile = ({navigation, route}) => {
  const accountDetails = route?.params?.accountDetails;

  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [massage, setMassage] = useState('');
  const {appState} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [errorMassage, setErrorMassage] = useState(false);

  const SignInSchema = Yup.object().shape({
    firstname: Yup.string().required('First name is required '),
    lastname: Yup.string().required('Last name is required '),

    email: Yup.string().email('Invalid email').required('Email is required'),
    street_address: Yup.string().required('Address is required '),
    city: Yup.string().required('City is required '),
    state: Yup.string().required('State is required '),
    phone2: Yup.string()
        .nullable()
        .notRequired()
        .test('mobileNumber', 'Phone Number 2 is not valid', data => {
          if(data){
            return (removehoneNumberFormat(data).length < 10 ? false : true )
          } else {
            return false;
          }
        }),
    zipcode: Yup.string().required('Zip code is required').min(5, "Zip code should be minimum 5 character").max(5, "Zip code should be maximum 5 character"),
    });

  let token = appState.token;
  useEffect(() => {
    let UserDetails = appState.data;
  }, []);

  const handleSubmit = values => {
    let mobileNumber = removehoneNumberFormat(values.phone2);
    setLoader(true);
    let data = {
      first_name: values.firstname,
      last_name: values.lastname,
      email: values.email,
      alter_phone: Number(mobileNumber),
      address: values.street_address,
      city: values.city,
      state: values.state,
      zip_code: values.zipcode,
      image: image ? `data:${image?.mime};base64,${image?.data}` : null,
    };
    PutMethod('api/v1/my-account', data, token)
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

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      // console.log('fbbsfbsdbbfdb', image);
      setImage(image);
      setModalVisible(false);
    });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      // console.log('image', image);
      setImage(image);
      setModalVisible(false);
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Theme.white}}>
      <Formik
        validationSchema={SignInSchema}
        initialValues={{
          firstname: accountDetails?.first_name
            ? accountDetails?.first_name
            : '',
          lastname: accountDetails?.last_name ? accountDetails?.last_name : '',
          email: accountDetails?.email ? accountDetails?.email : '',

          phone2: accountDetails?.doctor?.alter_phone
            ? accountDetails?.doctor?.alter_phone
            : '',

          street_address: accountDetails?.doctor?.address
            ? accountDetails?.doctor?.address
            : '',
          city: accountDetails?.doctor?.city
            ? accountDetails?.doctor?.city
            : '',
          state: accountDetails?.doctor?.state
            ? accountDetails?.doctor?.state
            : '',
          zipcode: accountDetails?.doctor?.zip_code
            ? accountDetails?.doctor?.zip_code
            : '',
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
            {loader == true ? (
              <View style={styles.LoadarView}>
                <ActivityIndicator size={'large'} color={Theme.secondary} />
              </View>
            ) : (
              <>
                <View>
                  <NavigationHeaders
                    onPress={() => {
                      navigation.goBack();
                    }}
                    title="Account"
                  />
                </View>
                <ScrollView>
                  <View
                    style={{
                      // backgroundColor: 'red',
                      marginVertical: 40,
                      // width: '100%',
                      // width: 150,
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      alignSelf: 'center',
                    }}>
                    {accountDetails?.media?.url && !image ? (
                      <Image
                        source={{uri: accountDetails?.media?.url}}
                        style={styles.UploadImage}
                      />
                    ) : image ? (
                      <Image
                        source={{uri: image.path}}
                        style={styles.UploadImage}
                      />
                    ) : (
                      <Image
                        source={require('../../Assets/Images/referrals.png')}
                        style={[styles.ProfileImage]}
                      />
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(true);
                      }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                        backgroundColor: Theme.secondary,
                        padding: 6,
                        borderRadius: 100,
                        borderWidth: 3,
                        borderColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../../Assets/Images/editicon.png')}
                        style={styles.iconStyle}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>

                  <Modal transparent={true} visible={modalVisible}>
                    <Pressable
                      onPress={() => {
                        setModalVisible(false);
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
                          height: '25%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}>
                        <View style={{marginTop: 10}}>
                          <Text
                            Bold
                            style={{
                              color: Theme.black,
                              opacity: 0.5,
                              fontSize: 18,
                              textAlign: 'center',
                            }}>
                            Pick image from gallery/camera
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 30}}>
                          <TouchableOpacity
                            onPress={() => {
                              pickImage();
                            }}
                            style={{}}>
                            <View
                              style={[
                                {
                                  backgroundColor: Theme.secondary,
                                  justifyContent: 'space-between',
                                  paddingHorizontal: 25,
                                  paddingVertical: 15,
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
                                  Gallery
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              openCamera();
                            }}
                            style={{}}>
                            <View
                              style={[
                                {
                                  backgroundColor: Theme.secondary,
                                  justifyContent: 'space-between',
                                  paddingHorizontal: 25,
                                  paddingVertical: 15,
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
                                  Camera
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Pressable>
                  </Modal>

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
                              navigation.navigate('Account');
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

                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        paddingHorizontal: 20,
                        // paddingVertical: 10,
                        // marginTop: 15,
                        fontSize: 20,
                        fontWeight: '700',
                        color: Theme.lightgray,
                      }}>
                      Edit profile
                    </Text>
                  </View>

                  <View style={{marginTop: 30, paddingHorizontal: 15}}>
                    <View
                      style={[
                        styles.textInput,
                        {flexDirection: 'row', alignItems: 'center'},
                      ]}>
                      <TextInput
                        style={styles.textinputstyle}
                        placeholder="First Name"
                        placeholderTextColor={Theme.lightgray}
                        onChangeText={handleChange('firstname')}
                        onBlur={handleBlur('firstname')}
                        value={values.firstname}
                      />
                    </View>
                    {errors.firstname && touched.firstname && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.firstname}
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
                        placeholder="Last Name"
                        placeholderTextColor={Theme.lightgray}
                        onChangeText={handleChange('lastname')}
                        onBlur={handleBlur('lastname')}
                        value={values.lastname}
                      />
                    </View>
                    {errors.lastname && touched.lastname && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.lastname}
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
                        placeholder="Email"
                        placeholderTextColor={Theme.lightgray}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                      />
                    </View>
                    {errors.email && touched.email && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.email}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      backgroundColor: Theme.primary,
                      width: '100%',
                      height: 40,
                      // marginTop: 10,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginBottom: 10,
                    }}>
                    <Text
                      Bold
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        // marginTop: 15,
                        fontWeight: '500',
                        color: '#fff',
                      }}>
                      Office Information
                    </Text>
                  </View>
                  <View style={{paddingHorizontal: 15}}>
                    {/* <View
                      style={[
                        styles.textInput,
                        {flexDirection: 'row', alignItems: 'center'},
                      ]}>
                      <TextInput
                        style={styles.textinputstyle}
                        placeholder="Phone Number"
                        placeholderTextColor={Theme.lightgray}
                        keyboardType="phone-pad"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                      />
                    </View>

                    {errors.phone && touched.phone && (
                      <View style={styles.errorstyle}>
                        <Text style={{fontSize: GlobalFontSize.Error, color: 'red'}}>
                          {errors.phone}
                        </Text>
                      </View>
                    )} */}

                    <View
                      style={[
                        styles.textInput,
                        {flexDirection: 'row', alignItems: 'center'},
                      ]}>
                      <TextInput
                        style={styles.textinputstyle}
                        placeholder="Phone Number 2 (Optional)"
                        placeholderTextColor={Theme.lightgray}
                        keyboardType="phone-pad"
                        maxLength={12}
                        onChangeText={handleChange('phone2')}
                        onBlur={handleBlur('phone2')}
                        value={phoneNumberAutoFormat(values.phone2)}
                      />
                    </View>
                    {errors.phone2 && touched.phone2 && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.phone2}
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
                        placeholder="Street Address"
                        placeholderTextColor={Theme.lightgray}
                        onChangeText={handleChange('street_address')}
                        onBlur={handleBlur('street_address')}
                        value={values.street_address}
                      />
                    </View>

                    {errors.street_address && touched.street_address && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.street_address}
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
                        placeholder="City"
                        placeholderTextColor={Theme.lightgray}
                        onChangeText={handleChange('city')}
                        onBlur={handleBlur('city')}
                        value={values.city}
                      />
                    </View>

                    {errors.city && touched.city && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.city}
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
                        placeholder="State"
                        placeholderTextColor={Theme.lightgray}
                        onChangeText={handleChange('state')}
                        onBlur={handleBlur('state')}
                        value={values.state}
                      />
                    </View>

                    {errors.state && touched.state && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.state}
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
                        placeholder="Zip Code"
                        placeholderTextColor={Theme.lightgray}
                        keyboardType="numeric"
                        maxLength={5}
                        onChangeText={handleChange('zipcode')}
                        onBlur={handleBlur('zipcode')}
                        value={values.zipcode}
                      />
                    </View>

                    {errors.zipcode && touched.zipcode && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.zipcode}
                        </Text>
                      </View>
                    )}

                    {/* <View
                      style={[
                        styles.textInput,
                        {flexDirection: 'row', alignItems: 'center'},
                      ]}>
                      <TextInput
                        style={styles.textinputstyle}
                        placeholder="Email (Optional)"
                        placeholderTextColor={Theme.lightgray}
                        onChangeText={handleChange('emailoptional')}
                        onBlur={handleBlur('emailoptional')}
                        value={values.emailoptional}
                      />
                    </View>
                    {errors.emailoptional && touched.emailoptional && (
                      <View style={styles.errorstyle}>
                        <Text
                          style={{
                            fontSize: GlobalFontSize.Error,
                            color: 'red',
                          }}>
                          {errors.emailoptional}
                        </Text>
                      </View>
                    )} */}
                  </View>
                </ScrollView>
                <View style={{marginHorizontal: 20}}>
                  <GlobalButton
                    title={'Save'}
                    inlineStyle={{margin: 20}}
                    onPress={() => handleSubmit()}
                  />
                </View>
              </>
            )}
          </>
        )}
      </Formik>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appLogoStyle: {
    width: 100,
    height: 30,
    // backgroundColor:"red"
  },
  LoadarView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.white,
  },
  WaitingImage: {
    width: 350,
    height: 310,
  },
  ProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    resizeMode: 'contain',
    position: 'relative',
    borderRadius: 100,
  },
  iconStyle: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    position: 'relative',
  },
  textInput: {
    backgroundColor: Theme.white,
    marginBottom: 15,
    paddingHorizontal: 15,
    padding: 7,
    width: '100%',
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
    alignSelf: 'center',
    paddingBottom: 10,
  },

  textinputstyle: {
    color: Theme.lightgray,
    fontWeight: '600',
    fontSize: GlobalFontSize.P,
    width: '100%',
  },
  UploadImage: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    resizeMode: 'cover',
    position: 'relative',
    borderRadius: 100,
  },
});

export default EditProfile;

{
  /*  */
}
