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

const Homepage = ({navigation}) => {
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
  const [directoryItems, setDirectoryItems] = useState([]);

  // Pagination Works
  const [allDoctors, setAllDoctors] = useState([]);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [SearchKey, setSearchKey] = useState('');

  const [open, setOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [openStatDate, setOpenStatDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [csvUrl, setCsvUrl] = useState('');

  const token = appState.token;
  let UserData = appState.data;
  let verificationStatus = appState.status;

  const [isFilter, setisFilter] = useState(false);
  const [appliedFilters, setappliedFilters] = useState([]);

  const [items, setItems] = useState([
    {label: 'Today', value: 'today'},
    {label: 'Last 7 days', value: 'last_7_days'},
    {label: 'Custom', value: 'custom', selected: true},
  ]);

  useEffect(() => {
    const filterDirectory = AllDirectories.map(x => {
      return {
        label: x.name,
        value: x.name,
      };
    });
    setDirectoryItems(filterDirectory);
  }, [AllDirectories]);

  const REMOTE_IMAGE_PATH = csvUrl;
  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadImage();
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
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const downloadImage = () => {
    let date = new Date();
    let image_URL = REMOTE_IMAGE_PATH;
    let ext = getExtention(image_URL);
    console.log('ext', ext);
    ext = '.' + ext[0];
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    console.log('PictureDir', PictureDir);

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
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
        console.log('response', Response);
        setAllDirectories(Response.data.data.directories);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        setError(error.message);
        setErrorMassage(true);
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
          console.log(element);
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

  const getData = (pullToRefresh = false, isSearchHappened = false) => {
    if (pullToRefresh) {
      setRefreshing(true);
    }

    if (pullToRefresh || (!scrollLoading && !isListEnd)) {
      console.log('getData', offset);
      setScrollLoading(true);
      let finalurl = `api/v1/referrals?page=${
        pullToRefresh ? 1 : offset
      }&perPage=30&q=${SearchKey}&export_csv=true`;

      if (isFilter) {
        finalurl += getDataFilter();
      }
      console.log(finalurl);
      console.log('SearchKey', SearchKey);

      GetRawurl(finalurl, token)
        .then(Response => {
          console.log(Response);
          if (Response.data.success) {
            if (Response?.data?.data.csv_url) {
              setCsvUrl(Response?.data?.data?.csv_url);
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
              console.log(offset);

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
            console.log('no data found');
            setError(Response.data.message);
            setErrorMassage(true);
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

  // if (status) {
  //   return (
  //     <ChangePassword
  //       onPress={() => {
  //         setStatus(false);
  //         authContext.updateStatus();
  //       }}
  //     />
  //   );
  // }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Theme.ScreenBackground}}>
      {loader == true ? (
        <View style={styles.LoadarView}>
          <ActivityIndicator size={'large'} color={Theme.primary} />
        </View>
      ) : (
        <>
          <Header name="Referrals" />
          <View
            style={{
              backgroundColor: Theme.primary,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
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
                 style={[styles.InputStyle, {width: SearchKey ? '65%' : '75%'}]}
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
                    size={30}
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
                        <Text style={{color: '#000'}}>{item?.Value}</Text>
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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',             
              position: 'absolute',
              bottom: 15,
              right: 20,
              zIndex: 3000,
            }}>
            <View
              style={{
                backgroundColor: Theme.secondary,
                alignItems:"center",
                justifyContent: 'center',
                // textAlign: 'center',
               
                // padding:20, 
                height:60,
                width:60,              
                borderRadius: 100,
              }}>
              
              <TouchableOpacity onPress={checkPermission}>
                <Ionicons
                  style={styles.searchIcon}
                  name="arrow-down-circle-outline"
                  color={Theme.white}
                  size={40}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View styles={{marginVertical: 10}}>
            <FlatList
              data={allDoctors}
              style={{
                marginBottom: isFilter ? 60 : 130,
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
                <View style={{flex: 1, alignItems: 'center', marginTop: 250}}>
                  <Text style={{color: Theme.secondary, fontWeight: '600'}}>
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
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                      }}>
                      <View style={{flex: 1}}>
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
                                color:'#3F3F3F',
                              },
                            ]}>
                            {moment(item?.created_at).format('YYYY-MM-DD')}
                          </Text>
                        </View>

                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
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
                            {item?.phone}
                          </Text>
                        </View>
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
                  fontSize:16,
                }}
               
                labelStyle= {{
                  fontSize:16,
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
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column'}}>
                      <View style={{paddingHorizontal: 10, marginTop: 10}}>
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
                          textColor={'#444'}
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
                      <View style={{paddingHorizontal: 10, marginTop: 10}}>
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
                          textColor={'#444'}
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
                searchable={true}
                zIndexInverse={2000}
                open={directoryOpen}
                value={directoryValue}
                items={directoryItems}
                setOpen={setDirectoryOpen}
                setValue={setDirectoryValue}
                setItems={setDirectoryItems}
                placeholder="Select Department"
                listItemLabelStyle={{                  
                  fontSize:16,
                }}               
                labelStyle= {{
                  fontSize:16,
                }}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyles}
                onChangeValue={value => {
                  let data = {key: 'dir', Value: value};
                  if (appliedFilters.length > 0) {
                    let obj = appliedFilters.find(o => o.key == 'dir');
                    if (!obj) {
                      setappliedFilters(prev => [...prev, data]);
                      return;
                    }
                    const nextCounters = appliedFilters.map((c, i) => {
                      if (c.key == 'dir') {
                        // Increment the clicked counter
                        return {key: 'dir', Value: value};
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
                listMode="MODAL"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 35,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsListEnd(false);
                  setOffset(1);
                  setSearchKey('');
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appLogoStyle: {
    width: 100,
    height: 30,
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
    margin: 10,
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
    color: Theme.black,
    padding: 7,
    width: '92%',
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
    marginHorizontal: 10,
  },
  searchIcon: {
    paddingLeft:3
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
    marginHorizontal: 10,
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
    // zIndex: 99999,
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
});

export default Homepage;
