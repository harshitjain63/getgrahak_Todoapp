import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../src/screen/Login';
import SignUp from '../src/screen/SignUp';

// Define the type for the navigation stack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
