import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, Clipboard, Dimensions, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Audio } from 'expo-av';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get("window");

// for storing keys of starred notes - AsyncStorage
const STAR_KEY = '@star';

export default function ListItem(props) {

  // Hook for saving array of keys of notes/goals which are starred
  const [starredList, setStarredList] = useState(["dummy"]);

  // Copy function for clipboard
  const copyToClipboard = (val) => {
    Clipboard.setString(val);
    ToastAndroid.show("Notes copied 📋", ToastAndroid.SHORT);
  }

  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Generate custom date
  const getCustomDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.getDate() + '-' + 
      month[date.getMonth()] + '-' + 
      date.getFullYear() + ' ' + 
      date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds()
    )
  } 

  // play confirmation tune
  const confirmTune = async() => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('./assets/starred.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

   // Handler for Add button
   const pressStarHandler = (pressedNote) => {
    if(starredList != null) {
      if(starredList.includes(pressedNote)) {
        // If starred note clicked again then remove from starred with confirmation
        unStarHandler(pressedNote);
      } else {
        setStarredList(currentStarred => ((currentStarred) ? [...currentStarred, pressedNote] : [pressedNote]), saveData());
      }
    } else {
      setStarredList(currentStarred => ((currentStarred) ? [...currentStarred, pressedNote] : [pressedNote]), saveData());
    }
    // save crrent state to Async storage now to keep everything synchronized
  }

  // Handler for delete starred key when user tap on corresponding note star item
  const unStarHandler = (noteId) => {
    Alert.alert(
      "⭐ Remove from favourite",
      "Remove this note from your favourite list?",
      [
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => 
          {
            setStarredList(currentStarred => {
              return currentStarred.filter(item => item !== noteId);
            }, saveData());
          }
        }
      ],
      { cancelable: false }
    );
  }

  // Save data to AsyncStorage
  const saveData = async() => {
    try {
      //we want to wait for the Promise returned by AsyncStorage.setItem()
      //to be resolved to the actual value before returning the value
      await AsyncStorage.setItem(STAR_KEY, JSON.stringify(starredList)).then(
        () => {
          confirmTune();
        }
      );
    } catch (error) {
      ToastAndroid.show("Error occured while starring note!");
      console.log(error.message);
    }
  }

  // retrive data from AsyncStorage
  const retrieveData = async() => {
    try {
      const retrievedItem =  await AsyncStorage.getItem(STAR_KEY);
      const item = JSON.parse(retrievedItem);
      setStarredList(item);
    } catch (error) {
      console.log(error.message);
    }
    return;
  }

  // get star color
  const starColor = (noteId) => {
    if(starredList != null) {
      if(starredList.includes(noteId)) {
        return "#ffa931";
      } else {
        return "#4a3f35";
      }
    } else {
      return "#4a3f35";
    }
  }

  // ComponentDidMount
  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <FlatList style={styles.itemList} data={props.items} ListEmptyComponent={NoResultFound} renderItem={itemData => (
        <TouchableOpacity onLongPress={()=>props.onDelete(itemData.item.key)} onPress={() => copyToClipboard(itemData.item.value)}>
            <View style={styles.listItems}>
              
              <Text style={styles.listText}>{itemData.item.value}</Text>
              <View style={{marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={{ color: '#e7305b', fontSize: 9}}>
                  { getCustomDate(itemData.item.time) }
                </Text>
                <Icon
                  name='star'
                  type='font-awesome'
                  color={starColor(itemData.item.key)}
                  size={23}
                  onPress={() => pressStarHandler(itemData.item.key)}
                />
              </View>
            </View>
        </TouchableOpacity>
    )} />
  );
  
}

// Component to be displayed when list is empty
const NoResultFound = () => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
      <Text style={{fontSize: 20, color: 'white'}}>No Notes found!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  listItems: {
    padding: 10,
    borderColor: "#e7305b",
    borderWidth: 1,
    borderRadius: 5,
    width: width - 40,
    marginVertical: 10,
    marginHorizontal: 20
  },
  listText: {
    fontSize: 15,
    color: "#dee1ec",
  },
  itemList: {
      borderTopWidth: 1,
      borderTopColor: "#454d66", 
      marginTop: 20,
    }
  
});