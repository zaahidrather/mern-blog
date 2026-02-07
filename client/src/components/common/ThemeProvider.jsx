import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
	const theme = useSelector((state) => state.theme.mode);

	// return (
	//     <div className={theme}>
	//         <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
	//             {children}
	//         </div>
	//     </div>
	// )

	useEffect(() => {
		const root = document.documentElement; // <html>

		if (theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}, [theme]);

	return children;
}
