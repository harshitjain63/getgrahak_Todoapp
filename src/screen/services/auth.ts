import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const signUp = async (fullname: string, email: string, password: string): Promise<string | void> => {
    if (!fullname || !email || !password) {
        Alert.alert('Error', 'Please enter all fields');
        return;
    }

    try {
        const cred = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const { uid } = cred.user!;

        // Update user profile
        await auth().currentUser?.updateProfile({
            displayName: fullname,
        });

        return uid;
    } catch (err) {
        // Error handling
        if (err instanceof Error) {
            Alert.alert('Sign Up Error', err.message);
        } else {
            Alert.alert('Sign Up Error', 'An unexpected error occurred');
        }
    }
};

const signIn = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
        Alert.alert('Error', 'Please enter all fields');
        return;
    }

    try {
        await auth().signInWithEmailAndPassword(email.trim(), password);
        console.log('Sign-in successful');
    } catch (err) {
        if (err instanceof Error) {
            Alert.alert('Sign In Error', err.message);
        } else {
            Alert.alert('Sign In Error', 'An unexpected error occurred');
        }
    }
};

const signOut = async (): Promise<void> => {
    try {
        await auth().signOut();
        console.log('Sign-out successful');
    } catch (err) {
        if (err instanceof Error) {
            Alert.alert('Sign Out Error', err.message);
        } else {
            Alert.alert('Sign Out Error', 'An unexpected error occurred');
        }
    }
};

const Auth = {
    signUp,
    signIn,
    signOut,
};

export default Auth;
