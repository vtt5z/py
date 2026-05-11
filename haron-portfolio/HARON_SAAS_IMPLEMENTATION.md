# HARON OS SaaS Platform - Implementation Guide

## Phase 3: Authentication & Data Persistence

This document outlines the transformation of HARON OS into a production-ready AI SaaS platform with professional authentication and Firestore persistence.

## What's Been Implemented

### 1. Firebase Authentication System ✅
- **Files**: 
  - `src/lib/firebase.ts` - Firebase initialization
  - `src/services/auth.ts` - Authentication operations
  - `src/types/auth.ts` - Type definitions
  - `src/components/providers/auth-provider.tsx` - Auth context

- **Features**:
  - Google OAuth sign-in
  - Email/password registration
  - Email verification (required for persistence)
  - Guest mode (limited features)
  - Session persistence
  - Password reset flow
  - Role-based authorization (OWNER vs USER - server-validated)

- **Security**:
  - Frontend never trusts role claims
  - All roles verified server-side
  - Email verification required for uploads
  - Guest mode prevents data persistence

### 2. Premium Authentication UI ✅
- **File**: `src/app/auth/page.tsx`
- **Features**:
  - Modern dark-mode login page
  - Google sign-in button
  - Email/password form (sign in + sign up)
  - Guest mode option
  - Email verification notice
  - Responsive design
  - Arabic + English support
  - Smooth animations (Framer Motion)

### 3. Firestore Data Schema ✅
- **File**: `src/lib/firestore.ts`
- **Collections**:
  - `users/` - User profiles (id = auth UID)
  - `conversations/` - Chat conversations with metadata
  - `conversations/{id}/messages/` - Messages in each conversation
  - `uploads/` - File upload records
  - `preferences/` - User preferences

### 4. Firestore Security Rules ✅
- **File**: `FIREBASE_SECURITY_RULES.md`
- **Security**:
  - Users can only access their own documents
  - Authenticated users only
  - Email verification required for uploads
  - Conversation privacy enforced
  - No public data exposure

### 5. Chat Memory Hook ✅
- **File**: `src/hooks/use-conversations.ts`
- **Features**:
  - Create/load/switch conversations
  - Guest mode uses localStorage
  - Authenticated mode uses Firestore
  - Message persistence
  - Conversation history management

### 6. Updated System Prompt ✅
- **File**: `src/services/gemini.ts`
- **Changes**:
  - Removed "OS" language
  - Now sounds like modern AI workspace assistant
  - Natural, practical tone
  - Supports English + Arabic naturally

## Next Steps: Chat Integration

### Update AIChatAssistant Component

The chat component needs to be updated to:

```typescript
"use client";

import { useConversations } from "@/hooks/use-conversations";
import { useAuth } from "@/components/providers/auth-provider";

export function AIChatAssistant() {
  const { user, isAuthenticated } = useAuth();
  const { currentConversation, addMessage, startNewConversation } = useConversations();

  // When user sends message:
  const handleSendMessage = async (content: string) => {
    // Create conversation if needed
    if (!currentConversation) {
      await startNewConversation(content);
    } else {
      // Add user message
      await addMessage("user", content);
    }

    // Get AI response
    const response = await callGeminiAPI(content);

    // Save assistant response
    await addMessage("assistant", response);
  };

  // Load messages from currentConversation
  const messages = currentConversation?.messages || [];

  // Render chat...
}
```

### Add Conversation Sidebar

Create a sidebar showing:
- Recent conversations
- Search conversations
- Archive conversation
- Delete conversation
- New chat button

## Setup Instructions

### 1. Firebase Project Setup
See `FIREBASE_SETUP.md` for complete instructions.

### 2. Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OWNER_EMAILS=your@email.com
```

### 3. Security Rules
Deploy Firestore rules from `FIREBASE_SECURITY_RULES.md`:
1. Firebase Console → Firestore → Rules
2. Paste rules
3. Publish

### 4. Test Authentication
```bash
npm run dev
# Navigate to /auth
# Test: Google sign-in, Email signup, Guest mode
```

## User Flows

### New User Sign-Up
```
User visits app
→ Click "Continue with Google" OR "Create Account"
→ Google OAuth flow OR email verification
→ Lands on /ai with empty chat
→ Can use chat in guest mode or sign in for persistence
```

### Email Sign-Up Flow
```
User enters email + password + name
→ Account created in Firebase Auth
→ Verification email sent
→ User clicks link in email
→ emailVerified = true
→ Can now save conversations + upload files
```

### Sign-In Flow
```
User enters email + password
→ Authenticated in Firebase
→ Profile loaded from Firestore
→ Chat history and preferences loaded
→ Access to persistent features
```

### Guest Mode Flow
```
User clicks "Continue as Guest"
→ Signed in anonymously
→ Conversations saved to localStorage only
→ No file uploads allowed
→ No data persists after closing browser
```

## Authentication Security

### Role Architecture
- **Frontend**: Only knows about GUEST, USER (anonymous or verified)
- **Backend/Firestore**: Determined from:
  - Email address (if owner email → OWNER role)
  - Authentication status
  - Email verification status

### No Role Injection
```typescript
// ❌ Frontend CANNOT do this:
const headers = {
  "X-User-Role": "admin" // ← IGNORED, never used
};

