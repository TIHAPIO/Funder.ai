# Firebase Setup and Security Guide

## Overview
This document outlines the Firebase configuration and security measures implemented in the project. The setup includes Authentication, Firestore Database, and Storage services with proper security rules.

## Configuration
Firebase configuration is stored in environment variables for security:

1. Create a `.env.local` file (already done) with your Firebase config:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Security Rules

### Firestore Rules (`firestore.rules`)
- User profiles: Only authenticated users can read, only owners can write
- Campaigns: Authenticated users can read, creators can update/delete
- Resources: Authenticated users can read, creators can update/delete
- Chat messages: Only chat participants can read/write messages
- Built-in security helpers for authentication and ownership verification

### Storage Rules (`storage.rules`)
- File size limits: 10MB for general files, 5MB for profile images
- Content type restrictions: Images, PDFs, Word documents, text files
- Access control:
  - Chat attachments: Only chat participants
  - Campaign resources: Authenticated users can read, campaign owners can write
  - User profile images: Public read, owner write
  - Resource attachments: Authenticated users can read, resource owners can write

## Services Implementation

### Base Service (`src/lib/services/base.ts`)
- Generic CRUD operations
- Timestamp handling
- Type-safe document handling
- Query builder support

### Chat Service (`src/lib/services/chat.ts`)
- Real-time messaging
- Typing indicators
- Last seen status
- Message read receipts
- File attachments support
- Group chat support

## Types

### Chat Types (`src/types/chat.ts`)
- Message structure
- Chat participant management
- Support for different message types (text, image, file)
- Metadata handling
- Notification structure

## Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Keep a `.env.example` for reference
   - Use environment variables for all sensitive data

2. **Security**
   - Always validate user authentication
   - Implement role-based access control
   - Validate file types and sizes
   - Sanitize user input
   - Use secure indexes for queries

3. **Data Structure**
   - Keep documents small
   - Use subcollections for scalability
   - Implement proper data validation
   - Follow the principle of least privilege

4. **Performance**
   - Use pagination for large collections
   - Implement proper indexing
   - Cache frequently accessed data
   - Use batch operations for multiple updates

## Future AI Integration Considerations

The current setup supports future AI integration through:
1. Structured data models that can be easily processed
2. Secure access patterns for AI services
3. Metadata fields for AI-related information
4. Scalable database structure for machine learning features

## Deployment

1. Deploy Firestore Rules:
```bash
firebase deploy --only firestore:rules
```

2. Deploy Storage Rules:
```bash
firebase deploy --only storage:rules
```

3. Update Environment Variables on hosting platform

## Monitoring

1. Enable Firebase Analytics for monitoring
2. Set up error tracking
3. Monitor usage quotas
4. Set up alerts for security issues

## Regular Maintenance

1. Review security rules monthly
2. Update dependencies regularly
3. Monitor Firebase console for issues
4. Backup critical data
5. Review access patterns and optimize as needed
