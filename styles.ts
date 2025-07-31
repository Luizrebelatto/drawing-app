import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    canvas: {
      flex: 1,
      backgroundColor: 'white',
    },
    colorPicker: {
      padding: 10,
      backgroundColor: 'gray',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      flexWrap: 'wrap',
    },
    sliderContainer: {
      marginTop: 10,
      alignItems: 'center',
    },
    colorButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginHorizontal: 4,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedColor: {
      borderColor: '#000',
    },
    eraserButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginHorizontal: 4,
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedEraser: {
      backgroundColor: '#ccc',
    },
    eraserText: {
      fontWeight: 'bold',
      color: '#000',
    },
    thicknessButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginHorizontal: 4,
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
   
    sliderTrack: {
      width: 40,
      height: 100,
      backgroundColor: '#ddd',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
    },
    sliderIndicator: {
      width: 20,
      backgroundColor: '#333',
      borderRadius: 10,
    },
    strokeLabel: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
  