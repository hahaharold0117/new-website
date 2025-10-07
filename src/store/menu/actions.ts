import { MenuActionTypes } from "./actionTypes";

export const setToplevelLinkedMenu = (data) => ({
  type: MenuActionTypes.SET_TOPLEVEL_LINKED_MENU,
  payload: data
});

export const setAllMenuItem = (data) => ({
  type: MenuActionTypes.SET_ALL_MENU_ITEM,
  payload: data
});


