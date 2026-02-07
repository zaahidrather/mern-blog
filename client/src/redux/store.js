import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import themeReducer from './theme/themeSlice';

const rootPersistConfig = {
	key: 'root',
	storage,
	// This tells Redux Persist to save 'user' and 'theme'
	whitelist: ['user', 'theme'],
};

const rootReducer = combineReducers({
	user: userReducer, // We will handle its specific blacklist inside the slice or via a nested persist if needed
	theme: themeReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
