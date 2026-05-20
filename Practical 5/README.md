# Practical 5: Implementing Cloud Bucket Storage with Supabase

## Project Overview

This practical involved upgrading the TikTok web application from local file storage to cloud storage using **Supabase Storage**. This migration enhances the application's scalability, reliability, and performance by leveraging cloud infrastructure and CDN distribution.

---

## What Was Accomplished

### ✅ Completed Tasks

#### **Part 1: Backend Implementation**

1. **Installed Supabase SDK**
   - Added `@supabase/supabase-js` (v2.106.1) to backend dependencies
   - Command: `npm install @supabase/supabase-js`

2. **Created Supabase Client Configuration**
   - File: `src/lib/supabase.js`
   - Initialized Supabase client with service role key for secure server-side operations
   - Exports authenticated Supabase instance for storage operations

3. **Set Up Environment Variables**
   - File: `.env`
   - Added Supabase credentials:
     - `SUPABASE_URL`: Project URL
     - `SUPABASE_SERVICE_KEY`: Service role key (for server-side operations)
     - `SUPABASE_PUBLIC_KEY`: Anon key (for client-side operations)
     - `SUPABASE_STORAGE_URL`: Storage API endpoint

4. **Created Storage Service**
   - File: `src/services/storageService.js`
   - Implemented utility functions:
     - `uploadFile()`: Upload files to Supabase buckets
     - `uploadLocalFile()`: Upload existing local files to Supabase
     - `getPublicUrl()`: Generate public URLs for uploaded files
     - `removeFile()`: Delete files from Supabase
     - `generateUniqueFileName()`: Create collision-resistant file names

5. **Updated Video Controller**
   - File: `src/controllers/videoController.js`
   - Modified `createVideo()` to:
     - Accept direct URLs from browser uploads
     - Handle legacy file uploads with automatic Supabase migration
     - Store both public URLs and storage paths in database
   - Modified `deleteVideo()` to:
     - Delete video and thumbnail files from Supabase before database deletion
     - Clean up storage resources properly

6. **Updated Prisma Schema**
   - File: `prisma/schema.prisma`
   - Added new fields to Video model:
     - `videoStoragePath`: Path to video in Supabase
     - `thumbnailStoragePath`: Path to thumbnail in Supabase
   - These fields enable proper cleanup when videos are deleted

7. **Created Migration Script**
   - File: `scripts/migrateVideosToSupabase.js`
   - Allows migration of existing locally-stored videos to Supabase

#### **Part 2: Frontend Implementation**

1. **Installed Supabase Client**
   - Added `@supabase/supabase-js` (v2.49.4) to frontend dependencies
   - Command: `npm install @supabase/supabase-js`

2. **Created Supabase Client Configuration**
   - File: `src/lib/supabase.js`
   - Configured with public key for browser-based uploads
   - Enables direct upload from browser to Supabase (no server intermediary)

3. **Set Up Environment Variables**
   - File: `.env.local`
   - Added frontend configuration:
     - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
     - `NEXT_PUBLIC_SUPABASE_PUBLIC_KEY`: Anon public key
     - `NEXT_PUBLIC_API_BASE_URL`: Backend API URL

4. **Updated Upload Service**
   - File: `src/services/uploadService.js`
   - Implemented direct browser uploads:
     - `uploadVideoToStorage()`: Upload videos directly to Supabase
     - `uploadThumbnailToStorage()`: Upload thumbnails directly to Supabase
     - `createVideo()`: Send metadata to backend after upload
   - Features:
     - Unique file naming with timestamps and random strings
     - Storage path organization by user ID
     - Public URL generation for immediate playback
     - Error handling and user feedback

5. **Updated Upload Page**
   - File: `src/app/upload/page.jsx`
   - Integrated direct Supabase uploads
   - Replaced local file uploads with cloud storage
   - Maintains upload progress tracking and feedback

6. **Updated VideoCard Component**
   - File: `src/components/ui/VideoCard.jsx`
   - Modified `getFullVideoUrl()` function to:
     - Recognize Supabase URLs as complete (no prefix needed)
     - Handle both cloud URLs and legacy local URLs
     - Fallback support for older videos

---

