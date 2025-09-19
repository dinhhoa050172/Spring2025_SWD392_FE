// src/components/ServiceList/LoadingSpinner.jsx
const LoadingSpinner = () => {
    return (
        <div className="flex h-screen justify-center items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;