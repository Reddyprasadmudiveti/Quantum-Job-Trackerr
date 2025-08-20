import toast from 'react-hot-toast';

/**
 * Utility functions for displaying toast notifications
 * Using react-hot-toast library
 */

// Success toast with default duration of 3 seconds
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    position: 'top-center',
    ...options,
  });
};

// Error toast with default duration of 4 seconds
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    position: 'top-center',
    ...options,
  });
};

// Info toast with default duration of 3 seconds
export const showInfo = (message, options = {}) => {
  return toast(message, {
    duration: 3000,
    position: 'top-center',
    icon: '🔔',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
    ...options,
  });
};

// Warning toast with default duration of 4 seconds
export const showWarning = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    position: 'top-center',
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
    ...options,
  });
};

// Loading toast that can be updated later
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    position: 'top-center',
    ...options,
  });
};

// Dismiss a specific toast by ID
export const dismiss = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAll = () => {
  toast.dismiss();
};