## Configuration Details

### Supabase Setup

**Project:** TikTok
**URL:** https://rirhsvmvzcgddqlichad.supabase.co

**Storage Buckets Created:**

![Buckets Overview](image/2.png)
*Supabase Storage showing both video and thumbnails buckets with 4 policies each*

1. **video** (PUBLIC)
   - Stores user-uploaded video files
   - Access level: Public (anyone can view)
   - File size limit: 50 MB default
   - Allowed MIME types: Any

2. **thumbnails** (PUBLIC)
   - Stores video thumbnail images
   - Access level: Public (anyone can view)
   - File size limit: 50 MB default
   - Allowed MIME types: Any

**Storage Policies:**

VIDEO Bucket Policies:
![VIDEO Bucket Policies](image/3.png)
*VIDEO bucket with policies for public downloads and authenticated uploads*

THUMBNAILS Bucket Policies:
![THUMBNAILS Bucket Policies](image/4.png)
*THUMBNAILS bucket with policies for public access and authenticated modifications*

- Authenticated users can upload to their user-specific folders
- Public access for downloading/viewing files
- Files organized by user ID: `user-{userId}/{filename}`

### Environment Configuration

#### Backend (.env)
```env
# Server settings
PORT=8000
NODE_ENV=development

# Database settings
DATABASE_URL="postgresql://tiktok_user:Tshewanglham2006%2F@localhost:5432/tiktok_db?schema=public"

# JWT settings
JWT_SECRET=tiktok_app_super_secret_key_2025
JWT_EXPIRE=30d

# Supabase Configuration (Cloud Storage)
SUPABASE_URL=https://rirhsvmvzcgddqlichad.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcmhzdm12emNnZGRxbGljaGFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODkxMzA2OSwiZXhwIjoyMDk0NDg5MDY5fQ.RQQg1rUhXfecIBho9yqblyXxNlC_VWcCaBUsMa4iW9k
SUPABASE_PUBLIC_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcmhzdm12emNnZGRxbGljaGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTMwNjksImV4cCI6MjA5NDQ4OTA2OX0.8Tekl-Gv6uhpWLGTnY5aIpasuA0SJopU8MDKjeLX5KQ
SUPABASE_STORAGE_URL=https://rirhsvmvzcgddqlichad.supabase.co/storage/v1
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://rirhsvmvzcgddqlichad.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLIC_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcmhzdm12emNnZGRxbGljaGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTMwNjksImV4cCI6MjA5NDQ4OTA2OX0.8Tekl-Gv6uhpWLGTnY5aIpasuA0SJopU8MDKjeLX5KQ
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## How It Works

### Upload Flow

```
1. User selects video/thumbnail in browser
   ↓
2. Frontend validates file (type, size)
   ↓
3. Browser uploads directly to Supabase Storage
   ↓
4. Supabase returns public URL and storage path
   ↓
5. Frontend sends video metadata to backend with URL and storage path
   ↓
6. Backend stores video record in database (with storage paths)
   ↓
7. Video is now accessible via public URL
```

### Delete Flow

```
1. User deletes their video
   ↓
2. Backend retrieves video record from database
   ↓
3. Backend deletes video file from Supabase Storage (using storage path)
   ↓
4. Backend deletes thumbnail from Supabase Storage (if exists)
   ↓
