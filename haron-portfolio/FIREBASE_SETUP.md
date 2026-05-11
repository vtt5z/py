# HARON OS - Environment Configuration

## Firebase Setup

Add these to your `.env.local` file:

```env
# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OWNER_EMAILS=admin@example.com,owner@example.com

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3-flash-preview

# Supabase (for file storage, if used)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Optional: Firebase Emulator Setup

For local development with Firebase Emulator:

```env
# Firebase Emulator
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL=http://localhost:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL=localhost:8080
NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL=localhost:9199
```

## Getting Firebase Credentials

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Get Web App Credentials
1. In Firebase Console, click **⚙️ Settings**
2. Go to **Project Settings** tab
3. Scroll to **Your apps** section
4. Click **Web** icon (</> symbol)
5. Register app
6. Copy the `firebaseConfig` object
7. Paste the values into `.env.local`

### Step 3: Enable Authentication Methods
1. Go to **Authentication** in left sidebar
2. Click **Get Started**
3. Enable **Google** provider
4. Enable **Email/Password** provider

### Step 4: Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create Database**
3. Select region closest to users
4. Start in **Test mode** (we'll add security rules)
5. Create database

### Step 5: Add Security Rules
1. Go to **Firestore Database → Rules**
2. Paste rules from `FIREBASE_SECURITY_RULES.md`
3. Click **Publish**

### Step 6: Create Cloud Storage (optional)
1. Go to **Storage**
2. Click **Get Started**
3. Accept default rules
4. Create bucket

## Verifying Setup

### Test Authentication
```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase initialized:", auth);
```

### Test Firestore
```typescript
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);
const querySnapshot = await getDocs(collection(db, "users"));
console.log("Firestore connected:", querySnapshot.size);
```

## Production Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Environment variables set in `.env.local`
- [ ] Google OAuth configured
- [ ] Email/Password auth enabled
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Authentication provider enabled
- [ ] `NEXT_PUBLIC_OWNER_EMAILS` set with admin emails
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Email verification working
- [ ] Test sign-up → verify email → access features

## Email Verification

1. User signs up with email
2. Verification email sent to inbox
3. Click "Verify Email" link
4. User can then:
   - Save conversations
   - Upload files
   - Sync workspace

Verification link expires after 24 hours.

## Troubleshooting

### "Firebase not configured"
- Check all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Verify no typos in `.env.local`
- Restart dev server: `npm run dev`

### "Permission denied" errors
- Check security rules are deployed
- Verify user email is verified
- Check `request.auth` is available

### "Auth not found"
- Ensure `AuthProvider` wraps your app
- Check layout.tsx has `<AuthProvider>`

### "Firestore not found"
- Create Firestore database in Firebase Console
- Check region selection
- Verify security rules are not blocking access

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Firestore Query Debugging](https://firebase.google.com/docs/firestore/query-data/queries)
