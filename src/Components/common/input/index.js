import React from 'react';
import {useState} from 'react';
import {View, TextInput, Text} from 'react-native'
import Color from '../../../Assets/Themes/Color';

import styles from './styles';

const Input = ({
  onChangeText,
  style,
  value,
  label,
  icon,
  iconPosition,
  error,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const getFlexDirection = () => {
    if (icon && iconPosition) {
      if (iconPosition === 'left') {
        return 'row';
      } else if (iconPosition === 'right') {
        return 'row-reverse';
      }
    }
  };

  const getBorderColor = () => {
    if (error) {
      return Color.danger;
    }
    if (focused) {
      return Color.primary;
    }
    else {
      Color.gray;
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        {label && <Text>{label}</Text>}
        <View
          style={[
            styles.wrapper,
            {alignItems: icon ? 'center' : 'baseline'},
            {borderColor: getBorderColor(), flexDirection: getFlexDirection()},
          ]}>
          <View>{icon && icon}</View>
          <TextInput
            style={[styles.textInput, style]}
            onChangeText={onChangeText}
            value={value}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
            {...props}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </>
  );
};
export default Input;
