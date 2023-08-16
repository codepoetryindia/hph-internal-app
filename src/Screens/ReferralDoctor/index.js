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
import DropDownPicker from 'react-native-dropdown-picker';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-simple-toast';
import {phoneNumberAutoFormat} from '../../../Utils/phoneNumberAutoFormat';

const ReferralDoctor = ({navigation, route}) => {
  const data = route?.params?.data;
  const [loader, setLoader] = useState(false);
  const {appState} = useContext(AuthContext);
  const [doctorData, setDoctorData] = useState(null);

  const [dateValue, setdateValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [satusValue, setSatusValue] = useState('');

  const [items, setItems] = useState([    
    {label: 'Pending', value: '0'},
    {label: 'Callback', value: '1'},
    {label: 'Left voice mail', value: '2'},
    {label: 'No answer', value: '3'},
    {label: 'Appointment', value: '4'},
  ]);



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

  const showToast = (message) => {
    Toast.showWithGravity(message, Toast.LONG, Toast.TOP, { backgroundColor: 'blue' });
  }

  const requestUserPermission= async ()=> {
    const authStatus = await messaging().requestPermission();
    return(
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    
    );
  };

  useEffect(()=>{   
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      let type = JSON.parse(remoteMessage?.data?.type);
      console.log("remoteMessage_2", remoteMessage)
      console.log("type_2", type)
      if(type.type = "Referral Updated"){
        let token = appState.token;
        getDoctorDetailById(token);
        showToast(remoteMessage?.notification?.body)
      }
    });
    return unsubscribe;
  },[])

  let token = appState.token;

  const isContacted = () => {
    setLoader(true);
    let payload = {
      is_contact: satusValue,
    };
    PutMethod('api/v1/referrals/' + data + '/contact-status', payload, token)
      .then(Response => {
        if (Response.success === true) {
          setLoader(false);
          getDoctorDetailById(token);
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
                navigation.navigate('Homepage', {CallAgain: 1});
              }}
              title="Patient details"
            />
          </View>
          <ScrollView nestedScrollEnabled={true} >
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

            <View style={{alignItems: 'center', paddingVertical: 20}}>
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
                {phoneNumberAutoFormat(doctorData?.phone)}
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
                  doctorData?.dob_year}{' '}
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

            {/* <View
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
                Do you speak Spanish
              </Text>
              <Text
                style={{
                  fontSize: GlobalFontSize.H3,
                  paddingVertical: 10,
                  color: Theme.lightgray,
                  flex: 1,
                  textAlign: 'right',
                }}>
                {doctorData?.is_spanish == 0 ? 'No' : 'Yes'}
              </Text>
            </View> */}

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
                  {/* <Ionicons
                    style={{paddingHorizontal: 10}}
                    name="call"
                    color={Theme.secondary}
                    size={17}
                  /> */}

                  {/* {item.contact_type == 'Pending' ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#FF8000',
                              borderRadius: 50,
                            }}>
                            <Text style={{color: '#fff', paddingVertical: 2}}>
                              Pending
                            </Text>
                          </View>
                        ) : item.contact_type == 'Callback' ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#31B404',
                              borderRadius: 50,
                            }}>
                            <Text style={{color: '#fff', paddingVertical: 2}}>
                              Callback
                            </Text>
                          </View>
                        ) : item.contact_type == 'Left voice mail' ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#01A9DB',
                              borderRadius: 50,
                            }}>
                            <Text style={{color: '#fff', paddingVertical: 2}}>
                              Left Voice Mail
                            </Text>
                          </View>
                        ) : item.contact_type == 'No answer' ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: 'red',
                              borderRadius: 50,
                            }}>
                            <Text style={{color: '#fff', paddingVertical: 2}}>
                              No answer
                            </Text>
                          </View>
                        ) : null} */}

                  {
                    doctorData?.contact_type == 'Pending' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#FF8000',
                          borderRadius: 50,
                          width: 100,
                        }}>
                        <Text style={{color: '#fff', paddingVertical: 2}}>
                          Pending
                        </Text>
                      </View>
                    ) : doctorData?.contact_type == 'Callback' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#31B404',
                          borderRadius: 50,
                          width: 100,
                        }}>
                        <Text style={{color: '#fff', paddingVertical: 2}}>
                          Callback
                        </Text>
                      </View>
                    ) : doctorData?.contact_type == 'Left voice mail' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#01A9DB',
                          borderRadius: 50,
                          width: 150,
                        }}>
                        <Text style={{color: '#fff', paddingVertical: 2}}>
                          Left voice mail
                        </Text>
                      </View>
                    ) : doctorData?.contact_type == 'No answer' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'red',
                          borderRadius: 50,
                          width: 100,
                        }}>
                        <Text style={{color: '#fff', paddingVertical: 2}}>
                          No answer
                        </Text>
                      </View>
                    ):
                    doctorData?.contact_type == 'Appointment' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#379237',
                          borderRadius: 50,
                          width: 110,
                        }}>
                        <Text style={{color: '#fff', paddingVertical: 2}}>
                        Appointment
                        </Text>
                      </View>
                    ): null

                    // (
                    //   <Text>gjhgjhsgdfsdgdsgdg</Text>
                    //   // <AntDesign
                    //   //   style={styles.searchIcon}
                    //   //   name="checkcircle"
                    //   //   color={'#78be21'}
                    //   //   size={25}
                    //   // />
                    // ) : (
                    //   <AntDesign
                    //     style={styles.searchIcon}
                    //     name="closecircle"
                    //     color={'#ea5455'}
                    //     size={25}
                    //   />
                    // )
                  }
                </View>
              </View>
            </View>



            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                
                alignItems: 'center',
                paddingBottom:20,
              }}>
              <View style={{paddingLeft:20}}>
                <DropDownPicker
                  zIndex={3000}
                  zIndexInverse={1000}
                  open={open}
                  value={dateValue}
                  items={items}
                  setOpen={setOpen}
                  setValue={setdateValue}
                  listItemLabelStyle={{
                    fontSize: 16,
                  }}
                  labelStyle={{
                    fontSize: 16,
                  }}
                  dropDownContainerStyle={{
                    // backgroundColor: "red",
                    borderColor: Theme.lightgray,
                  }}
                  customItemContainerStyle={{
                    margin: 10,
                  }}
                  // defaultValue={select}
                  // setItems={setItems}
                  placeholder="Select a option"
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyles}
                  onChangeValue={value => {
                    setSatusValue(value)
                  }}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View>
              <View style={{}}>

              <TouchableOpacity
                style={{marginHorizontal: 20, }}
                onPress={() => {
                  isContacted();
                }}>
                <View
                  style={{
                    backgroundColor: '#0489B1',
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 5,
                    width: 120,
                    alignItems: 'center',
                    marginTop:15
                  }}>
                  <Text style={{color: '#fff'}}>
                    {/* {doctorData?.is_contact == true
                    ? 'Not Contacted'
                    : 'Contacted'} */}
                    Submit
                  </Text>
                </View>
              </TouchableOpacity>
              </View>
            </View>

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
                PHYSICIAN INFORMATION
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
                  {phoneNumberAutoFormat(doctorData?.referral_by?.phone)}
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
            {doctorData?.referral_by?.doctor?.speciality &&
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
                  {doctorData?.referral_by?.doctor?.speciality}
                </Text>
              </View>
              }
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
                  Type
                </Text>
                <Text
                  style={{
                    fontSize: GlobalFontSize.H3,
                    color: Theme.lightgray,
                    flex: 1,
                    textAlign: 'right',
                  }}>
                    {doctorData?.referral_by?.roles[0]?.name != 'normal-user' ? "Physician" : "Non Physician"}
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
  dropdownCompany: {
    marginHorizontal: 3,
    marginBottom: 15,
    // zIndex: 111,
  },

  dropdown: {
    borderColor: Theme.lightgray,
    fontSize: GlobalFontSize.H3,
    height: 30,
    width: 200,

    // zIndex: 99999,
  },
  placeholderStyles: {
    color: 'grey',
    fontSize: GlobalFontSize.H3,
  },
});

export default ReferralDoctor;

{
  /*  */
}
