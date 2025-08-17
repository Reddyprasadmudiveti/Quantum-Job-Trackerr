# 🚀 Quick Google OAuth Setup

## Step 1: Get Google Credentials (5 minutes)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Search and enable "Google+ API"
4. **Create Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add these URLs:
     - **Authorized JavaScript origins**: `http://localhost:3000`
     - **Authorized redirect URIs**: `http://localhost:3000/auth/google/callback`
   - Click "Create"
   - **Copy the Client ID and Client Secret**

## Step 2: Update Your .env File

Replace the placeholder values in your `.env` file:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_from_google
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google
JWT_SECRET=dravidian_university_jwt_secret_key_2024
SESSION_SECRET=dravidian_university_session_secret_2024
PORT=3000
NODE_ENV=development
```

## Step 3: Restart Your Server

```bash
npm start
```

## ✅ Test It

1. Go to http://localhost:5173
2. Click Login → Google button
3. You should see Google's OAuth screen

## 🔧 For Testing Without Google OAuth

If you want to test the app without setting up Google OAuth right now, the server will still run but Google login will be disabled with a helpful error message.

## 🆘 Need Help?

Check the server logs - they'll tell you exactly what's missing!