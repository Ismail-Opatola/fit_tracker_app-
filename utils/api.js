import AsyncStorage from '@react-native-community/async-storage';
import { CALENDAR_STORAGE_KEY } from "./_calendar";

// Submit a new entry for the day
export function submitEntry({ key, entry }) {
  // Add it to DB
  return AsyncStorage.mergeItem(
    CALENDAR_STORAGE_KEY,
    JSON.stringify({ [key]: entry })
  );
}

export function removeEntry(key) {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then(results => {
    const data = JSON.parse(results);
    data[key] = undefined;
    delete data[key];
    AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
  });
}
