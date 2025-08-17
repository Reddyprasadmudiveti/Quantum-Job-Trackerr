# Google Authentication Setup Guide

## 🚀 Complete Google OAuth Implementation

This guide will help you set up Google authentication for your Dravidian University app.

## 📋 Prerequisites

1. Node.js and npm installed
2. A Google account
3. Access to Google Cloud Console

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Dravidian University Auth")
4. Click "Create"

### 1.2 Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure the consent screen first if prompted:
   - Choose "External" for testing
   - Fill in app name: "Dravidian University"
   - Add your email as developer contact
4. For Application type, select "Web application"
5. Add these URLs:
   - **Authorized JavaScript origins**: `http://localhost:3000`, `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:3000/auth/google/callback`
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

## 🔧 Step 2: Environment Configuration

### 2.1 Create .env file
Create a `.env` file in your project root:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Session Secret (generate a random string)
SESSION_SECRET=your_session_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 2.2 Replace the placeholder values
- Replace `your_google_client_id_here` with your actual Google Client ID
- Replace `your_google_client_secret_here` with your actual Google Client Secret
- Generate random strings for JWT_SECRET and SESSION_SECRET

## 🔧 Step 3: Install Dependencies

The required packages are already installed, but if you need to install them manually:

```bash
# Backend dependencies
npm install passport passport-google-oauth20 express-session jsonwebtoken bcryptjs cors dotenv

# Frontend dependencies (in frontend folder)
cd frontend
npm install @google-cloud/local-auth googleapis
```

## 🔧 Step 4: Start the Application

### 4.1 Start the Backend Server
```bash
npm start
# Server will run on http://localhost:3000
```

### 4.2 Start the Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

## 🔧 Step 5: Test Google Authentication

1. Open your browser and go to `http://localhost:5173`
2. Click on "Login/Signup" in the navigation
3. Click the "Google" button
4. You should be redirected to Google's OAuth consent screen
5. After granting permissions, you'll be redirected back to your app
6. You should see your profile information in the navigation bar

## 🎯 Features Implemented

### ✅ Backend Features
- **Google OAuth 2.0** integration with Passport.js
- **JWT token** generation and verification
- **Session management** with express-session
- **User data storage** (currently in-memory, can be extended to database)
- **Authentication routes** (`/auth/google`, `/auth/google/callback`, `/auth/logout`)
- **Protected routes** middleware ready

### ✅ Frontend Features
- **React Context** for authentication state management
- **Google login** button integration
- **User profile** dropdown with logout functionality
- **Authentication success** page with redirect
- **Persistent login** with localStorage
- **Protected routes** ready for implementation

### ✅ UI Components
- **UserProfile** component with dropdown menu
- **AuthSuccess** page for handling OAuth callback
- **Updated Login/SignUp** pages with Google OAuth buttons
- **Responsive navigation** that shows user info when logged in

## 🔒 Security Features

- **JWT tokens** for stateless authentication
- **Secure session** configuration
- **CORS** properly configured
- **Environment variables** for sensitive data
- **Token verification** on protected routes

## 🚀 Next Steps

### Database Integration
To make this production-ready, replace the in-memory user storage with a database:

```javascript
// Example with MongoDB/Mongoose
const User = require('./models/User');

// In passport strategy
let existingUser = await User.findOne({ googleId: profile.id });
if (existingUser) {
  return done(null, existingUser);
}

const newUser = await User.create({
  googleId: profile.id,
  email: profile.emails[0].value,
  firstName: profile.name.givenName,
  lastName: profile.name.familyName,
  profilePicture: profile.photos[0].value
});
```

### Protected Routes
Add route protection:

```javascript
// Middleware to protect routes
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use on protected routes
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});
```

## 🐛 Troubleshooting

### Common Issues

1. **"Error: redirect_uri_mismatch"**
   - Check that your redirect URI in Google Console matches exactly: `http://localhost:3000/auth/google/callback`

2. **"Cannot read properties of undefined"**
   - Make sure your `.env` file is in the project root
   - Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly

3. **CORS errors**
   - Ensure your frontend URL is added to CORS origins in the server configuration

4. **Session not persisting**
   - Check that `SESSION_SECRET` is set in your environment variables

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs for backend errors
3. Verify all environment variables are set correctly
4. Ensure Google Cloud Console is configured properly

## 🎉 Congratulations!

You now have a fully functional Google authentication system integrated with your beautiful university app! Users can sign in with their Google accounts and enjoy a seamless authentication experience.