import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate('/signin');
      return;
    }

    // Populate form with user data
    setFormData(prevData => ({
      ...prevData,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || ''
    }));
    
    // Set preview image if user has a profile picture
    if (user.profilePicture) {
      // If the profile picture is a full URL, use it directly
      // If it's a relative path from our server, prepend the server URL
      const imageUrl = user.profilePicture.startsWith('http') 
        ? user.profilePicture 
        : `http://localhost:3000${user.profilePicture}`;
      setPreviewImage(imageUrl);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profileImage' && files && files[0]) {
      // Handle file input
      const file = files[0];
      setProfileImage(file);
      
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    } else {
      // Handle other inputs
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const validateProfileForm = () => {
    let isValid = true;
    let errorMessage = '';
    
    // Check if first name is valid
    if (!formData.firstName.trim()) {
      errorMessage = 'First name is required';
      isValid = false;
    } else if (formData.firstName.length > 50) {
      errorMessage = 'First name must be less than 50 characters';
      isValid = false;
    }
    
    // Check if last name is valid
    if (!formData.lastName.trim()) {
      errorMessage = 'Last name is required';
      isValid = false;
    } else if (formData.lastName.length > 50) {
      errorMessage = 'Last name must be less than 50 characters';
      isValid = false;
    }
    
    // Check if profile image is valid
    if (profileImage) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(profileImage.type)) {
        errorMessage = 'Profile picture must be a valid image file (JPEG, PNG, GIF, or WEBP)';
        isValid = false;
      }
      
      // Check file size (5MB max)
      if (profileImage.size > 5 * 1024 * 1024) {
        errorMessage = 'Profile picture must be less than 5MB';
        isValid = false;
      }
    }
    
    if (!isValid) {
      setError(errorMessage);
    }
    
    return isValid;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    // Validate form before submission
    if (!validateProfileForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      
      // Only append the file if a new one was selected
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }
      
      // Call API to update profile
      const response = await axios.put(
        'http://localhost:3000/api/auth/user/profile',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            // Don't set Content-Type here, it will be automatically set with the boundary parameter
          }
        }
      );

      // Update local user data with the response from the server
      const updatedUser = {
        ...user,
        ...response.data.user
      };

      // Update auth context and localStorage
      login(updatedUser, localStorage.getItem('authToken'));
      
      setMessage('Profile updated successfully');
      
      // Clean up any object URLs to prevent memory leaks
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordForm = () => {
    let isValid = true;
    let errorMessage = '';
    
    // Check if current password is provided
    if (!passwordData.currentPassword) {
      errorMessage = 'Current password is required';
      isValid = false;
    }
    
    // Check if new password meets requirements
    if (!passwordData.newPassword) {
      errorMessage = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errorMessage = 'New password must be at least 6 characters long';
      isValid = false;
    }
    
    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errorMessage = 'New password and confirm password do not match';
      isValid = false;
    }
    
    if (!isValid) {
      setError(errorMessage);
    }
    
    return isValid;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    // Validate form before submission
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Call API to update password
      await axios.put(
        'http://localhost:3000/api/auth/user/password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      // Clear password fields
      setFormData(prevData => ({
        ...prevData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setMessage('Password updated successfully');
    } catch (error) {
      console.error('Password update error:', error);
      setError(error.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Animated background elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-xl animate-pulse'></div>
          <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500'></div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>
            
            {/* Tabs */}
            <div className="flex mb-8 border-b border-white/20">
              <button
                className={`px-6 py-3 font-medium text-lg ${activeTab === 'profile' ? 'text-white border-b-2 border-blue-400' : 'text-white/70 hover:text-white'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </button>
              <button
                className={`px-6 py-3 font-medium text-lg ${activeTab === 'security' ? 'text-white border-b-2 border-blue-400' : 'text-white/70 hover:text-white'}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
            </div>
            
            {/* Status Messages */}
            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200">
                {error}
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Profile Picture */}
                  <div className="md:col-span-2 flex flex-col items-center mb-6">
                    <div className="relative">
                      <img
                        src={previewImage || 'https://avatar.iran.liara.run/public/13'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg object-cover"
                      />
                      <label
                        htmlFor="profileImage"
                        className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        ✏️
                        <input
                          type="file"
                          id="profileImage"
                          name="profileImage"
                          onChange={handleChange}
                          accept="image/jpeg, image/png, image/gif, image/webp"
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-white/70 text-sm mt-2">
                      Click the edit button to upload a new profile picture
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      JPG, PNG, GIF or WEBP. Max 5MB.
                    </p>
                  </div>
                  
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-white font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-white font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-white font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white/70 placeholder-white/50 focus:outline-none"
                      placeholder="Enter your email"
                      disabled
                    />
                    <p className="text-white/50 text-sm mt-1">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-white font-medium mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your current password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  
                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-white font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your new password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <p className="text-white/50 text-sm mt-1">
                      Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                    </p>
                  </div>
                  
                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm your new password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;