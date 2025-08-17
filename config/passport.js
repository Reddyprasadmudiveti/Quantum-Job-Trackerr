import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User model (you can replace this with your actual database model)
const users = []; // In production, this would be your database

// Check if Google OAuth credentials are provided
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientID || !googleClientSecret) {
  console.warn('⚠️  Google OAuth credentials not found in environment variables.');
  console.warn('   Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
  console.warn('   Google authentication will be disabled until credentials are provided.');
} else {
  console.log('✅ Google OAuth credentials loaded successfully');
  
  passport.use(new GoogleStrategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let existingUser = users.find(user => user.googleId === profile.id);
      
      if (existingUser) {
        return done(null, existingUser);
      }
      
      // Create new user
      const newUser = {
        id: users.length + 1,
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePicture: profile.photos[0].value,
        createdAt: new Date(),
        provider: 'google'
      };
      
      users.push(newUser);
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    done(null, user);
  });
}

export default passport;