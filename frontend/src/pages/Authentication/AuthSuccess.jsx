import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        login(userData, token);
        
        // Redirect to jobs page
        setTimeout(() => {
          navigate('/jobs', { replace: true });
        }, 2000);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden flex items-center justify-center'>
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-xl animate-pulse'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500'></div>
      </div>

      {/* Success Message */}
      <div className='relative z-10 text-center'>
        <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 shadow-2xl'>
          <div className='w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6'>
            <span className='text-3xl text-white'>✅</span>
          </div>
          <h1 className='text-4xl font-bold text-white mb-4 drop-shadow-lg'>
            Authentication Successful!
          </h1>
          <p className='text-white/80 text-lg mb-6'>
            You have been successfully logged in with Google.
          </p>
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3'></div>
            <span className='text-white/70'>Redirecting you to the dashboard...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;