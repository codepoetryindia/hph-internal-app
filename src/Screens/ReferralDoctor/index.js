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
import Theme from '../../Components/common/Theme';
import Text from '../../Components/common/Text';
import NavigationHeaders from '../../Components/common/NavigationHeaders';
import GlobalButton from '../../Components/common/GlobalButton/GlobalButton';
import {GlobalFontSize} from '../../Components/common/CustomText';
import {GetRawurl, PutMethod} from '../../../Utils/Utils';
import AuthContext from '../../Context/AuthContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const ReferralDoctor = ({navigation, route}) => {
  const data = route?.params?.data;
  const [loader, setLoader] = useState(false);
  const {appState} = useContext(AuthContext);
  const [doctorData, setDoctorData] = useState(null);


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


  let token = appState.token;
  const isContacted = () => {
    setLoader(true);
    let payload = {
      is_contact: doctorData?.is_contact == false ? true : false,
    };
    PutMethod('api/v1/referrals/' + data + '/contact-status', payload, token)
      .then(Response => {
        if (Response.success === true) {
          setLoader(false);
          getDoctorDetailById(token)
        } 
       
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  

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
                navigation.navigate("Homepage",{CallAgain:1});                
              }}
              title="Patient details"
            />
          </View>
          <ScrollView>
            <View
              style={{
                backgroundColor: Theme.primary,
                width: '100%',
                // height: 40,
                // marginTop: 10,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}>
              <Text
                Bold
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,                 
                  color: '#fff',
                }}>
                Patient Informations
              </Text>
            </View>

            <View style={{alignItems:"center", paddingVertical: 20}}>
              <Image
                source={require('../../Assets/Images/referrals.png')}
                style={{width: 100, height: 100, borderRadius: 100}}
                // resizeMode="contain"
              />
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                  
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
                  color: Theme.lightgray,
                }}>
                Phone
              </Text>
              <Text               
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,                 
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
                  color: Theme.lightgray,
                }}>
                Date Of Birth
              </Text>
              <Text
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
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
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                }}>
               Age
              </Text>
              <Text
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  flex: 1,
                  textAlign: 'right',

                  color: Theme.lightgray,
                }}>
              {moment(new Date()).format('yyyy') -
                  moment(doctorData?.dob).format('yyyy')}{' '}
                Years old
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
                Reason
              </Text>
              <Text
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

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
              }}>
              <Text
                Bold
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                }}>
                Status
              </Text>

              <View style={{}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons
                    style={{paddingHorizontal: 10}}
                    name="call"
                    color={Theme.secondary}
                    size={17}
                  />

                  {doctorData?.is_contact == 1 ? (
                    <AntDesign
                      style={styles.searchIcon}
                      name="checkcircle"
                      color={'#78be21'}
                      size={25}
                    />
                  ) : (
                    <AntDesign
                      style={styles.searchIcon}
                      name="closecircle"
                      color={'#ea5455'}
                      size={25}
                    />
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{marginHorizontal: 20, alignSelf: 'flex-end'}}
              onPress={() => {
                isContacted();
              }}>
              <View
                style={{
                  backgroundColor:
                    doctorData?.is_contact == true ? '#ea5455' : '#78be21',
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  borderRadius: 5,
                  width: 120,
                  alignItems: 'center',
                }}>
                <Text style={{color: '#fff'}}>
                  {doctorData?.is_contact == true ? 'Not Contacted' : 'Contacted'}
                </Text>               
              </View>
            </TouchableOpacity>

            <View style={{marginHorizontal: 20}}>
              <GlobalButton
                title={'Call now'}
                inlineStyle={{marginTop: 10}}
                onPress={() => {
                  Linking.openURL(`tel:${doctorData?.phone}`);
                }}
              />
            </View>

            {/* <View style={[styles.ListStyle]}>
              <View style={{}}>
                <Image
                  source={
                    doctorData?.referral_by?.media
                      ? {uri: doctorData?.referral_by?.media?.url}
                      : require('../../Assets/Images/referrals.png')
                  }
                  style={{width: 100, height: 100, borderRadius: 100}}
                  // resizeMode="contain"
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
                       <Entypo
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
                      /> 
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
                      External User
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
            </View> */}

            {/* <View style={{marginHorizontal: 20}}>
              <GlobalButton
                title={'Call now'}
                inlineStyle={{marginTop: 10}}
                onPress={() => {
                  Linking.openURL(`tel:${doctorData?.referral_by?.phone}`);
                }}
              />
            </View> */}

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
                Doctor Informations
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
                Fullname
              </Text>
              <Text
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                  flex: 1,
                  textAlign: 'right',
                }}>
                {doctorData?.referral_by?.full_name}
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
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                  Linking.openURL(`tel:${doctorData?.referral_by?.phone}`);
                }}>
                <Ionicons
                  style={{paddingHorizontal: 10}}
                  name="call"
                  color={Theme.secondary}
                  size={17}
                />
                <Text
                  style={{
                    fontSize: 18,
                    paddingVertical: 10,
                    color: Theme.lightgray,
                  }}>
                  {doctorData?.referral_by?.phone}
                </Text>
              </TouchableOpacity>
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
                paddingTop: 5,
                marginBottom: 20,
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
                External User
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
