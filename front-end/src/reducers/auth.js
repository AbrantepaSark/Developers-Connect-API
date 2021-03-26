import { REGISTER_SUCCESS, REGISTER_FAIL } from "../actions/types";

const initState = {};

export default function (state = initState, actions) {
  const { type, payload } = actions;
  switch (type) {
    case REGISTER_SUCCESS:

    default:
      return state;
  }
}
