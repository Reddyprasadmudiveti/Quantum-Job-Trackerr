# Toast Notification System

## Overview

This project uses `react-hot-toast` for displaying toast notifications. A custom utility wrapper has been created to ensure consistent styling and behavior across the application.

## Usage

### Import the Toast Utility

```javascript
import toast from '../utils/toast';
```

### Available Methods

#### Success Toast

```javascript
toast.success('Operation completed successfully!');
```

#### Error Toast

```javascript
toast.error('Something went wrong!');
```

#### Info Toast

```javascript
toast.info('New updates are available');
```

#### Warning Toast

```javascript
toast.warning('Your session will expire soon');
```

#### Loading Toast

```javascript
const toastId = toast.loading('Processing your request...');

// Later, when the operation is complete:
toast.dismiss(toastId);
toast.success('Request processed successfully!');
```

#### Dismiss Toasts

```javascript
// Dismiss a specific toast
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismissAll();
```

### Customization

Each toast method accepts an optional options object as a second parameter:

```javascript
toast.success('Message', {
  duration: 5000, // Duration in milliseconds
  position: 'bottom-center', // Change position
  // Other react-hot-toast options
});
```

## Example Component

An example component demonstrating all toast types is available at:

```
src/components/ToastExample.jsx
```

You can include this component in any page for testing or demonstration purposes.

## Implementation Details

The toast utility is implemented in:

```
src/utils/toast.js
```

The global Toaster component is included in the main App component:

```
src/App.jsx
```

## Best Practices

1. Use appropriate toast types for different scenarios:
   - `success` for successful operations
   - `error` for errors and failures
   - `info` for informational messages
   - `warning` for warnings and cautions
   - `loading` for operations in progress

2. Keep toast messages concise and clear

3. Use consistent language and tone across all toast messages

4. For operations that take time, use the loading toast pattern

5. Don't overuse toasts - only show them for important information