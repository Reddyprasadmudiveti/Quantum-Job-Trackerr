import React from 'react';

const SuccessMessage = () => (
  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
    <div className="w-16 h-16 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl">✓</span>
    </div>
    <h2 className="text-xl font-semibold text-white mb-2">Email Verified!</h2>
    <p className="text-white/80 mb-4">Your account has been successfully verified.</p>
    <p className="text-white/60">Redirecting to signup page...</p>
  </div>
);

export default SuccessMessage;