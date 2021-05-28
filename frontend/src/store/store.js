import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import userReducer from "../features/user/userSlice";

const reducers = combineReducers({
  userReducer,
});

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const pReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: pReducer,
});

export default store;
