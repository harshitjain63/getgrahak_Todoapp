import React, { useEffect, useState } from 'react';
import Mainnav from './navigator';
import AuthNavigator from './authNavigator';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';

// Define the type for the user state
type UserType = FirebaseAuthTypes.User | null;

const AppContainer: React.FC = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<UserType>(null);

    useEffect(() => {
        const onAuthStateChange = (user: UserType) => {
            setUser(user);
            if (initializing) setInitializing(false);
        };

        const subscriber = auth().onAuthStateChanged(onAuthStateChange);
        return () => subscriber(); // Unsubscribe when the component unmounts
    }, [initializing]);

    if (initializing) return null;

    return (
        <NavigationContainer>
            {user ? <Mainnav /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppContainer;
