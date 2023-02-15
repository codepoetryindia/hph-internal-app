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
import {useFocusEffect} from '@react-navigation/native';
import ChangePassword from '../ChangePassword';
import Header from '../../Components/common/Header';
import moment from 'moment';

const Homepage = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [selected, setSelected] = useState('');
  const {appState, authContext} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [errorMassage, setErrorMassage] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  // Pagination Works
  const [allDoctors, setAllDoctors] = useState([]);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [SearchKey, setSearchKey] = useState('');
  const [status, setStatus] = useState(false);

  const token = appState.token;
  let UserData = appState.data;
  let verificationStatus = appState.status;

  const getData = (pullToRefresh = false, isSearchHappened = false) => {
    if (pullToRefresh) {
      setRefreshing(true);
    }

    if (pullToRefresh || (!scrollLoading && !isListEnd)) {
      console.log('getData', offset);
      setScrollLoading(true);
      GetRawurl(
        `api/v1/referrals?page=${
          pullToRefresh ? 1 : offset
        }&perPage=30&q=${SearchKey}`,
        token,
      )
        .then(Response => {
          console.log(Response);
          if (Response.data.success) {
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
                style={styles.InputStyle}
                placeholder="Search"
                placeholderTextColor={Theme.lightgray}
                onChangeText={setSearchKey}
                value={SearchKey}
              />

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
            </View>
          </View>

          <View styles={{}}>
            <FlatList
              data={allDoctors}
              style={{flexGrow: 1, marginBottom: 130}}
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
                              color: selected === item.id ? '#fff' : '#3F3F3F',
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
                                color:
                                  selected === item.id ? '#fff' : '#3F3F3F',
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
    paddingHorizontal: 7,
    opacity: 0.5,
  },
  InputStyle: {
    color: Theme.gray,
    fontWeight: '600',
    fontSize: GlobalFontSize.P,
    width: '75%',
    fontFamily: 'OpenSans-Regular',
    height: 40,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Homepage;
