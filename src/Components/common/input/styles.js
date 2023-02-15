import {StyleSheet} from 'react-native';
import Color from '../../../Assets/Themes/Color';


export default StyleSheet.create({
  inputContainer: {
    paddingVertical: 12,
  },
  wrapper: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    paddingHorizontal: 5,
    // alignItems:"center",
    marginTop:5 },
  textInput: {    
    wiight:"100%",
    flex: 1,
  },
  error:{
    color:Color.danger,
    paddingTop:4,
    fontSize:12
  }
});
