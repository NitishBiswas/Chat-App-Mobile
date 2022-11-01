/* eslint-disable prettier/prettier */
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen component={SplashScreen} name="Splash" options={{
        headerShown: false,
      }} />
      <Stack.Screen component={LoginScreen} name="Login" options={{
        headerShown: false,
      }} />
      <Stack.Screen component={SignupScreen} name="Signup" options={{
        headerShown: false,
      }} />
      <Stack.Screen component={HomeScreen} name="Home" options={{
        headerShown: false,
      }} />
      <Stack.Screen component={ChatScreen} name="Chat" options={{
        headerShown: false,
      }} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="orange" />
      <NavigationContainer>{StackNavigator()}</NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