// ✅ Backend determines role from:
if (email === ownerEmail) role = "owner";
else role = "user";
```

### Protected Operations
- **Uploads** → Require emailVerified = true
- **Conversations** → Only owner can access
- **Messages** → Protected by parent conversation
- **Preferences** → Only own preferences

## Data Privacy

### What's Saved
- ✅ Conversations (user only)
- ✅ Messages (encrypted in transit, persisted)
- ✅ File uploads (metadata + reference)
- ✅ User preferences (language, theme)
- ✅ Email (for authentication)

### What's NOT Saved
- ❌ Password (Firebase handles hashing)
- ❌ System prompts (server-side only)
- ❌ Admin roles/flags (server-determined)
- ❌ API keys (never exposed)

## Deployment Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] All env vars set
- [ ] Authentication methods enabled
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Authentication page tested
- [ ] Chat history persistence tested
- [ ] Email verification working
- [ ] Guest mode tested
- [ ] Google OAuth tested on production domain

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Next.js App (Client)                │
├─────────────────────────────────────────────┤
│ AuthProvider (Context)                      │
│ ├─ useAuth() - Access auth state            │
│ └─ User/Profile/isAuthenticated             │
├─────────────────────────────────────────────┤
│ LanguageProvider (Context)                  │
│ ├─ useLanguage() - Language/RTL support     │
│ └─ ar/en/dir                                │
├─────────────────────────────────────────────┤
│ Components                                  │
│ ├─ /auth/page.tsx - Login/Signup            │
│ ├─ /ai/page.tsx - Chat interface            │
│ └─ /tools/* - Tool pages                    │
└─────────────────────────────────────────────┘
         │
         ├─ /services/auth.ts (Firebase Auth)
         ├─ /services/gemini.ts (Gemini API)
         ├─ /hooks/use-conversations.ts
         └─ /lib/firestore.ts
         │
         ▼
┌─────────────────────────────────────────────┐
│    Firebase (Google Cloud)                  │
├─────────────────────────────────────────────┤
│ Authentication                              │
│ ├─ Google OAuth                             │
│ ├─ Email/Password                           │
│ └─ Session Management                       │
├─────────────────────────────────────────────┤
│ Firestore Database                          │
│ ├─ users/ collection                        │
│ ├─ conversations/ collection                │
│ ├─ uploads/ collection                      │
│ └─ preferences/ collection                  │
├─────────────────────────────────────────────┤
│ Cloud Storage (optional)                    │
│ └─ User file uploads                        │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│    Gemini API (Google AI)                   │
├─────────────────────────────────────────────┤
│ Chat streaming                              │
│ Text generation                             │
│ Image analysis                              │
│ Language detection                          │
└─────────────────────────────────────────────┘
```

## Troubleshooting

### "Firebase not configured"
- Check NEXT_PUBLIC_FIREBASE_* variables
- Restart dev server
- Check .env.local file

### "Permission denied" in Firestore
- Verify user email is verified
- Check Firestore security rules are published
- Ensure user is authenticated

### "Cannot read property 'uid'"
- User might be undefined
- Check auth state is loading
- Wrap components in AuthProvider

### Email verification not working
- Check action URL in Firebase Console
- Verify NEXT_PUBLIC_APP_URL is correct
- Check email is being sent (Gmail spam folder)

## Code Examples

### Using useAuth
```typescript
const { user, isAuthenticated, signInWithGoogle, signOut } = useAuth();

if (isAuthenticated) {
  return <div>Welcome {user?.email}</div>;
}

return <button onClick={signInWithGoogle}>Sign In</button>;
```

### Using useConversations
```typescript
const { currentConversation, addMessage, startNewConversation } = useConversations();

// Add message to current conversation
await addMessage("user", "Hello");

// Start new conversation
const convId = await startNewConversation("First message");
```

### Protected API Routes
```typescript
// src/app/api/protected-endpoint/route.ts
import { getFirebaseAuth } from "@/lib/firebase";

export async function POST(request) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // User is authenticated, proceed
}
```

## Next Phases

### Phase 4: Chat Memory Integration
- Update AIChatAssistant component
- Add conversation sidebar
- Implement message history loading
- Add new chat flow

### Phase 5: Tool Organization
- Categorize tools (Developer, AI Productivity, Analysis)
- Improve empty state UX
- Add tool discovery page

### Phase 6: Full Arabic Support
- Complete UI translation
- Proper RTL formatting
- Saudi-friendly tone refinement
- Arabic-specific features

## Support & Resources

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Console](https://console.firebase.google.com)
- [HARON OS Repository](https://github.com/your/repo)

## Questions?

Check these files for more details:
- `FIREBASE_SETUP.md` - Firebase project setup
- `FIREBASE_SECURITY_RULES.md` - Security rules documentation
- `.env.local.example` - Required environment variables
