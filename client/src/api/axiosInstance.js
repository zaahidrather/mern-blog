import axios from 'axios';
import { store } from '../redux/store.js';
import { signoutSuccess } from '../redux/user/userSlice.js';
import toast from 'react-hot-toast';

const api = axios.create({
	baseURL: '/api', // Prepend /api to all requests
	withCredentials: true,
});

// Request Interceptor (Optional: Add headers before request)
// api.interceptors.request.use((config) => config);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If 401 and we haven't tried to refresh yet
		if (
			error.response.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes('/auth/refresh')
		) {
			originalRequest._retry = true;
			try {
				console.log('Refresh token endpoint');
				// Call the refresh endpoint
				await api.post('/auth/refresh');
				// If successful, re-run the original request that failed!
				return api(originalRequest);
			} catch {
				console.log('Refresh token endpoint retry failed');
				// If refresh also fails, then log out
				store.dispatch(signoutSuccess());
				toast.error('Your session has expired. Please sign in again.');
			}
		}
		return Promise.reject(error);
	},
);

export default api;
