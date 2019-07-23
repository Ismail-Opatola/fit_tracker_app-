import { RECEIVE_ENRTIES, ADD_ENTRY } from "../actions";

function entries(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ENRTIES:
      return {
          ...state,
          ...action.entries
      };
    case ADD_ENTRY:
      return {
          ...state,
          ...action.entry
      };
    default:
      return state;
  }
}

export default entries