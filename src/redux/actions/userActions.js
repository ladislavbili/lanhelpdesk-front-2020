import {SET_USER_DATA, SET_USER_ID, DELETE_USER_DATA, SET_USER_NOTIFICATIONS, SET_USER_STATUSES } from '../types';
import { database } from '../../index.js';
import { snapshotToArray } from '../../helperFunctions';


export const setUserID = (id) => {
   return (dispatch) => {
     dispatch({ type: SET_USER_ID,id });
   };
};

export const deleteUserData = () => {
  return (dispatch) => {
    dispatch({ type: DELETE_USER_DATA });
  };
};

export const setUserData = (userData) => {
  return (dispatch) => {
    dispatch({ type: SET_USER_DATA, userData });
  };
};

export const startUsersNotifications = (userID) => {
  return (dispatch) => {
    database.collection('user_notifications').where("user", "==", userID).onSnapshot(querySnapshot => {
      dispatch({ type: SET_USER_NOTIFICATIONS, notifications:snapshotToArray(querySnapshot).sort((item1, item2)=> (item1.createdAt > item2.createdAt) ? -1 : 1 )});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });
  };
};

export const setUserFilterStatuses = (statuses) => {
  return (dispatch) => {
    dispatch({ type: SET_USER_STATUSES, statuses });
  };
};
