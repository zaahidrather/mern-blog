import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	currentUser: null,
	error: null,
	loading: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// --------------------------------- Auth ----------------------------
		signInStart: (state) => {
			console.log('sign in start');
			state.loading = true;
			state.error = null; // Maybe we've an error previously , setting that to null
		},

		signInSuccess: (state, action) => {
			console.log('sign in success');
			// console.log('action.payload', action.payload);
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		signInFailure: (state, action) => {
			console.log('sign in failure');
			// console.log('action.payload', action.payload);
			state.loading = false;
			state.error = action.payload;
		},
		// --------------------------------- User ----------------------------
		updateProfileStart: (state) => {
			console.log('update profile start');
			state.loading = true;
			state.error = null;
		},
		updateProfileSuccess: (state, action) => {
			console.log('update profile success');
			// console.log('action.payload', action.payload);
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		updateProfileFailure: (state, action) => {
			console.log('update profile failure');
			// console.log('action.payload', action.payload);
			state.loading = false;
			state.error = action.payload;
		},
		clearError: (state) => {
			console.log('Clear error triggered');
			state.error = false;
		},
		deleteUserStart: (state) => {
			console.log('deleteUserStart triggered');
			state.loading = true;
			state.error = false;
		},
		deleteUserSuccess: (state) => {
			console.log('deleteUserSuccess triggered');
			state.currentUser = null;
			state.loading = false;
			state.error = false;
		},
		deleteUserFailure: (state, action) => {
			console.log('deleteUserFailure triggered');
			state.loading = false;
			state.error = action.payload;
		},
		signoutSuccess: (state) => {
			console.log('signout triggered');
			state.currentUser = null;
			state.loading = false;
			state.error = null;
		},
		// --------------------------------- Posts ----------------------------
		updatePostFailure: (state, action) => {
			console.log('Update post failure');
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const {
	signInStart,
	signInSuccess,
	signInFailure,
	updateProfileStart,
	updateProfileSuccess,
	updateProfileFailure,
	clearError,
	deleteUserStart,
	deleteUserSuccess,
	deleteUserFailure,
	signoutSuccess,
	updatePostFailure,
} = userSlice.actions;

export default userSlice.reducer;
