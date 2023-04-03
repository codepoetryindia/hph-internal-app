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
  ScrollView,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import GlobalButton from '../../Components/common/GlobalButton/GlobalButton';
import Theme from '../../Components/common/Theme';
import {Fonts, GlobalFontSize} from '../../Components/common/CustomText';
import Text from '../../Components/common/Text';
import AuthContext from '../../Context/AuthContext';
import {GetRawurl} from '../../../Utils/Utils';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../Components/common/Header';

const Account = ({navigation}) => {
  const {authContext} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const {appState} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [errorMassage, setErrorMassage] = useState(false);
  const [userDetails_role, setUserDetails_role] = useState(null);
  let UserData = appState.data;
  let token = appState.token;

  // console.log("accountDetails",accountDetails)

  useFocusEffect(
    React.useCallback(() => {
      const CallAgain = Get_All_Account_Details(token);
      return () => CallAgain;
    }, []),
  );

  const Get_All_Account_Details = token => {
    setLoader(true);
    GetRawurl('api/v1/my-account', token)
      .then(Response => {
        if (Response.data.success) {
          setAccountDetails(Response?.data?.data?.users[0]);
          setLoader(false);
        } else {
          if (
            Response.data.message == 'Unauthorized' &&
            Response.data.error_code == 1101
          ) {
            authContext.signOut();
          } else {
            setError(Response.data.message);
            setErrorMassage(true);
          }
        }
      })
      .catch(error => {
        setLoader(false);
        setError(error.message);
        setErrorMassage(true);
      });
  };

  useEffect(() => {
    let token = appState.token;
    let UserDetails = appState.data;
    setUserDetails_role(UserDetails);
    Get_All_Account_Details(token);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Theme.white}}>
      <Header name="Account" />
      {loader == true ? (
        <View style={styles.LoadarView}>
          <ActivityIndicator size={'large'} color={Theme.secondary} />
        </View>
      ) : (
        <>
          <ScrollView>
            <View style={styles.TopPart}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditProfile', {
                    accountDetails: userDetails_role
                      ? accountDetails
                      : accountDetails.doctor,
                  });
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
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginVertical: 40,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                alignSelf: 'center',
              }}>
              <Image
                source={
                  accountDetails?.media
                    ? {uri: accountDetails?.media?.url}
                    : require('../../Assets/Images/referrals.png')
                }
                style={[styles.ProfileImage]}
              />

              {accountDetails?.status == '1' ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 15,
                    right: 0,
                    // backgroundColor: Theme.secondary,
                    // padding: 6,
                    borderRadius: 100,
                    borderWidth: 3,
                    borderColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../../Assets/Images/check.png')}
                    style={styles.iconStyle}
                    resizeMode="contain"
                  />
                </View>
              ) : null}
            </View>

            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  paddingHorizontal: 20,
                  // paddingVertical: 10,
                  marginTop: -15,
                  fontSize: 20,
                  fontWeight: '700',
                  color: Theme.lightgray,
                }}>
                {accountDetails?.full_name}
              </Text>
            </View>

            <View style={styles.HeadingBackground}>
              <Text Bold style={styles.HeadingText}>
                PRIMARY INFORMATION
              </Text>
            </View>
            <View style={styles.LeftSideText}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  color: Theme.lightgray,
                  fontFamily: 'OpenSans-SemiBold',
                }}>
                First Name
              </Text>
              <Text
                // Bold
                style={styles.RightSideText}>
                {accountDetails?.first_name}
              </Text>
            </View>
            <View style={styles.LeftSideText}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  // marginTop: 15,
                  fontFamily: 'OpenSans-SemiBold',
                  color: Theme.lightgray,
                }}>
                Last Name
              </Text>
              <Text
                // Bold
                style={styles.RightSideText}>
                {accountDetails?.last_name}
              </Text>
            </View>
            <View style={styles.LeftSideText}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  // marginTop: 15,
                  fontFamily: 'OpenSans-SemiBold',
                  color: Theme.lightgray,
                }}>
                Email
              </Text>
              <Text
                // Bold
                style={styles.RightSideText}>
                {accountDetails?.email}
              </Text>
            </View>

            {accountDetails?.doctor?.npi_number ? (
              <View style={styles.LeftSideText}>
                <Text
                  Bold
                  style={{
                    fontSize: GlobalFontSize.H3,

                    // marginTop: 15,
                    fontFamily: 'OpenSans-SemiBold',

                    color: Theme.lightgray,
                  }}>
                  NPI Number
                </Text>
                <Text
                  // Bold
                  style={styles.RightSideText}>
                  {accountDetails?.doctor?.npi_number}
                </Text>
              </View>
            ) : null}

            {accountDetails?.phone ? (
              <View style={styles.LeftSideText}>
                <Text
                  Bold
                  style={{
                    fontSize: GlobalFontSize.H3,
                    color: Theme.lightgray,
                    fontFamily: 'OpenSans-SemiBold',
                  }}>
                  Phone Number
                </Text>
                <Text
                  // Bold
                  style={styles.RightSideText}>
                  {/* 9595958685 */}
                  {accountDetails?.phone}
                </Text>
              </View>
            ) : null}
            {accountDetails?.category_type ? (
              <View style={styles.LeftSideText}>
                <Text
                  Bold
                  style={{
                    fontSize: GlobalFontSize.H3,
                    color: Theme.lightgray,
                    fontFamily: 'OpenSans-SemiBold',
                  }}>
                  Doctor Type
                </Text>
                <Text
                  // Bold
                  style={styles.RightSideText}>
                  {/* 9595958685 */}
                  {accountDetails?.category_type}
                </Text>
              </View>
            ) : null}

            <View style={[styles.LeftSideText, {alignItems: 'center'}]}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  color: Theme.lightgray,
                  fontFamily: 'OpenSans-SemiBold',
                }}>
                Password
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: Theme.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                onPress={() => {
                  navigation.navigate('ChangePassword', {Cancel: 'Cancel'});
                }}>
                <Text
                  // Bold
                  style={[
                    styles.RightSideText,
                    {color: Theme.white, marginLeft: 0},
                  ]}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: Theme.primary,
                width: '100%',
                height: 40,
                // marginTop: 10,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}>
              <Text Bold style={styles.HeadingText}>
                SECONDARY INFORMATION
              </Text>
            </View>

            {/* */}
            <View style={styles.LeftSideText}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  fontFamily: 'OpenSans-SemiBold',
                  color: Theme.lightgray,
                }}>
                Phone Number 2
              </Text>
              <Text
                // Bold
                style={styles.RightSideText}>
                {accountDetails?.doctor?.alter_phone
                  ? accountDetails?.doctor?.alter_phone
                  : null}
              </Text>
            </View>

            {/* {accountDetails?.doctor?.address ? ( */}
            <View style={styles.LeftSideText}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  fontFamily: 'OpenSans-SemiBold',
                  color: Theme.lightgray,
                }}>
                Street
              </Text>

              <Text
                // Bold
                style={styles.RightSideText}>
                {accountDetails?.doctor?.address
                  ? accountDetails?.doctor?.address
                  : null}
              </Text>
            </View>

            <View style={styles.LeftSideText}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  color: Theme.lightgray,
                  fontFamily: 'OpenSans-SemiBold',
                }}>
                City
              </Text>
              <Text
                // Bold
                style={styles.RightSideText}>
                {accountDetails?.doctor?.city
                  ? accountDetails?.doctor?.city
                  : null}
              </Text>
            </View>

            <View style={styles.LeftSideText}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,

                  // marginTop: 15,
                  fontFamily: 'OpenSans-SemiBold',

                  color: Theme.lightgray,
                }}>
                State
              </Text>
              <Text
                // Bold
                style={styles.RightSideText}>
                {accountDetails?.doctor?.state
                  ? accountDetails?.doctor?.state
                  : null}
              </Text>
            </View>

            <View style={styles.LeftSideText}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  color: Theme.lightgray,
                  fontFamily: 'OpenSans-SemiBold',
                }}>
                Zip Code
              </Text>
              <Text
                // Bold
                style={styles.RightSideText}>
                {accountDetails?.doctor?.zip_code
                  ? accountDetails?.doctor?.zip_code
                  : null}
              </Text>
            </View>

            <View style={{marginHorizontal: 20}}>
              <GlobalButton
                title={'Logout '}
                inlineStyle={{margin: 20, marginTop: 20}}
                // onPress={() => handleSubmit()}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
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
                <View style={styles.modalTopText}>
                  {/* <View style={{ flexDirection: 'row', marginBottom: 15 }}> */}

                  <View style={{marginVertical: 20}}>
                    <Text
                      Bold
                      style={{
                        color: Theme.lightgray,
                        fontSize: GlobalFontSize.H3,
                      }}>
                      Are you sure ?
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        authContext.signOut();
                      }}
                      style={{}}>
                      <View style={styles.modalConformText}>
                        <View style={{flexDirection: 'row'}}>
                          <Text Bold style={{color: Theme.white, fontSize: 16}}>
                            Yes
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                      }}
                      style={{}}>
                      <View style={styles.modalConformText}>
                        <View style={{flexDirection: 'row'}}>
                          <Text Bold style={{color: Theme.white, fontSize: 16}}>
                            No
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/* </View> */}
                </View>
              </Pressable>
            </Modal>
          </ScrollView>
        </>
      )}
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
                  fontSize: GlobalFontSize.H3,
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
  TopPart: {
    backgroundColor: Theme.primary,
    width: '100%',
    height: 40,
    marginTop: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  HeadingBackground: {
    backgroundColor: Theme.primary,
    width: '100%',
    height: 40,
    marginTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  ProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    resizeMode: 'cover',
    position: 'relative',
    borderRadius: 100,
  },
  HeadingText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    // marginTop: 15,

    color: Theme.white,
  },

  LeftSideText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  RightSideText: {
    fontSize: GlobalFontSize.H3,
    color: Theme.lightgray,
    marginLeft: 15,
    flex: 1,
    textAlign: 'right',
  },
  modalTopText: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    width: '90%',
    height: '25%',
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalConformText: {
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
  iconStyle: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    position: 'relative',
  },
});

export default Account;

{
  /*  */
}
