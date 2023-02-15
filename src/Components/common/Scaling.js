import {Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const horizontalScale = (size, factor = 0.5) => {
  if (Platform.OS === 'web') {
    factor = 0.1;
  }
  return size + (scale(size) - size) * factor;
};

export {scale, verticalScale, horizontalScale};
