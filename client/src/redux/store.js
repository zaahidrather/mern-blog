import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// 1. NESTED CONFIG: Put this here to control the "user" slice specifically
const userPersistConfig = {
  key: "user",
  storage,
  blacklist: ["error", "loading"],
};

// 2. WRAP THE REDUCER: Use persistReducer on the userReducer specifically
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
