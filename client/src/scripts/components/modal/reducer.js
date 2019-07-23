import Immutable from "immutable";
import * as defs from "./defs";

export const initialState = Immutable.fromJS({
  [defs.PROP_MODALS]: {},
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onOpenModal: {
      document.body.classList.add("overflow");
      return state.setIn([defs.PROP_MODALS, action.value], true);
    }
    case defs.actionTypes.onCloseModal: {
      document.body.classList.remove("overflow");
      return state.setIn([defs.PROP_MODALS, action.value], false);
    }
    default: {
      return state;
    }
  }
};
