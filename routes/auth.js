import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Check if Google OAuth is configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.status(500).json({
      error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables.'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!isGoogleConfigured) {
    console.error('Google OAuth callback called but OAuth is not configured');
    return res.redirect('http://localhost:5173/signin?error=oauth_not_configured');
  }

  passport.authenticate('google', { failureRedirect: '/signin' }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth callback error:', {
        error: err.message,
        code: err.code,
        status: err.status,
        stack: err.stack
      });

      // More specific error handling
      if (err.code === 'invalid_client') {
        return res.redirect('http://localhost:5173/login?error=invalid_client_credentials');
      } else if (err.code === 'redirect_uri_mismatch') {
        return res.redirect('http://localhost:5173/login?error=redirect_uri_mismatch');
      } else {
        return res.redirect(`http://localhost:5173/login?error=oauth_failed&details=${encodeURIComponent(err.message)}`);
      }
    }

    if (!user) {
      console.log('Google OAuth: No user returned', info);
      return res.redirect('http://localhost:5173/login?error=oauth_cancelled');
    }

    console.log('Google OAuth success for user:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET || 'dravidian_university_jwt_secret_key_2024',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture
    }))}`);
  })(req, res, next);
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/user', (req, res) => {
  if (req.user) {
    res.json({
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      profilePicture: req.user.profilePicture
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Verify JWT token
router.post('/verify', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dravidian_university_jwt_secret_key_2024');
    res.json({ user: decoded, valid: true });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token', valid: false });
  }
});

// Check OAuth configuration status
router.get('/status', (req, res) => {
  res.json({
    googleOAuth: isGoogleConfigured,
    clientIdPresent: !!process.env.GOOGLE_CLIENT_ID,
    clientSecretPresent: !!process.env.GOOGLE_CLIENT_SECRET,
    clientIdLength: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.length : 0,
    message: isGoogleConfigured
      ? 'Google OAuth is configured and ready'
      : 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file'
  });
});

// Test endpoint to check Google OAuth configuration
router.get('/test-google-config', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  res.json({
    status: 'Google OAuth Configuration Test',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT
    },
    credentials: {
      clientIdPresent: !!clientId,
      clientIdLength: clientId ? clientId.length : 0,
      clientIdPreview: clientId ? `${clientId.substring(0, 12)}...${clientId.substring(clientId.length - 12)}` : 'Not set',
      clientSecretPresent: !!clientSecret,
      clientSecretLength: clientSecret ? clientSecret.length : 0,
      clientSecretPreview: clientSecret ? `${clientSecret.substring(0, 8)}...${clientSecret.substring(clientSecret.length - 8)}` : 'Not set'
    },
    urls: {
      callbackURL: '/auth/google/callback',
      fullCallbackURL: `${req.protocol}://${req.get('host')}/auth/google/callback`,
      authURL: `${req.protocol}://${req.get('host')}/auth/google`
    },
    troubleshooting: {
      mostLikelyIssue: 'OAuth Consent Screen not configured in Google Cloud Console',
      commonIssues: [
        '❌ OAuth consent screen not configured (MOST COMMON)',
        '❌ Incorrect redirect URI in Google Cloud Console',
        '❌ Google+ API or People API not enabled',
        '❌ Client ID or Client Secret copied incorrectly',
        '❌ Project not published (if using External user type)'
      ],
      requiredGoogleCloudSettings: {
        'OAuth Consent Screen': 'Must be configured (External for testing)',
        'Authorized JavaScript Origins': 'http://localhost:3000',
        'Authorized Redirect URIs': 'http://localhost:3000/auth/google/callback',
        'Required APIs': ['Google+ API', 'People API']
      }
    },
    quickFix: [
      '🔧 STEP 1: Go to https://console.cloud.google.com/',
      '🔧 STEP 2: APIs & Services → OAuth consent screen',
      '🔧 STEP 3: Choose External → Fill App name, emails → Save',
      '🔧 STEP 4: APIs & Services → Credentials → Edit OAuth client',
      '🔧 STEP 5: Verify redirect URI: http://localhost:3000/auth/google/callback',
      '🔧 STEP 6: APIs & Services → Library → Enable Google+ API'
    ]
  });
});

export default router;