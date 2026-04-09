import React from 'react';

const Loader = () => {
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div
				style={{
					width: '50px',
					height: '50px',
					borderRadius: '50%',
					background: 'conic-gradient(#0000 10%, #6366f1)',
					WebkitMask: 'radial-gradient(farthest-side, #0000 calc(100% - 5px), #000 0)',
					animation: 'spin 1s infinite linear',
				}}
			>
				<style>{`
        @keyframes spin {
          to { transform: rotate(1turn); }
        }
      `}</style>
			</div>
		</div>
	);
};

export default Loader;
