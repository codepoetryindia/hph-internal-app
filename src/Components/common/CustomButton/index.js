import React from 'react';
import {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Color from '../../../Assets/Themes/Color';

import styles from './styles';

const CustomButton = ({
  title,
  disabled,
  Loading,
  secondary,
  primary,
  danger,
  onPress,
}) => {
  const [focused, setFocused] = useState(false);

  const getBgColor = () => {
    if (disabled) {
      return Color.gray;
    }
    if (primary) {
      return Color.primary;
    }
    if (secondary) {
      return Color.secondary;
    }
    if (danger) {
      return Color.danger;
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.wrapper, {backgroundColor: getBgColor()}]}>
        <View style={styles.loaderSection}>
          {Loading && (
            <ActivityIndicator
              color={primary ? Color.secondary : Color.primary}
            />
          )}
          {title && (
            <Text
              style={{
                color: disabled ? 'black' : Color.white,
                paddingLeft: Loading ? 5 : 0,
              }}>
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};
export default CustomButton;
