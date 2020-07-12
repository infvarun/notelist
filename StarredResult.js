import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import ListItem from './ListItem.component';

// for storing all notes - AsyncStorage
const STORAGE_KEY = '@goals';
// for storing keys of starred notes - AsyncStorage
const STAR_KEY = '@star';

export default function StarredResult() {

    // Final filtered List
    const [filteredList, setFilteredList] = useState([]);

    // retrive all starred data from AsyncStorage
    const retrieveData = async() => {
        try {
                const retrievedNotes =  await AsyncStorage.getItem(STORAGE_KEY);
                const retrievedStarKey =  await AsyncStorage.getItem(STAR_KEY);
                const notes = JSON.parse(retrievedNotes);
                const starKey = JSON.parse(retrievedStarKey);
                //setGoalSearchedList(item);
                //setStarredList(item);
                const starred = notes.filter(goal => starKey.includes(goal.key));
                setFilteredList(starred);
            } catch (error) {
            console.log(error.message);
        }
        return;
    }


    useEffect(() => {
        
        retrieveData();

    }, []);

    // Handler for delete when user tap on goal item
    const deleteItem = (goalId) => {
        /**Alert.alert(
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
        );**/
    }

    return(
        <View style={styles.screen}>
            <View style={{marginHorizontal: 30, flexDirection: 'row'}}>
                <View style={{padding: 4}}>
                    <Text style={{color: 'white', fontSize: 20}}>Starred Items</Text>
                </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <ListItem items={filteredList} onDelete={deleteItem}/>
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    screen: {
      paddingVertical: 20,
      flex: 1, 
      backgroundColor: "#032d3c",
    }
});