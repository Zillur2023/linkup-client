import React from "react";

const NotAvailablePage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/"; // Replace with your home route
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black p-4">
      <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        {/* Icon */}
        <svg
          className="w-20 h-20 mx-auto mb-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Oops! This Content Isn&apos;t Available
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We’re sorry, but it seems this content has been restricted, removed,
          or is no longer accessible. If you believe this is a mistake, please
          contact support for assistance.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className=" bg-default-200 dark:bg-gray-700 text-gray-700 dark:text-white px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAvailablePage;
