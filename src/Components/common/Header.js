import { View, Image,StyleSheet } from 'react-native'
import React from 'react'
import Text from './Text'
import Theme from './Theme'
import { GlobalFontSize } from './CustomText'

const Header = ({name}) => {
  return (
    <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 18,
              paddingVertical: 20,
              backgroundColor: Theme.white,
            }}>
            <Image
              source={require('../../Assets/Images/AppLogo.png')}
              style={styles.appLogoStyle}
              resizeMode="contain"
            />
            <Text
              style={{
                color: Theme.secondary,
                fontSize: GlobalFontSize.H2,
                fontWeight: '700',
                marginLeft: -90,
              }}>
              {name}
            </Text>
            <View>
              <Text></Text>
            </View>
          </View>
  )
}

const styles = StyleSheet.create({
    appLogoStyle: {
      width: 80,
      height: 40,
    },  
  });

export default Header