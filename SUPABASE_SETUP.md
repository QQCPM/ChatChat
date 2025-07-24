# 🚀 Supabase Migration Setup Guide

## Step 1: Create Supabase Account & Project

1. Go to https://supabase.com and create an account
2. Click "New Project"
3. Choose your organization and create a new project
4. Wait for project to be ready (2-3 minutes)

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (long JWT token starting with `eyJhbGci...`)

## Step 3: Update Configuration

1. Open `src/supabase/supabase.js`
2. Replace the placeholder values:

```javascript
const supabaseUrl = 'https://your-project-ref.supabase.co'  // Your Project URL
const supabaseAnonKey = 'eyJhbGci...'  // Your anon public key
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it in the SQL Editor and click **Run**
4. This will create all necessary tables and security policies

## Step 5: Configure Google OAuth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: Get from Google Cloud Console
   - **Client Secret**: Get from Google Cloud Console
4. Add your site URL to **Redirect URLs**: `http://localhost:5173`

### Getting Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set **Application type** to "Web application"
6. Add **Authorized redirect URIs**:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:5173` (for development)

## Step 6: Test the Migration

1. Save your changes
2. Run `npm run dev`
3. Try logging in with Google
4. Send some messages
5. Check **Relationship Stats** - should now load instantly!

## 🎉 Benefits After Migration

- ✅ **Real-time sync** - Messages sync across devices
- ✅ **Fast loading** - Relationship stats load instantly
- ✅ **Accurate counts** - Correct message counting
- ✅ **True couples app** - Both partners see same data
- ✅ **No data loss** - Everything backed up to cloud
- ✅ **Better scaling** - PostgreSQL database

## 🔧 Troubleshooting

**Login Issues:**
- Check Google OAuth credentials
- Verify redirect URLs match exactly
- Check browser console for errors

**Database Issues:**
- Make sure you ran the schema SQL
- Check table permissions in Supabase dashboard

**Still seeing old data:**
- Clear localStorage: `localStorage.clear()`
- Old localStorage data will be preserved as backup

## 🔄 Data Migration

Your existing localStorage data is preserved. The app will:
1. Continue reading from localStorage for now
2. Gradually sync new data to Supabase
3. Eventually you can migrate old data if needed

Need help? Check the browser console for detailed error messages!