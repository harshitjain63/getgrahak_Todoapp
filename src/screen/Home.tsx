import React, { useState, useEffect } from 'react';
import { Auth } from './services';
import { AuthStackParamList } from '../../navigator/authNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import RNFS from 'react-native-fs';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
    id: number;
    name: string;
};

type SimpleTodoProps = {
    navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
  };

const SimpleTodo: React.FC <SimpleTodoProps> = ({navigation}) => {
    const [task, setTask] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const userId = auth().currentUser?.uid; // Get the current user's UID
    const dbRef = userId ? database().ref(`Root/${userId}/todos`) : null;

    const exportToTxt = async (tasks: Task[]) => {
        try {
            const tasksText = tasks.map(task => `ID: ${task.id}, Name: ${task.name}`).join('\n');
            const path = `${RNFS.DocumentDirectoryPath}/tasks.txt`;
            await RNFS.writeFile(path, tasksText, 'utf8');
            console.log('File written to:', path);
        } catch (error) {
            console.error('Error writing file:', error);
        }
    };

    const handleSignOut = async () => {
        try {
          await Auth.signOut();
          // Navigate to Login screen or any other screen
          navigation.navigate('Login');
        } catch (error) {
          console.error('Sign Out Error:', error);
        }
      };


    useEffect(() => {
        // Load tasks from AsyncStorage when the component mounts
        const loadTasks = async () => {
            try {
                const storedTasks = await AsyncStorage.getItem('tasks');
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                }
            } catch (error) {
                console.error('Failed to load tasks from AsyncStorage:', error);
            }
        };

        loadTasks();
    }, []);

    useEffect(() => {
        // Save tasks to AsyncStorage whenever tasks state changes
        const saveTasks = async () => {
            try {
                await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            } catch (error) {
                console.error('Failed to save tasks to AsyncStorage:', error);
            }
        };

        saveTasks();
    }, [tasks]);

    useEffect(() => {
        // Sync tasks with Firebase Realtime Database
        if (dbRef) {
            const onValueChange = dbRef.on('value', snapshot => {
                const data = snapshot.val();
                if (data) {
                    const tasksArray = Object.keys(data).map(key => ({
                        // Convert Firebase ID (string) to number
                        id: parseInt(key, 10),
                        name: data[key].name,
                    }));
                   // setTasks(tasksArray);
                }
            });
            return () => dbRef.off('value', onValueChange);
        }
    }, [dbRef]);

    const handleAddTask = () => {
        if (task) {
            const newTask = { id: Date.now().toString(), name: task };
            if (editIndex !== null) {
                const updatedTasks = tasks.map((t, index) =>
                    index === editIndex ? { ...t, name: task } : t
                );
                setTasks(updatedTasks);
                dbRef?.child(tasks[editIndex].id.toString()).set(newTask);
                setEditIndex(null);
            } else {
                setTasks([...tasks, { id: Date.now(), name: task }]);
                dbRef?.child(newTask.id).set(newTask);
            }
            setTask('');
        }
    };

    const handleEditTask = (index: number) => {
        setTask(tasks[index].name);
        setEditIndex(index);
    };

    const handleDeleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
        dbRef?.child(id.toString()).remove();
    };

    const filteredTasks = tasks.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Simple Todo App</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Search tasks..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <TextInput
                style={styles.input}
                placeholder="Enter task"
                value={task}
                onChangeText={setTask}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTask}
            >
                <Text style={styles.addButtonText}>
                    {editIndex !== null ? 'Update Task' : 'Add Task'}
                </Text>
            </TouchableOpacity>

            <FlatList
                data={filteredTasks}
                renderItem={({ item, index }) => (
                    <View style={styles.taskContainer}>
                        <Text style={styles.taskText}>{item.name}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => handleEditTask(index)}>
                                <Text style={styles.editButton}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                                <Text style={styles.deleteButton}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
             <Button title="Export to TXT" onPress={() => exportToTxt(tasks)} />
             <Button title="Logout" onPress={handleSignOut} color="#f00" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    taskText: {
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    editButton: {
        marginRight: 10,
        color: 'green',
        fontWeight: 'bold',
    },
    deleteButton: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default SimpleTodo;
