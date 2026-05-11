# Firestore Security Rules Setup

## Overview

These security rules ensure:
- ✅ Users can only access their own documents
- ✅ Authenticated users only
- ✅ Proper email verification requirements
- ✅ No public data exposure
- ✅ Secure conversation and message access

## Implementation Steps

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Replace the entire content with the rules below
5. Click **Publish**

## Firestore Rules

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isEmailVerified() {
      return request.auth.token.email_verified == true;
    }

    // Users collection - profile data
    match /users/{userId} {
      // Only authenticated users can read/write their own profile
      allow read, write: if isAuthenticated() && isOwner(userId);
      
      // On create, set role to 'user' (backend will override for owners)
      allow create: if isAuthenticated() && request.data.email == request.auth.token.email;
    }

    // Conversations collection
    match /conversations/{conversationId} {
      // Only the conversation owner can read/write
      allow read, write, delete: if isAuthenticated() && 
                                    isOwner(resource.data.userId);
      
      // Can create new conversation
      allow create: if isAuthenticated() && 
                      request.data.userId == request.auth.uid;

      // Messages subcollection
      match /messages/{messageId} {
        // Only conversation owner can access messages
        allow read, write: if isAuthenticated() && 
                            isOwner(get(/databases/$(database)/documents/conversations/$(conversationId)).data.userId);
        
        // Can add messages to own conversations
        allow create: if isAuthenticated() && 
                       isOwner(get(/databases/$(database)/documents/conversations/$(conversationId)).data.userId);
      }
    }

    // Uploads collection
    match /uploads/{uploadId} {
      // Only the uploader can read/write/delete
      allow read, write, delete: if isAuthenticated() && 
                                   isOwner(resource.data.userId);
      
      // Can create new upload (email verified)
      allow create: if isAuthenticated() && 
                     isEmailVerified() &&
                     request.data.userId == request.auth.uid;
    }

    // Preferences collection
    match /preferences/{userId} {
      // Only authenticated users can access their own preferences
      allow read, write: if isAuthenticated() && isOwner(userId);
      
      // Can create own preference document
      allow create: if isAuthenticated() && 
                     request.data.userId == request.auth.uid;
    }

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Security Features Explained

### 1. **User Authentication**
- All access requires `request.auth != null`
- Prevents anonymous access to personal data

### 2. **Owner Verification**
- Users can only access documents where `userId == request.auth.uid`
- Prevents cross-user data access

### 3. **Email Verification**
- Uploads require `email_verified == true`
- Ensures valid email before allowing file storage

### 4. **Conversation Access**
- Users can read/write only their own conversations
- Messages are protected by parent conversation ownership
- Prevents unauthorized conversation access

### 5. **No Wildcard Permissions**
- Default deny rule at the end
- Only explicitly allowed operations are permitted

## Testing Rules Locally

If using Firebase Emulator:

```bash
# Terminal 1: Start emulator
firebase emulators:start

# The emulator will show:
# ⌨️  Press i + enter to inspect Firestore data
```

### Testing with Client Code

```typescript
// This will succeed (own data)
const userRef = doc(db, "users", currentUser.uid);
await getDoc(userRef); // ✅ Allowed

// This will fail (different user)
const otherUserRef = doc(db, "users", "someOtherUserId");
await getDoc(otherUserRef); // ❌ Denied

// This will fail (no email verification)
const uploadsRef = collection(db, "uploads");
await addDoc(uploadsRef, { /* data */ }); // ❌ Denied (no email verified token)
```

## Firestore Indexes (if needed)

If you see index creation prompts, create these composite indexes:

### Index 1: Conversations by userId (ascending) + updatedAt (descending)
- Collection: `conversations`
- Fields: `userId` (ascending), `updatedAt` (descending)

### Index 2: Uploads by userId (ascending) + uploadedAt (descending)
- Collection: `uploads`
- Fields: `userId` (ascending), `uploadedAt` (descending)

These are created automatically when you run queries, but you can pre-create them if desired.

## Email Verification in Rules

**Important**: The `email_verified` check works because Firebase Admin SDK or custom claims can set this. The client-side code sends verification emails, and once clicked, Firebase automatically updates the token.

To verify email verification is working:
```typescript
const user = auth.currentUser;
console.log(user.emailVerified); // true after verification
```

## Common Issues

### Issue: "Permission denied" on upload
- **Fix**: User must verify email first. Check `user.emailVerified`

### Issue: Can't access partner's data
- **Fix**: This is intentional. Rules only allow own documents.

### Issue: Need public read access
- **Modify rule**: Add `allow read: if true;` for specific paths (not recommended for sensitive data)

## Support

For questions about Firebase security rules:
- [Firebase Rules Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Common Rules Patterns](https://firebase.google.com/docs/firestore/security/rules-query)
