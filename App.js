import React from 'react';
import Main from "./Main";
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchResult from './SearchResult';
import StarredResult from './StarredResult';

const Stack = createStackNavigator();

export default function App() {

  return (
    <>
    <StatusBar backgroundColor="#e7305b" barStyle="light-content" />
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="Home"
            component={Main}
            options={{ 
              title: 'EasyNotes',
              headerTitleStyle: {
                color: 'white',
                fontSize: 17
              },
              headerStyle: {
                backgroundColor: '#e7305b'
              } 
          }}
        />
        <Stack.Screen
            name="Search"
            component={SearchResult}
            options={{ 
              title: 'EasyNotes',
              headerTitleStyle: {
                color: 'white',
                fontSize: 17
              },
              headerStyle: {
                backgroundColor: '#e7305b'
              },
              headerTintColor: '#fff',
          }}
        />
      <Stack.Screen
            name="Starred"
            component={StarredResult}
            options={{ 
              title: 'EasyNotes',
              headerTitleStyle: {
                color: 'white',
                fontSize: 17
              },
              headerStyle: {
                backgroundColor: '#e7305b'
              },
              headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}


