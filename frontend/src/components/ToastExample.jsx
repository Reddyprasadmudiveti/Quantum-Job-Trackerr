import React from 'react';
import { showSuccess, showError, showInfo, showWarning, showLoading, dismiss, dismissAll } from '../utils/toast';

/**
 * Example component demonstrating how to use the toast utility
 */
const ToastExample = () => {
  // Function to show different types of toast notifications
  const showToastExamples = () => {
    // Success toast
    showSuccess('Operation completed successfully!');
    
    // Error toast - delayed to show one at a time
    setTimeout(() => {
      showError('Something went wrong!');
    }, 1500);
    
    // Info toast - delayed to show one at a time
    setTimeout(() => {
      showInfo('New updates are available');
    }, 3000);
    
    // Warning toast - delayed to show one at a time
    setTimeout(() => {
      showWarning('Your session will expire soon');
    }, 4500);
  };

  // Function to demonstrate loading toast with promise
  const showLoadingToast = () => {
    // Show loading toast
    const loadingToastId = showLoading('Processing your request...');
    
    // Simulate async operation
    setTimeout(() => {
      // Dismiss loading toast and show success
      dismiss(loadingToastId);
      showSuccess('Request processed successfully!');
    }, 3000);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-md flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white">Toast Notification Examples</h2>
      
      <div className="flex flex-col gap-2">
        <button
          onClick={showToastExamples}
          className="px-4 py-2 bg-gradient-to-r from-green-500/70 to-blue-500/70 text-white rounded-lg hover:from-green-400/80 hover:to-blue-400/80 transition-all duration-300"
        >
          Show Toast Examples
        </button>
        
        <button
          onClick={showLoadingToast}
          className="px-4 py-2 bg-gradient-to-r from-purple-500/70 to-pink-500/70 text-white rounded-lg hover:from-purple-400/80 hover:to-pink-400/80 transition-all duration-300"
        >
          Show Loading Toast
        </button>
        
        <button
          onClick={dismissAll}
          className="px-4 py-2 bg-gradient-to-r from-red-500/70 to-orange-500/70 text-white rounded-lg hover:from-red-400/80 hover:to-orange-400/80 transition-all duration-300"
        >
          Dismiss All Toasts
        </button>
      </div>
      
      <div className="text-white/80 text-sm mt-2">
        <p>Click the buttons above to see different toast notifications in action.</p>
        <p className="mt-1">The toast utility provides consistent styling and behavior across the application.</p>
      </div>
    </div>
  );
};

export default ToastExample;