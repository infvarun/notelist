import React, {useState, useEffect} from 'react';
import shortid from 'shortid';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, Alert, Modal, Text, TouchableOpacity, StatusBar, Dimensions, ToastAndroid} from 'react-native';
import { Audio } from 'expo-av';
import { Icon, SearchBar } from 'react-native-elements';
import AddItem from './AddItem.component';
import ListItem from './ListItem.component';

const {height, width} = Dimensions.get("window");

// for storage - AsyncStorage
const STORAGE_KEY = '@goals';

export default function Main({navigation}) {

  // Hook for user entered goal
  const [enteredGoals, setEnteredGoals] = useState('');
  // Hook for list of goals
  const [goalList, setGoalList] = useState([]);
  // Hook for show/hide of Add goal modal
  const [displayGoalModal, setDisplayGoalModal] = useState(false);
  // Hook for search
  const [searchText, setSearchText] = useState('');

  // play confirmation tune
  const confirmTune = async() => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('./assets/saved.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  // Save data to AsyncStorage
  const saveData = async() => {
    try {
      //we want to wait for the Promise returned by AsyncStorage.setItem()
      //to be resolved to the actual value before returning the value
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goalList)).then(
        () => {
          confirmTune();
          ToastAndroid.show("Yay! Notes Saved 🚀", ToastAndroid.SHORT);
        }
      );
    } catch (error) {
      Alert.alert("Error occured while saving notes!");
      console.log(error.message);
    }
  }

  // retrive data from AsyncStorage
  const retrieveData = async() => {
    try {
      const retrievedItem =  await AsyncStorage.getItem(STORAGE_KEY);
      const item = JSON.parse(retrievedItem);
      setGoalList(item);
    } catch (error) {
      console.log(error.message);
    }
    return;
  }

  useEffect(() => {
    retrieveData(); 
  }, []);

  // Handler for User Input event
  const inputGoalHandler = (val) => {
    (val !== "") ? setEnteredGoals(val) : setEnteredGoals("");
  }

  // Handler for User Input event
  const inputSearchHandler = (val) => {
    setSearchText(val);
  }

  // Handler for Add button
  const addGoalHandler = () => {
    if(enteredGoals !== "") {
      setGoalList(currentGoals => (
        (currentGoals) ? 
        [{key: shortid.generate(), value: enteredGoals, time: new Date()}, ...currentGoals] :
        [{key: shortid.generate(), value: enteredGoals}]));
      setDisplayGoalModal(false);
    }
    setEnteredGoals("");
  }

  // Handler for delete when user tap on goal item
  const deleteItem = (goalId) => {
    Alert.alert(
      "🗑 Delete Note",
      "Remove this note from your desk?",
      [
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => 
          {
            setGoalList(currentGoals => {
              return currentGoals.filter(goal => goal.key !== goalId);
            })
          }
        }
      ],
      { cancelable: false }
    );
  }

  // Search handler
  const searchHandler = () => {
    console.log("Searched: "+searchText);
    navigation.navigate('Search', {searchText});
  }

  // show starred handler
  const showStarredHandler = () => {
    navigation.navigate('Starred');
  }

  return (
    <View style={styles.screen}>

      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}}>
      <View style={{marginLeft: 20}}>
          <Icon
            raised
            name='save'
            type='font-awesome'
            color='#438a5e'
            size={20}
            onPress={() => saveData()}
          />
        </View>
        <View>
          <Icon
            raised
            name='plus'
            type='font-awesome'
            color='#e7305b'
            size={26}
            onPress={() => setDisplayGoalModal(true)}
          />
        </View>
        <View style={{marginRight: 20}}>
          <Icon
            raised
            name='star'
            type='font-awesome'
            color='#ffa931'
            size={20}
            onPress={showStarredHandler}
          />
        </View>
        
      </View>

      <View style={styles.searchView}>
        <SearchBar
          containerStyle={{borderRadius: 10, width: width - 100, marginRight: 20}}
          placeholder="Type Here..."
          onChangeText={inputSearchHandler}
          value={searchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchHandler}>
          <Icon name='search' color='white' />
        </TouchableOpacity>
      </View>
      
      <Modal visible={displayGoalModal} animationType="slide">
        <View style={styles.inputSection}>
          <AddItem inputHandler={inputGoalHandler} addHandler={addGoalHandler} val={enteredGoals}/>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setDisplayGoalModal(false)}>
            <Text style={{color: "#e7305b", fontSize: 20}}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      <ListItem items={goalList} onDelete={deleteItem}/>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 20,
    flex: 1, 
    backgroundColor: "#032d3c",
  },
  floatButton: {
    alignItems: "center",
    justifyContent:'center',
    backgroundColor: "#e7305b",
    height: 50,
    width: 50,
    borderRadius: 25
  },
  floatButtonTxt: {
    color: "white", 
    fontSize: 40, 
    fontWeight: "bold"
  },
  saveButton: {
    alignItems: "center",
    justifyContent:'center',
    backgroundColor: "#52de97",
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#111d5e'
  },
  searchButton: {
    alignItems: "center",
    justifyContent:'center',
    backgroundColor: "#52de97",
    height: 50,
    width: 50,
    borderRadius: 25, 
    marginRight: 30, 
    backgroundColor: '#373640',
  },
  searchView: {
    flexDirection: "row", 
    marginTop:20, 
    marginLeft: 30,
    justifyContent: "space-evenly", 
    alignItems: "center"
  },
  inputSection: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#032d3c"
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "white",
    width: "85%",
    padding: 8,
    marginRight: 5,
    marginTop: 10,
    borderRadius: 5
  }
  
});
