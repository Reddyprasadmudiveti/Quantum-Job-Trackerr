import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useVerification = () => {
  const navigate = useNavigate();
  const [verificationToken, setVerificationToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    if (!pendingEmail) {
      setError('No pending verification found. Please sign up first.');
    } else {
      setEmail(pendingEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationToken.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:3000/api/auth/verification',
        { token: verificationToken },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      setIsLoading(false);
      setSuccess(true);
      localStorage.removeItem('pendingVerificationEmail');

      setTimeout(() => {
        navigate('/signup');
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Verification failed. Please try again.';
      setError(errorMessage);
    }
  };

  const handleResendCode = () => {
    alert('This feature is not implemented yet. Please check your email for the verification code or sign up again.');
  };

  return {
    verificationToken,
    setVerificationToken,
    isLoading,
    error,
    success,
    email,
    handleSubmit,
    handleResendCode,
  };
};