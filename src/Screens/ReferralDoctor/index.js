import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../Components/common/Theme';
import Text from '../../Components/common/Text';
import NavigationHeaders from '../../Components/common/NavigationHeaders';
import Entypo from 'react-native-vector-icons/Entypo';
import GlobalButton from '../../Components/common/GlobalButton/GlobalButton';
import {GlobalFontSize} from '../../Components/common/CustomText';
import {GetRawurl} from '../../../Utils/Utils';
import AuthContext from '../../Context/AuthContext';

const ReferralDoctor = ({navigation, route}) => {
  const data = route?.params?.data;
  const [loader, setLoader] = useState(false);
  const {appState} = useContext(AuthContext);
  const [doctorData, setDoctorData] = useState(null);

  // console.log('doctorData rrrr', doctorData);

  const getDoctorDetailById = token => {
    setLoader(true);
    GetRawurl(`api/v1/referrals/${data}`, token)
      .then(Response => {
        // console.log(Response);
        if (Response.data.success == true) {
          setDoctorData(Response?.data?.data?.referral[0]);
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        setError(error.message);
        setErrorMassage(true);
      });
  };

  useEffect(() => {
    let token = appState.token;
    getDoctorDetailById(token);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Theme.white}}>
      {loader == true ? (
        <View style={styles.LoadarView}>
          <ActivityIndicator size={'large'} color={Theme.primary} />
        </View>
      ) : (
        <>
          <View>
            <NavigationHeaders
              onPress={() => {
                navigation.goBack();
              }}
              title="Profile"
            />
          </View>
          <ScrollView>
            <View style={[styles.ListStyle]}>
              <View style={{}}>
                <Image
                  source={
                    doctorData?.referral_by?.media
                      ? {uri: doctorData?.referral_by?.media?.url}
                      : require('../../Assets/Images/referrals.png')
                  }
                  style={{width: 100, height: 100, borderRadius: 100}}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '70%',
                  marginHorizontal: 20,
                }}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      maxWidth: 180,
                    }}>
                    <Text style={[styles.DoctorName, ,]}>
                      {doctorData?.referral_by?.full_name}
                    </Text>
                    <View style={{paddingHorizontal: 10}}>
                      {/* <Entypo
                        name={
                          doctorData?.referral_by?.favorited_to?.length > 0
                            ? 'star'
                            : 'star-outlined'
                        }
                        color={
                          doctorData?.referral_by?.favorited_to?.length > 0
                            ? '#FF8B13'
                            : Theme.RightIcon
                        }
                        size={25}
                      /> */}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 5,
                    }}>
                    <Image
                      source={require('../../Assets/Images/specialilyIcon.png')}
                      style={{width: 12, height: 12}}
                    />
                    <Text style={[styles.Doctorspecialily]}>
                      {/* {doctorData?.referral_to?.direcory?.name} */}
                      {/* {doctorData?.referral_by?.directory?.name} */}
                      Enternal User
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',

                      width: 180,
                    }}>
                    <Ionicons name="call" color={Theme.secondary} size={15} />
                    <Text style={[styles.Doctorspecialily]}>
                      {doctorData?.referral_by?.phone}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{marginHorizontal: 20}}>
              <GlobalButton
                title={'Call now'}
                inlineStyle={{marginTop: 10}}
                onPress={() => {
                  Linking.openURL(`tel:${doctorData?.referral_by?.phone}`);
                }}
              />
            </View>

            <View
              style={{
                backgroundColor: Theme.primary,
                width: '100%',
                // height: 40,
                marginTop: 20,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}>
              <Text
                Bold
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  // fontWeight: '500',
                  color: '#fff',
                }}>
                Doctor’s Information
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                }}>
                Number
              </Text>
              <Text
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                  flex: 1,
                  textAlign: 'right',
                }}>
                {doctorData?.referral_by?.phone}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                }}>
                Email
              </Text>
              <Text
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  // fontWeight: '600',
                  color: Theme.lightgray,
                  flex: 1,
                  textAlign: 'right',
                }}>
                {doctorData?.referral_by?.email}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingTop:5
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  color: Theme.lightgray,
                }}>
                Speciality
              </Text>
              <Text
                style={{
                  fontSize: GlobalFontSize.H3,
                  color: Theme.lightgray,
                  flex: 1,
                  textAlign: 'right',
                }}>
                {/* {doctorData?.referral_by?.directory?.name} */}
                Enternal User
              </Text>
            </View>
            <View
              style={{
                backgroundColor: Theme.primary,
                width: '100%',
                // height: 40,
                marginTop: 10,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}>
              <Text
                Bold
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  // marginTop: 15,
                  // fontWeight: '500',
                  color: '#fff',
                }}>
                Patient’s Information
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  // marginTop: 15,

                  color: Theme.lightgray,
                }}>
                Name
              </Text>
              <Text
                // Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  // marginTop: 15,
                  // fontWeight: '600',
                  color: Theme.lightgray,
                  flex: 1,
                  textAlign: 'right',
                }}>
                {/* Jone Doe */}
                {doctorData?.first_name} {doctorData?.last_name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  // marginTop: 15,

                  color: Theme.lightgray,
                }}>
                Phone
              </Text>
              <Text
                // Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  // marginTop: 15,
                  // fontWeight: '600',
                  color: Theme.lightgray,
                  flex: 1,
                  textAlign: 'right',
                }}>
                {doctorData?.phone}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  // marginTop: 15,

                  color: Theme.lightgray,
                }}>
                Date Of Birth
              </Text>
              <Text
                // Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  // marginTop: 15,
                  flex: 1,
                  textAlign: 'right',

                  color: Theme.lightgray,
                }}>
                {doctorData?.dob}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                // alignItems:"center"
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                }}>
                Reason
              </Text>
              <Text
                // Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                  flex: 1,
                  textAlign: 'right',
                }}>
                {doctorData?.reason_for_referral}
              </Text>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  ListStyle: {
    height: 90,
    margin: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  DoctorName: {
    fontSize: GlobalFontSize.P,
    fontFamily: 'OpenSans-SemiBold',
    lineHeight: 19,
  },
  Doctorspecialily: {
    paddingHorizontal: 8,
    fontSize: GlobalFontSize.P,
    lineHeight: 19,
    marginBottom: 3,
  },
});

export default ReferralDoctor;

{
  /*  */
}
