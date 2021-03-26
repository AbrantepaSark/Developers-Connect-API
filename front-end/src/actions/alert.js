import { v4 as uuidv4 } from "uuid";
import { ADD_ALERT, REMOVE_ALERT } from "./types";

export const addAlert = (msg, alertType) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: ADD_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  }, 5000);
};
