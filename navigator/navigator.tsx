import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../src/screen/Home';

// Define the type for the navigation stack
export type MainStackParamList = {
  Home: undefined; // No parameters expected for Home screen
};

const Stack = createStackNavigator<MainStackParamList>();

const Mainnav: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }} // Optionally hide the header
      />
    </Stack.Navigator>
  );
};

export default Mainnav;
