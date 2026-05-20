# Practical 4: Connecting TikTok to PostgreSQL with Prisma ORM

## Project Overview
This practical exercise involved setting up a complete database solution for a TikTok clone application using PostgreSQL and Prisma ORM. The goal was to migrate from in-memory data models to persistent database storage while implementing secure authentication.

---

## Objectives Completed ✅

1. ✅ Set up a PostgreSQL database for the TikTok clone application
2. ✅ Configure Prisma ORM to interact with the database
3. ✅ Migrate from in-memory data models to persistent database storage
4. ✅ Implement authentication with password encryption
5. ✅ Update RESTful API endpoints to use the database
6. ✅ Create test data using seed scripts
7. ✅ Test all endpoints with proper JWT authentication

---

## Technology Stack Used

| Component | Technology | Version |
|-----------|-----------|---------|
| Database | PostgreSQL | Latest |
| ORM | Prisma | ^6.5.0 |
| Runtime | Node.js | LTS |
| Framework | Express.js | ^4.21.2 |
| Password Hashing | bcrypt | ^5.1.1 |
| Authentication | JWT (jsonwebtoken) | ^9.0.2 |
| Database GUI | pgAdmin 4 | Latest |

---

## Implementation Steps

### Part 1: Database Setup with pgAdmin 4

#### Step 1: Server Connection
- Opened pgAdmin 4 and created a new server connection named "Local PostgreSQL"
- Connected to localhost:5432 using default postgres credentials
- Verified connection successful

#### Step 2: Database Creation
- Created a new database named `tiktok_db` in pgAdmin 4
- Set owner to `postgres` user
- Successfully initialized empty database

![pgAdmin 4 - Database Creation](./image/pgadmin-database-creation.png)

#### Step 3: User Setup
- Created a dedicated database user `postgres` with password `dolkar86`
- Configured login permissions for the new user
- Set up database access privileges

![pgAdmin 4 - User Role Creation](./image/pgadmin-user-role.png)

![pgAdmin 4 - Schema Permissions](./image/pgadmin-permissions.png)

---

### Part 2: Prisma ORM Configuration

#### Step 1: Dependencies Installation
Installed all required packages:
```bash
npm install @prisma/client
npm install prisma --save-dev
npm install bcrypt jsonwebtoken
```

#### Step 2: Prisma Initialization
- Prisma directory created with `schema.prisma` file
- `.env` file generated for environment variables

#### Step 3: Environment Configuration
Created `.env` file with:
```
PORT=8000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:dolkar86@localhost:5432/tiktok_db?schema=public"
JWT_SECRET=sk_dev_a7f3c9e2b1d4f8k6m9n2p5q8r3t6v9x2z5c8f1h4k7m0n3q6t9w2z5c8f1h4
JWT_EXPIRE=30d
```

#### Step 4: Database Schema Definition
Defined complete Prisma schema with models:
- **User** - User accounts with authentication
- **Video** - Video content with metadata
- **Comment** - Video comments
- **VideoLike** - Video likes (many-to-many)
- **CommentLike** - Comment likes (many-to-many)
- **Follow** - User follow relationships (many-to-many)

---

### Part 3: Database Schema Implementation

#### Step 1: Prisma Client Setup
Created `src/lib/prisma.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
```

#### Step 2: Database Migrations
Executed migrations to create database tables:
```bash
npx prisma migrate dev --name init
```

Successfully created 3 migration versions:
- `20250325171138_init` - Initial schema
- `20250331012626_migration_sql` - Schema updates
- `20250416034921_add_storage_paths` - Storage paths addition

![Prisma Migrations - Successful Execution](./image/prisma-migrations.png)

#### Step 3: Authentication Middleware
Implemented JWT verification in `src/middleware/auth.js`:
- Token extraction from Authorization header
- JWT signature verification
- User lookup in database
- Attach user info to request object

---

### Part 4: API Controllers Updated

#### User Controller (`src/controllers/userController.js`)
- **getAllUsers** - Retrieve all users with stats
- **getUserById** - Get specific user profile
- **register** - Create new user with password hashing
- **login** - Authenticate and generate JWT token
- **updateProfile** - Update user information
- **follow** - User following functionality

Key Features:
- Password hashing with bcrypt (salt rounds: 10)
- JWT token generation for 30 days
- Secure password storage in database

#### Video Controller (`src/controllers/videoController.js`)
- **getAllVideos** - Paginated video feed
- **getVideoById** - Get single video details
- **createVideo** - Upload new video (protected)
- **updateVideo** - Edit video metadata (protected)
- **deleteVideo** - Remove video (protected)
- **likeVideo** - Like/unlike video (protected)

Key Features:
- Complex queries with relationships
- Transactions for data consistency
- Count and aggregation features

#### Comment Controller (`src/controllers/commentController.js`)
- **getComments** - Get video comments
- **createComment** - Add new comment (protected)
- **deleteComment** - Remove comment (protected)
- **likeComment** - Like/unlike comment (protected)

---

### Part 5: Routes and Authentication

#### Protected Routes Implementation
All sensitive endpoints now require JWT authentication:

**User Routes:**
- POST `/api/users/register` - Public
- POST `/api/users/login` - Public
- GET `/api/users` - Public (list all users)
- GET `/api/users/:id` - Public
- PUT `/api/users/:id` - Protected
- POST `/api/users/:userId/follow` - Protected

**Video Routes:**
- GET `/api/videos` - Public (feed)
- GET `/api/videos/:id` - Public
- POST `/api/videos` - Protected (create)
- PUT `/api/videos/:id` - Protected (update)
- DELETE `/api/videos/:id` - Protected (delete)
- POST `/api/videos/:videoId/like` - Protected

