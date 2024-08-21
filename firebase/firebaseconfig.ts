import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDuk4cCYOGRJSH7w_xjyfoRm1ug1Nu9cO4',
  authDomain: 'react-native-todo-f0029.firebaseapp.com',
  databaseURL: 'https://react-native-todo-f0029-default-rtdb.firebaseio.com',
  projectId: 'react-native-todo-f0029',
  storageBucket: 'react-native-todo-f0029.appspot.com',
  messagingSenderId: '991140542837',
  appId: '1:991140542837:android:05fee2700ce064a6137b3c',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// This will be updated in the component where you have the user ID
export const getUserTodosRef = (userId: string) => database().ref(`todos/${userId}`);
