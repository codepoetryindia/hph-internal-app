import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Feather from 'react-native-vector-icons/Feather';
import { GlobalFontSize } from './CustomText';
const NavigationHeaders = ({onPress, title, inlineStyle}) => {
  return (
    <View style={[styles.header, {backgroundColor: '#fff'}]}>
      <Feather
        name="chevron-left"
        color="#000"
        size={25}
        style={{paddingLeft: 15}}
        onPress={onPress}
      />
      <Text style={[styles.txetHeader, {...inlineStyle}]}>{title}</Text>
      <Text style={[styles.txetHeader, {}]}></Text>
    </View>
  );
};

export default NavigationHeaders;

const styles = StyleSheet.create({
  header: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    shadowColor: '#000',
    shadowOffset: {width: 15, height: 15},
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  txetHeader: {
    fontWeight: 'bold',
    fontFamily: 'OpenSans-RegularBold',
    color: '#008EAA',
    fontSize: GlobalFontSize.H2,
    fontWeight: '800',
    marginRight: 20,
  },
});
