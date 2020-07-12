import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';

export default function AddItem (props) {

  return (
    <>
        <TextInput autoFocus={true} placeholder="Set Goal" placeholderTextColor="#eeee" style={styles.inp} onChangeText={props.inputHandler} value={props.val}/>
        <TouchableOpacity
            style={styles.addButton}
            onPress={props.addHandler}>
            <Text style={{color: "white", fontSize: 20}}>ADD NOTE</Text>
        </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  inp: {
    borderColor: "#e7305b",
    borderWidth: 1,
    borderRadius: 5,
    width: "85%",
    padding: 5, 
    marginRight: 5,
    fontSize: 20,
    color: "#e7305b",
    fontWeight: "bold"
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#e7305b",
    width: "85%",
    padding: 8,
    marginRight: 5,
    marginTop: 10,
    borderRadius: 5
  }

});
