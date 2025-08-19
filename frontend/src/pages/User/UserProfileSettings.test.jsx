import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import UserProfileSettings from './UserProfileSettings';
import { AuthContext } from '../../contexts/AuthContext';

// Mock axios
jest.mock('axios');

// Mock AuthContext
const mockLogin = jest.fn();
const mockUser = {
  _id: '123',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  profilePicture: 'https://example.com/profile.jpg'
};

const mockAuthContext = {
  user: mockUser,
  login: mockLogin,
  loading: false
};

describe('UserProfileSettings Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile settings form with user data', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <UserProfileSettings />
      </AuthContext.Provider>
    );

    // Check if profile section is rendered
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    
    // Check if form fields are populated with user data
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('Test');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('User');
    expect(screen.getByLabelText(/Profile Picture URL/i)).toHaveValue('https://example.com/profile.jpg');
  });

  test('validates profile form fields', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <UserProfileSettings />
      </AuthContext.Provider>
    );

    // Clear first name field
    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: '' } });
    
    // Submit form
    const updateProfileButton = screen.getByText('Update Profile');
    fireEvent.click(updateProfileButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });
  });

  test('successfully updates profile', async () => {
    // Mock successful API response
    axios.put.mockResolvedValueOnce({ data: { success: true } });
    
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <UserProfileSettings />
      </AuthContext.Provider>
    );

    // Update form fields
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    
    fireEvent.change(firstNameInput, { target: { value: 'Updated' } });
    fireEvent.change(lastNameInput, { target: { value: 'Name' } });
    
    // Submit form
    const updateProfileButton = screen.getByText('Update Profile');
    fireEvent.click(updateProfileButton);
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/api/user/profile',
        {
          firstName: 'Updated',
          lastName: 'Name',
          profilePicture: 'https://example.com/profile.jpg'
        },
        expect.any(Object)
      );
      
      // Check if success message is displayed
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
      
      // Check if login was called to update context
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  test('handles profile update error', async () => {
    // Mock API error
    axios.put.mockRejectedValueOnce({
      response: { data: { message: 'Server error' } }
    });
    
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <UserProfileSettings />
      </AuthContext.Provider>
    );
    
    // Submit form
    const updateProfileButton = screen.getByText('Update Profile');
    fireEvent.click(updateProfileButton);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  test('validates password form fields', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <UserProfileSettings />
      </AuthContext.Provider>
    );

    // Navigate to security section
    const securityTab = screen.getByText('Security Settings');
    fireEvent.click(securityTab);
    
    // Submit form without filling fields
    const updatePasswordButton = screen.getByText('Update Password');
    fireEvent.click(updatePasswordButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Current password is required')).toBeInTheDocument();
    });
  });

  test('successfully updates password', async () => {
    // Mock successful API response
    axios.put.mockResolvedValueOnce({ data: { success: true } });
    
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <UserProfileSettings />
      </AuthContext.Provider>
    );

    // Navigate to security section
    const securityTab = screen.getByText('Security Settings');
    fireEvent.click(securityTab);
    
    // Fill password fields
    const currentPasswordInput = screen.getByLabelText(/Current Password/i);
    const newPasswordInput = screen.getByLabelText(/New Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm New Password/i);
    
    fireEvent.change(currentPasswordInput, { target: { value: 'currentPass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newPass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPass123' } });
    
    // Submit form
    const updatePasswordButton = screen.getByText('Update Password');
    fireEvent.click(updatePasswordButton);
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/api/user/password',
        {
          currentPassword: 'currentPass123',
          newPassword: 'newPass123'
        },
        expect.any(Object)
      );
      
      // Check if success message is displayed
      expect(screen.getByText('Password updated successfully')).toBeInTheDocument();
    });
  });
});