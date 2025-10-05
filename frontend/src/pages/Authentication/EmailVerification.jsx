import React from 'react';
import { useVerification } from '../../components/EmailVerification/useVerification';
import VerificationForm from '../../components/EmailVerification/VerificationForm';
import SuccessMessage from '../../components/EmailVerification/SuccessMessage';

const EmailVerification = () => {
  const {
    verificationToken,
    setVerificationToken,
    isLoading,
    error,
    success,
    email,
    handleSubmit,
    handleResendCode,
  } = useVerification();

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-white/80">
              {success
                ? 'Your email has been verified successfully!'
                : `We've sent a verification code to ${email || 'your email'}. Please enter it below.`}
            </p>
          </div>

          {success ? (
            <SuccessMessage />
          ) : (
            <VerificationForm
              verificationToken={verificationToken}
              setVerificationToken={setVerificationToken}
              isLoading={isLoading}
              error={error}
              handleSubmit={handleSubmit}
              handleResendCode={handleResendCode}
            />
          )}
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-32 left-10 transform rotate-12 hover:rotate-0 transition-transform duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl"></div>
      </div>
      <div className="absolute bottom-32 right-10 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl"></div>
      </div>
    </div>
  );
};

export default EmailVerification;