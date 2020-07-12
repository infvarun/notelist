import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import ListItem from './ListItem.component';

const STORAGE_KEY = '@goals';

export default function SearchResult(props) {

    const [goalSearchedList, setGoalSearchedList] = useState([]);

    // retrive data from AsyncStorage
    const retrieveData = async() => {
        try {
            const retrievedItem =  await AsyncStorage.getItem(STORAGE_KEY);
            const item = JSON.parse(retrievedItem);
            const filteredItem = item.filter(i => i.value.toLowerCase().includes(props.route.params.searchText.toLowerCase()));
            setGoalSearchedList(filteredItem);
            console.log(filteredItem);
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
                    <Text style={{color: 'white', fontSize: 15}}>Searched:</Text>
                </View>
                
                <View style={{backgroundColor: 'yellow', marginLeft: 10, borderRadius: 5, padding: 4}}>
                    <Text style={{color: 'black'}}>{props.route.params.searchText}</Text>
                </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <ListItem items={goalSearchedList} onDelete={deleteItem}/>
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