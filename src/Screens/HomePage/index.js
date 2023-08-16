import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../Components/common/Theme';
import Text from '../../Components/common/Text';
import Feather from 'react-native-vector-icons/Feather';
import {GlobalFontSize} from '../../Components/common/CustomText';
import {GetRawurl, PutMethod} from '../../../Utils/Utils';
import AuthContext from '../../Context/AuthContext';
import Header from '../../Components/common/Header';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import {PermissionsAndroid} from 'react-native';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-simple-toast';
import {phoneNumberAutoFormat} from '../../../Utils/phoneNumberAutoFormat';

const Homepage = ({navigation, route}) => {
  const [loader, setLoader] = useState(false);
  const [selected, setSelected] = useState('');
  const {appState, authContext} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [errorMassage, setErrorMassage] = useState(false);
  const [filterModel, setFilterModel] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateValue, setdateValue] = useState(null);
  const [directoryValue, setDirectoryValue] = useState([]);
  const [AllDirectories, setAllDirectories] = useState([]);

  // Pagination Works
  const [allDoctors, setAllDoctors] = useState([]);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [SearchKey, setSearchKey] = useState('');
  const [open, setOpen] = useState(false);
  const [openStatDate, setOpenStatDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [csvUrl, setCsvUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isFilter, setisFilter] = useState(false);
  const [appliedFilters, setappliedFilters] = useState([]);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const CallAgain = route?.params?.CallAgain;

  const token = appState.token;
  let UserData = appState.data;
  let verificationStatus = appState.status;

  const [items, setItems] = useState([
    {label: 'Today', value: 'today'},
    {label: 'Last 7 days', value: 'last_7_days'},
    {label: 'Last 30 days', value: 'last_30_days'},
    {label: 'Last 90 days', value: 'last_90_days'},
    {label: 'Custom', value: 'custom', selected: true},
  ]);
  const [directoryItems, setDirectoryItems] = useState([
    {label: 'Physician', value: 'physician'},
    {label: 'Non Physician', value: 'non-physician'},
  ]);

  // useEffect(() => {
  //   const filterDirectory = AllDirectories.map(x => {
  //     console.log("first",x)
  //     return {
  //       label: x.name,
  //       value: x.name,

  //     };
  //   });
  //   setDirectoryItems(filterDirectory);
  // }, [AllDirectories]);

  const REMOTE_IMAGE_PATH = csvUrl;
  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      setModalVisible(false);
      getData(false, false, true);
      // downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          // console.log('Storage Permission Granted.');
          setModalVisible(false);
          getData(true, false, true);
          // downloadImage();
        } else {
          setError('Storage Permission Not Granted');
          setErrorMassage(true);
          // alert('Storage Permission Not Granted');
        }
      } catch (err) {}
    }
  };
  const downloadCSV = Url => {
    let date = new Date();
    let image_URL = Url;
    let ext = getExtention(image_URL);

    ext = '.' + ext[0];
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/csv_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // alert('File Downloaded Successfully.');
        setSuccessModal(true);
      });
  };
  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const Get_All_Directory_Department = () => {
    setLoader(true);
    GetRawurl('api/v1/directories?perPage=100', token)
      .then(Response => {
        setAllDirectories(Response.data.data.directories);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.log('error.message', error.message);
        // setError(error.message);
        // setErrorMassage(true);
      });
  };

  useEffect(() => {
    Get_All_Directory_Department();
  }, []);

  const getDataFilter = () => {
    let queryString = '';
    if (isFilter) {
      if (appliedFilters.length > 0) {
        appliedFilters.forEach(element => {
          if (element.key == 'Date') {
            let dateObj = getStartEndDate(element.Value);
            queryString += `&startDate=${dateObj.startDate}&endDate=${dateObj.endDate}`;
          } else {
            queryString += `&${element.key}=${element.Value}`;
          }
        });
      }
    }
    return queryString;
  };

  const getStartEndDate = duration => {
    switch (duration) {
      case 'today':
        return {
          startDate: moment(new Date()).format('YYYY-MM-DD'),
          endDate: moment(new Date()).format('YYYY-MM-DD'),
        };
      break;
      case 'last_7_days':
        return {
          startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          endDate: moment(new Date()).format('YYYY-MM-DD'),
        };
        break;
      case 'last_30_days':
        return {
          startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
          endDate: moment(new Date()).format('YYYY-MM-DD'),
        };
      break;
      case 'last_90_days':
        return {
          startDate: moment().subtract(90, 'days').format('YYYY-MM-DD'),
          endDate: moment(new Date()).format('YYYY-MM-DD'),
        };
      break;
      case 'custom':
        return {
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
        };
        break;

      default:
        return {
          startDate: moment(new Date()).format('YYYY-MM-DD'),
          endDate: moment(new Date()).format('YYYY-MM-DD'),
        };
        break;
    }
  };

  useEffect(() => {
    setIsListEnd(false);
    setOffset(1);
    getData(true, true);
  }, [isFilter, appliedFilters, startDate, endDate]);

  const requestUserPermission= async ()=> {
    const authStatus = await messaging().requestPermission();
    return(
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    
    );
  };

  const showToast = (message) => {
    Toast.showWithGravity(message, Toast.LONG, Toast.TOP, { backgroundColor: 'blue' });
  }

  useEffect(()=>{
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      let type = JSON.parse(remoteMessage?.data?.type);
      if(type.type = "Referral Updated" || type.type == "Create Referral"){
        getData(true, true);
        showToast(remoteMessage?.notification?.body)
      }

    });
    return unsubscribe;
  },[])

  const getData = (
    pullToRefresh = false,
    isSearchHappened = false,
    isCsv = false,
  ) => {
    if (pullToRefresh) {
      setRefreshing(true);
    }

    if (pullToRefresh || (!scrollLoading && !isListEnd)) {
      setScrollLoading(true);
      let finalurl = `api/v1/referrals?page=${
        pullToRefresh ? 1 : offset
      }&perPage=30&q=${SearchKey}`;

      if (isFilter) {
        finalurl += getDataFilter();
      }

      if (isCsv) {
        finalurl += '&export_csv=true';
      }
      // console.log(finalurl);
      // console.log('SearchKey', SearchKey);

      GetRawurl(finalurl, token)
        .then(Response => {
          if (Response.data.success) {
            // console.log("Response",Response)
            if (Response?.data?.data.csv_url && isCsv) {
              setRefreshing(false);
              setScrollLoading(false);

              // setCsvUrl(Response?.data?.data?.csv_url);
              downloadCSV(Response?.data?.data?.csv_url);
              return;
            }
            if (Response?.data?.data?.referrals.length > 0) {
              // After the response increasing the offset
              if (pullToRefresh) {
                setOffset(2);
                setAllDoctors([...Response?.data?.data?.referrals]);
              } else {
                setOffset(offset + 1);
                setAllDoctors([
                  ...allDoctors,
                  ...Response?.data?.data?.referrals,
                ]);
              }
              setScrollLoading(false);
              setRefreshing(false);
            } else {
              if (offset == 1) {
                setAllDoctors([]);
              } else if (isSearchHappened) {
                setAllDoctors([]);
              }
              setIsListEnd(true);
              setScrollLoading(false);
              setRefreshing(false);
            }
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
          // setAllDoctors(Response?.data?.data?.referrals);
          // setLoader(false);
        })
        .catch(error => {
          setLoader(false);
          setScrollLoading(false);
          setRefreshing(false);
          setError(error.message);
          setErrorMassage(true);
        });
    }
  };

  const onRefresh = () => {
    setIsListEnd(false);
    setOffset(1);
    getData(true);
  };

  useEffect(() => {
    getData(true, true);
  }, [SearchKey]);

  // useEffect(() => {
  //   onRefresh()
  // }, [CallAgain]);

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {scrollLoading ? (
          <ActivityIndicator color="black" style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: allDoctors.length > 0 ? Theme.ScreenBackground : Theme.white}}>
      {loader == true ? (
        <View style={styles.LoadarView}>
          <ActivityIndicator size={'large'} color={Theme.primary} />
        </View>
      ) : (
        <>
          <Header name="Your Referrals" />
          <View
            style={{
              backgroundColor: Theme.primary,
              height: 80,
              // alignItems: 'left',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={[
                styles.textInput,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <MaterialCommunityIcons
                style={styles.searchIcon}
                name="account-search-outline"
                color={Theme.gray}
                size={30}
              />
              <TextInput
                style={[styles.InputStyle, {width: SearchKey ? '70%' : '80%'}]}
                placeholder="Search"
                placeholderTextColor={Theme.lightgray}
                onChangeText={setSearchKey}
                value={SearchKey}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                {SearchKey ? (
                  <Ionicons
                    onPress={() => {
                      setIsListEnd(false);
                      setOffset(1);
                      setSearchKey('');
                      // onRefresh();
                    }}
                    style={styles.searchIcon}
                    name="close-circle-outline"
                    color={Theme.gray}
                    size={27}
                  />
                ) : null}

                <Ionicons
                  onPress={() => {
                    setFilterModel(true);
                  }}
                  style={styles.searchIcon}
                  name="filter"
                  color={Theme.gray}
                  size={25}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}>
              <Ionicons
                // style={styles.searchIcon}
                name="arrow-down-circle-outline"
                color={Theme.white}
                size={27}
              />
            </TouchableOpacity>
          </View>
          <View>
            {isFilter && appliedFilters.length > 0 ? (
              <View style={{flexDirection: 'row'}}>
                <FlatList
                  data={appliedFilters}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.filterButton,
                          {backgroundColor: '#FFF', flexDirection: 'row'},
                        ]}
                        onPress={() => {
                          const nextCounters = appliedFilters.filter((c, i) => {
                            if (c.key != item.key) {
                              return c;
                            }
                          });
                          setappliedFilters(nextCounters);
                        }}>
                        <Text
                          style={{color: '#000', textTransform: 'capitalize'}}>
                          {item?.Value
                            ? item?.Value.replace(/_|-/g, ' ')
                            : null}
                        </Text>
                        <Ionicons
                          style={styles.searchIcon}
                          name="close"
                          color={Theme.secondary}
                          size={15}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    {backgroundColor: '#FFF', flexDirection: 'row'},
                  ]}
                  onPress={() => {
                    setappliedFilters([]);
                    setisFilter(false);
                    // setValue(null);
                    // setStartDate(undefined);
                    // setEndDate(undefined);
                    // onRefresh();
                  }}>
                  <Text style={{color: '#000'}}>Clear</Text>
                  <Ionicons
                    style={styles.searchIcon}
                    name="close"
                    color={Theme.secondary}
                    size={15}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <View styles={{marginVertical: 10}}>
            <FlatList
              data={allDoctors}
              style={{
                marginBottom: isFilter ? 200 : 150,
                marginTop: isFilter ? 2 : 10,
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyExtractor={(item, index) => index.toString()}
              onEndReached={() => getData()}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={
                <View style={styles.appLogoStyleContainer}>
                  <Image
                    source={require('../../Assets/Images/notes.png')}
                    style={styles.appLogoStyle}
                    resizeMode="contain"
                  />
                  <Text Bold style={{color: Theme.secondary}}>
                    No referrals found yet.
                  </Text>
                </View>
              }
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.ListStyle,
                      {
                        backgroundColor:
                          selected === item.id ? Theme.primary : '#fff',
                      },
                    ]}
                    onPress={() => {
                      navigation.navigate('ReferralDoctor', {
                        data: item?.id,
                      });
                    }}>
                    <View style={{paddingHorizontal: 15}}>
                      <Image
                        source={require('../../Assets/Images/Patient.png')}
                        style={{width: 70, height: 70, borderRadius: 100}}
                        // resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View>
                          <Text
                            Bold
                            style={[
                              styles.DoctorName,
                              {
                                color: '#3F3F3F',
                              },
                            ]}>
                            {item?.first_name} {item?.last_name}
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: 3,
                            }}>
                            <Ionicons
                              name="calendar"
                              color={Theme.secondary}
                              size={15}
                            />
                            <Text
                              style={[
                                styles.Doctorspecialily,
                                {
                                  color: '#3F3F3F',
                                },
                              ]}>
                              {moment(item?.created_at).format('YYYY-MM-DD')}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Ionicons
                              name="call"
                              color={Theme.secondary}
                              size={15}
                            />

                            <Text
                              style={[
                                styles.Doctorspecialily,
                                {
                                  color:
                                    selected === item.id ? '#fff' : '#3F3F3F',
                                },
                              ]}>
                              {phoneNumberAutoFormat(item?.phone)}
                            </Text>
                          </View>
                        </View>

                        {item.contact_type == 'Pending' ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#FF8000',
                              borderRadius: 50,
                              opacity:0.8
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
                              opacity:0.8
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
                              opacity:0.8
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
                              backgroundColor: '#DF0101',
                              borderRadius: 50,
                              opacity:0.8
                            }}>
                            <Text style={{color: '#fff', paddingVertical: 2}}>
                              No answer
                            </Text>
                          </View>
                        ) :item.contact_type == 'Appointment' ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#379237',
                              borderRadius: 50,
                              opacity:0.8
                            }}>
                            <Text style={{color: '#fff', paddingVertical: 2}}>
                            Appointment
                            </Text>
                          </View>
                        ): null}

                        {/* {item.is_contact == true ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <AntDesign
                              style={styles.searchIcon}
                              name="checkcircle"
                              color={'#78be21'}
                              size={25}
                            />
                          </View>
                        ) : (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <AntDesign
                              style={styles.searchIcon}
                              name="closecircle"
                              color={'#ea5455'}
                              size={25}
                            />
                          </View>
                        )} */}
                      </View>
                      <View>
                        <Feather
                          name="chevron-right"
                          color={
                            selected === item.id ? '#fff' : Theme.RightIcon
                          }
                          size={30}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
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
              alignItems: 'center',
              flexDirection: 'column',
            }}>
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
              <TouchableOpacity style={{}}>
                <TouchableOpacity
                  onPress={() => {
                    setErrorMassage(false);
                    setScrollLoading(false);
                    setRefreshing(false);
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
          </View>
        </Pressable>
      </Modal>
      <Modal transparent={true} visible={filterModel}>
        <Pressable
          onPress={() => {
            // setFilterModel(false);
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
              padding: 20,
              borderRadius: 5,
              width: '90%',
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: 250,
            }}>
            <View style={{marginBottom: 10}}>
              <Text
                Bold
                style={{
                  color: Theme.black,
                  opacity: 0.5,
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                Filter Data
              </Text>
            </View>

            <View style={styles.dropdownCompany}>
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
                placeholder="Select Duration"
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyles}
                onChangeValue={value => {
                  setdateValue(value);
                  let data = {key: 'Date', Value: value};
                  if (appliedFilters.length > 0) {
                    let obj = appliedFilters.find(o => o.key == 'Date');
                    if (!obj) {
                      setappliedFilters(prev => [...prev, data]);
                      return;
                    }
                    const nextCounters = appliedFilters.map((c, i) => {
                      if (c.key == 'Date') {
                        // Increment the clicked counter
                        return {key: 'Date', Value: value};
                      } else {
                        // The rest haven't changed
                        return c;
                      }
                    });
                    setappliedFilters(nextCounters);
                  } else {
                    setappliedFilters(prev => [...prev, data]);
                  }
                }}
              />

              {dateValue == 'custom' ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 10,
                    }}>
                    <View style={{flexDirection: 'column'}}>
                      <View style={{paddingHorizontal: 2, marginTop: 10}}>
                        <Text Bold style={{color: Theme.gray}}>
                          Start Date
                        </Text>
                      </View>

                      <View style={[styles.FilterDate]}>
                        <TouchableOpacity
                          style={[styles.input]}
                          onPress={() => setOpenStatDate(true)}>
                          <Text style={{color: Theme.lightgray, fontSize: 16}}>
                            {startDate == ''
                              ? 'Start date'
                              : moment(startDate).format('DD-MMM-YYYY')}
                          </Text>
                        </TouchableOpacity>

                        <DatePicker
                          modal
                          open={openStatDate}
                          maximumDate={new Date()}
                          // textColor={'red'}
                          date={new Date()}
                          mode={'date'}
                          onConfirm={date => {
                            setStartDate(date);
                            setOpenStatDate(false);
                            //  setFieldValue('dob', date);
                          }}
                          onCancel={() => {
                            setOpenStatDate(false);
                          }}
                        />
                      </View>
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <View style={{paddingHorizontal: 2, marginTop: 10}}>
                        <Text Bold style={{color: Theme.gray}}>
                          End Date
                        </Text>
                      </View>

                      <View style={[styles.FilterDate]}>
                        <TouchableOpacity
                          style={[styles.input]}
                          onPress={() => setOpenEndDate(true)}>
                          <Text style={{color: Theme.lightgray, fontSize: 16}}>
                            {endDate == ''
                              ? 'End date'
                              : moment(endDate).format('DD-MMM-YYYY')}
                          </Text>
                        </TouchableOpacity>
                        <DatePicker
                          modal
                          open={openEndDate}
                          maximumDate={new Date()}
                          // textColor={'#444'}
                          date={new Date()}
                          mode={'date'}
                          onConfirm={date => {
                            setEndDate(date);
                            setOpenEndDate(false);
                            //  setFieldValue('dob', date);
                          }}
                          onCancel={() => {
                            setOpenEndDate(false);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </>
              ) : null}
            </View>

            <View style={styles.dropdownCompany}>
              <DropDownPicker
                zIndex={2000}
                // searchable={true}
                zIndexInverse={2000}
                open={directoryOpen}
                value={directoryValue}
                items={directoryItems}
                setOpen={setDirectoryOpen}
                setValue={setDirectoryValue}
                setItems={setDirectoryItems}
                placeholder="Select User Type"
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
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyles}
                onChangeValue={value => {
                  let data = {key: 'role', Value: value};
                  if (appliedFilters.length > 0) {
                    let obj = appliedFilters.find(o => o.key == 'role');
                    if (!obj) {
                      setappliedFilters(prev => [...prev, data]);
                      return;
                    }
                    const nextCounters = appliedFilters.map((c, i) => {
                      if (c.key == 'role') {
                        // Increment the clicked counter
                        return {key: 'role', Value: value};
                      } else {
                        // The rest haven't changed
                        return c;
                      }
                    });
                    setappliedFilters(nextCounters);
                  } else {
                    setappliedFilters(prev => [...prev, data]);
                  }
                }}
                // listMode="MODAL"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsListEnd(false);
                  setOffset(1);
                  setSearchKey('');
                  setdateValue(null);
                  setDirectoryValue(null);
                  setFilterModel(false);
                }}
                style={{}}>
                <View style={styles.modalConformText}>
                  <View style={{flexDirection: 'row'}}>
                    <Text Bold style={{color: Theme.white, fontSize: 16}}>
                      Cancel
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (appliedFilters.length > 0) {
                    setFilterModel(false);
                    setdateValue(null);
                    setDirectoryValue(null);
                    setisFilter(true);
                  } else {
                    alert('no filter added');
                    setFilterModel(false);
                  }
                }}
                style={{}}>
                <View style={styles.modalConformText}>
                  <View style={{flexDirection: 'row'}}>
                    <Text Bold style={{color: Theme.white, fontSize: 16}}>
                      Apply
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

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
              // justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            {/* <View style={{ flexDirection: 'row', marginBottom: 15 }}> */}

            <View style={{marginVertical: 15}}>
              <Text
                Bold
                style={{
                  color: Theme.lightgray,

                  fontSize: 18,
                }}>
                Are you sure you want to export (CSV)?
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 11,
              }}>
              <TouchableOpacity onPress={() => checkPermission()} style={{}}>
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
                        fontSize: 16,
                        color: Theme.white,
                      }}>
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
              minHeight: 200,
              // justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            {/* <View style={{ flexDirection: 'row', marginBottom: 15 }}> */}

            <Image source={require('../../Assets/Images/successicon.png')} />

            <View style={{marginTop: 10}}>
              <Text
                Bold
                style={{
                  color: Theme.black,
                  opacity: 0.5,
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                CSV Downloaded Successfully.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 11,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSuccessModal(false);
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appLogoStyleContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appLogoStyle: {
    width: 250,
    height: 300,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
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
  ListStyle: {
    backgroundColor: Theme.white,
    marginBottom: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
  },
  textInput: {
    backgroundColor: Theme.white,
    // marginTop: 30,
    // backgroundColor:"red",
    color: Theme.black,
    padding: 7,
    width: '85%',
    // alignSelf: 'left',
    borderRadius: 10,
    shadowColor: Theme.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    marginHorizontal: 10,
  },
  searchIcon: {
    // paddingLeft: 7,
    // opacity: 0.5,
    paddingLeft: 3,
  },
  InputStyle: {
    color: Theme.gray,
    fontWeight: '600',
    fontSize: GlobalFontSize.P,
    fontFamily: 'OpenSans-Regular',
    height: 40,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  FilterStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: Theme.white,
    margin: 10,
    marginHorizontal: 15,
    borderRadius: 10,

    // justifyContent:"space-between"
    shadowColor: Theme.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 10.27,
    elevation: 10,
  },
  FilterText: {
    fontSize: GlobalFontSize.H3,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
    lineHeight: 22,
    marginLeft: 20,
  },
  button: {
    backgroundColor: '#fff',
  },
  FilterDate: {
    backgroundColor: Theme.white,
    marginTop: 15,
    color: Theme.black,
    paddingHorizontal: 15,
    // marginHorizontal: 10,
    paddingVertical: 5,
    minWidth: '40%',
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
  input: {
    backgroundColor: Theme.white,
    paddingHorizontal: 5,
    paddingVertical: 10,
    width: '100%',
  },

  // sljkhdfjhskjfhkjs

  dropdown: {
    borderColor: Theme.lightgray,
    fontSize: GlobalFontSize.H3,
    height: 60,
  },
  placeholderStyles: {
    color: 'grey',
    fontSize: GlobalFontSize.H3,
  },
  dropdownCompany: {
    marginHorizontal: 3,
    marginBottom: 15,
    // zIndex: 111,
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
  filterButton: {
    // height: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    borderRadius: 4,
    backgroundColor: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#B7B7B7',
  },
  dropdown: {
    borderColor: Theme.lightgray,
    fontSize: GlobalFontSize.H3,
    // zIndex: 99999,
  },
});

export default Homepage;
