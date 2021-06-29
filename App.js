import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import UserStack from './navigation/stack';
export default function App(){

  return(
    <UserStack />
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
})