5. Backend deletes video record from database
```

### Key Advantages

- **Scalability**: Unlimited storage with automatic scaling
- **Performance**: Global CDN for fast video delivery
- **Reliability**: Built-in redundancy and automatic backups
- **Security**: Fine-grained access control and authentication
- **Cost-effectiveness**: Pay only for used storage and bandwidth
- **Reduced server load**: Direct browser→cloud uploads skip server
- **Automatic cleanup**: Old versions and deleted files removed from storage

---

## Files Modified/Created

### Backend
| File | Status | Changes |
|------|--------|---------|
| `src/lib/supabase.js` | ✅ Created | Supabase client initialization |
| `src/services/storageService.js` | ✅ Created | Storage utility functions |
| `src/controllers/videoController.js` | ✅ Updated | Cloud storage integration |
| `prisma/schema.prisma` | ✅ Updated | Added storage path fields |
| `scripts/migrateVideosToSupabase.js` | ✅ Created | Migration utility |
| `.env` | ✅ Updated | Supabase credentials |

### Frontend
| File | Status | Changes |
|------|--------|---------|
| `src/lib/supabase.js` | ✅ Created | Supabase client configuration |
| `src/services/uploadService.js` | ✅ Updated | Direct cloud uploads |
| `src/app/upload/page.jsx` | ✅ Updated | Cloud upload integration |
| `src/components/ui/VideoCard.jsx` | ✅ Updated | Cloud URL handling |
| `.env.local` | ✅ Updated | Supabase public credentials |

---

## Testing Checklist

✅ **Successful Upload Verification:**

![Video Upload Success](image/5.png)
*Success confirmation message after video upload*

- [ ] Start backend: `npm run dev` (in TikTok_Server-main)
- [ ] Start frontend: `npm run dev` (in TikTok_Frontend-main)
- [ ] Sign up/login to application
- [ ] Navigate to Upload page
- [ ] Select a video file (< 100MB)
- [ ] Add optional thumbnail
- [ ] Enter caption
- [ ] Click Upload
- [ ] Verify upload completes successfully
- [ ] Check Supabase dashboard → Storage → video bucket for file
- [ ] Navigate to home feed
- [ ] Verify video plays from Supabase URL
- [ ] Test delete video functionality
- [ ] Verify files are removed from Supabase Storage

---

## Migration (Existing Videos)

If you have existing videos in local storage:

```bash
cd TikTok_Server-main
node scripts/migrateVideosToSupabase.js
```

This script will:
1. Find all videos in the database
2. Upload them to Supabase Storage
3. Update database records with new URLs and storage paths
4. Maintain data integrity during migration

---

## Troubleshooting

### "Bucket not found" Error
- Ensure buckets named `video` and `thumbnails` exist in Supabase
- Check bucket access permissions (should be PUBLIC)

### "Upload failed" Error
- Verify Supabase credentials in `.env` and `.env.local`
- Check file size (max 100MB for videos)
- Ensure user is authenticated

### "Video won't play" Error
- Verify Supabase URL in VideoCard component
- Check browser console for 404 errors
- Ensure video file was successfully uploaded to Supabase

### Prisma Client Error
- Run: `npx prisma generate` in server directory
- Ensure database connection is valid in `.env`

---

## Project Structure

```
TikTok_Server-main/
├── src/
│   ├── lib/
│   │   ├── supabase.js (NEW)
│   │   └── prisma.js
│   ├── services/
│   │   └── storageService.js (NEW)
│   ├── controllers/
│   │   └── videoController.js (UPDATED)
│   └── ...
├── prisma/
│   └── schema.prisma (UPDATED)
├── scripts/
│   └── migrateVideosToSupabase.js (NEW)
└── .env (UPDATED)

TikTok_Frontend-main/
├── src/
│   ├── lib/
│   │   └── supabase.js (NEW)
│   ├── services/
│   │   └── uploadService.js (UPDATED)
│   ├── app/
│   │   └── upload/
│   │       └── page.jsx (UPDATED)
│   └── components/
│       └── ui/
│           └── VideoCard.jsx (UPDATED)
└── .env.local (UPDATED)
```

---

## Summary

This practical successfully migrated the TikTok application from local file storage to **Supabase Cloud Storage**, enabling:

- ✅ Direct browser-to-cloud uploads (reducing server load)
- ✅ Global CDN distribution for faster video delivery
- ✅ Automatic file cleanup on video deletion
- ✅ Scalable storage solution for growth
- ✅ Improved reliability and redundancy
- ✅ Backward compatibility with existing videos

**Working Application Demo:**

![TikTok App Demo](image/6.png)
*Successfully playing a video (kunzang dance) uploaded through the cloud storage system*

**Implementation Status: 100% Complete**

The application is now ready for production-grade cloud storage with enterprise-level reliability and performance.

---

**Date Completed:** May 21, 2026  
**Framework:** Next.js (Frontend) + Express.js (Backend)  
**Database:** PostgreSQL (via Prisma)  
**Cloud Storage:** Supabase Storage
