import React from 'react';
import { Link } from 'react-router-dom';
import { LuLoader } from 'react-icons/lu';

const VerificationForm = ({
  verificationToken,
  setVerificationToken,
  isLoading,
  error,
  handleSubmit,
  handleResendCode,
}) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    {error && (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-white">
        <p>{error}</p>
      </div>
    )}

    <div>
      <label htmlFor="verificationToken" className="block text-white font-semibold mb-2">
        Verification Code
      </label>
      <input
        type="text"
        id="verificationToken"
        value={verificationToken}
        onChange={(e) => setVerificationToken(e.target.value)}
        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
        placeholder="Enter verification code"
        required
      />
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-2xl text-white font-semibold shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center"
    >
      {isLoading ? (
        <>
          <LuLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-pink-500" />
          Verifying...
        </>
      ) : (
        'Verify Email'
      )}
    </button>

    <div className="text-center">
      <button
        type="button"
        onClick={handleResendCode}
        className="text-purple-300 hover:text-purple-200 transition-colors text-sm"
      >
        Didn't receive a code? Resend
      </button>
    </div>

    <div className="text-center pt-4 border-t border-white/10">
      <Link to="/signup" className="text-white/70 hover:text-white transition-colors">
        Back to Signup
      </Link>
    </div>
  </form>
);

export default VerificationForm;