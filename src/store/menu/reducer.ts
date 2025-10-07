import { MenuActionTypes } from "./actionTypes";

export const INIT_STATE: any = {
  toplevel_linke_menu: [],
  menu_items: [],
  order_type: 'pickup',
  error: {},
  loading: false,
  success: false,
};

const menu = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case MenuActionTypes.SET_TOPLEVEL_LINKED_MENU:
      return {
        ...state,
        toplevel_linke_menu: action.payload,
      };
    case MenuActionTypes.SET_ALL_MENU_ITEM:
      return {
        ...state,
        menu_items: action.payload,
      };
    case MenuActionTypes.SET_ORDER_TYPE:
      return {
        ...state,
        order_type: action.payload,
      };
    default:
      return state;
  }
};

export default menu;