**Comment Routes:**
- GET `/api/videos/:videoId/comments` - Public
- POST `/api/videos/:videoId/comments` - Protected
- DELETE `/api/comments/:id` - Protected
- POST `/api/comments/:id/like` - Protected

---

### Part 6: Test Data Population

Created comprehensive seed script (`prisma/seed.js`) that populates:
- **10 Test Users** - With diverse profiles
- **50 Test Videos** - 5 per user
- **200 Test Comments** - Distributed across videos
- **300 Video Likes** - Random user interactions
- **150 Comment Likes** - Comment interactions
- **40 Follow Relationships** - User connections

Seed script features:
- Automatic data cleanup before seeding
- Password hashing for all test users
- Random data distribution
- Data validation and error handling

Run command:
```bash
npm run seed
```

![Seed Script Execution - Test Data Created](./image/seed-execution.png)

---

## Testing & Validation

### Server Startup
```bash
npm run dev
```
**Result:** Server running on http://localhost:8000 ✅

### API Testing Scenarios

#### 1. User Registration
**Request:**
```powershell
$user = @{
    username = "testuser123"
    email = "testuser@example.com"
    password = "Test@1234"
    name = "Test User"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/users/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $user
```

**Response:** User created successfully with hashed password ✅

![User Registration - 201 Created Response](./image/user-registration-test.png)

#### 2. User Login (JWT Token Generation)
**Request:**
```powershell
$login = @{
    email = "testuser@example.com"
    password = "Test@1234"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/users/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $login
```

**Response:** JWT token returned successfully ✅

![User Login - JWT Token Response](./image/user-login-jwt.png)

#### 3. Protected Route - Create Video
**Request:**
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
    "Content-Type" = "application/json"
}
$video = @{
    caption = "My first test video"
    videoUrl = "https://example.com/video.mp4"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/videos" `
    -Method POST `
    -Headers $headers `
    -Body $video
```

**Response:** Video created successfully with proper authorization ✅

---

## Frontend Integration

The TikTok frontend is successfully integrated with the PostgreSQL backend and displaying live data from the database:

![Frontend Integration - Live Data Display](./image/frontend-integration.png)

**Features working:**
- User profiles loaded from database
- Video feed displaying seeded content
- Navigation working (For You, Following, Find Users, Explore, LIVE)
- User data persisting across page reloads

---

## Project Structure

```
TikTok_Server-main/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── index.js               # Server entry point
│   ├── controllers/
│   │   ├── userController.js  # User operations
│   │   ├── videoController.js # Video operations
│   │   └── commentController.js # Comment operations
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── upload.js          # File upload handling
│   ├── routes/
│   │   ├── users.js           # User endpoints
│   │   ├── videos.js          # Video endpoints
│   │   └── comments.js        # Comment endpoints
│   ├── services/
│   │   └── storageService.js  # File storage
│   └── lib/
│       ├── prisma.js          # Prisma Client instance
│       └── supabase.js        # Supabase configuration
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.js                # Test data generation
│   └── migrations/            # Database migrations
├── .env                       # Environment variables
└── package.json               # Dependencies
```

---

## Key Concepts Implemented

### 1. Database Schema Design
- **Tables:** User, Video, Comment, Follow, VideoLike, CommentLike
- **Relationships:** One-to-many, many-to-many relationships
- **Foreign Keys:** Maintain referential integrity
- **Cascade Deletes:** Automatic cleanup of related data

### 2. Object-Relational Mapping (ORM)
- Prisma provides type-safe database access
- Eliminates manual SQL queries
- Automatic schema migrations
- Built-in relationship handling

### 3. Authentication & Security
- **Password Hashing:** bcrypt with 10 salt rounds
- **JWT Tokens:** Stateless, 30-day expiration
- **Protected Routes:** Middleware verification
- **Token Verification:** Signature and expiration checks

### 4. Prisma Specific Features
- **Model Definitions:** Declarative schema in schema.prisma
- **Relations:** Automatic join table management
- **Transactions:** Atomic multi-table operations
- **Aggregations:** Count, sum, and other calculations

---

## Security Measures Implemented

✅ Passwords hashed using bcrypt (never stored as plain text)
✅ JWT tokens for stateless authentication
✅ Protected API endpoints require valid tokens
✅ Password verification on login
✅ Environment variables for sensitive data
✅ Secure token expiration (30 days)
✅ User context attached to requests via middleware

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Database connection string | Used pgAdmin 4 to create DB and user, configured in .env |
| Password security | Implemented bcrypt hashing before database storage |
| Stateless authentication | Implemented JWT tokens with 30-day expiration |
| Protected routes | Created auth middleware to verify tokens |
| Test data generation | Created comprehensive seed script |
| Environment configuration | Created .env file with all required variables |

---

## Conclusion

Successfully completed Practical 4 by:
1. ✅ Setting up PostgreSQL database with pgAdmin 4
2. ✅ Configuring Prisma ORM for database operations
3. ✅ Implementing secure JWT authentication
4. ✅ Creating comprehensive database schema
5. ✅ Updating all API controllers to use Prisma
6. ✅ Testing all endpoints with proper authentication
7. ✅ Populating database with seed data

The TikTok clone now has:
- **Persistent data storage** using PostgreSQL
- **Secure authentication** with password hashing and JWT tokens
- **Complete API** with protected and public routes
- **Test data** for demonstration and testing

---

## Resources Used

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Authentication](https://jwt.io/)
- [bcrypt npm package](https://www.npmjs.com/package/bcrypt)

---

**Date Completed:** May 20, 2026
**Status:** ✅ COMPLETED
