import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'notes';

export const saveNotes = async (notes: any[]) => {
  try {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes', error);
  }
};

export const getNotes = async () => {
  try {
    const notes = await AsyncStorage.getItem(NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Failed to fetch notes', error);
    return [];
  }
};
