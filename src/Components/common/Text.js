import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';

export default props => (
  <Text
    {...props}
    style={[
      {
        fontFamily: props.Bold ? 'OpenSans-Bold' : 'OpenSans-Regular',       
      },
      props.style,
    ]}>
    {props.children}
  </Text>
);
