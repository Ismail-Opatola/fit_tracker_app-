export const RECEIVE_ENRTIES = "RECEIVE_ENTRIES";
export const ADD_ENTRY = "ADD_ENTRY";

export function receiveEntries(entries) {
  return {
    type: RECEIVE_ENRTIES,
    entries
  };
}

export function addEntry(entry) {
  return {
    type: ADD_ENTRY,
    entry
  };
}
