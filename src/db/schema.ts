
/**
 * Database Schema for Muslim Dating Telegram Mini App
 * 
 * This file describes the database schema structure that would be used
 * in a real implementation with Supabase or another database.
 */

// Users table - stores user authentication information
export type UsersTable = {
  id: string;             // Primary key, UUID
  created_at: string;     // Timestamp with timezone
  email: string;          // User's email address (unique)
  password_hash: string;  // Hashed password (never stored in plain text)
  last_sign_in: string;   // Timestamp of last login
  premium: boolean;       // Whether user has premium subscription
  like_count: number;     // Number of likes user has given today
  last_like_date: string; // Date of last like (to reset daily counts)
}

// User profiles table - stores user profile information
export type UserProfilesTable = {
  id: string;               // Primary key, UUID
  user_id: string;          // Foreign key to users table
  name: string;             // User's display name
  age: number;              // User's age
  gender: 'male' | 'female'; // User's gender
  bio: string;              // User's biography/description
  religious_level: 'practicing' | 'moderate' | 'cultural'; // Level of religious practice
  marital_status: 'single' | 'divorced' | 'widowed'; // Current marital status
  looking_for: 'marriage' | 'friendship' | 'both'; // What user is looking for
  telegram_username: string; // User's Telegram username (shown only on match)
  location_city: string;    // City name
  location_country: string; // Country name
  latitude: number;         // Geographical latitude
  longitude: number;        // Geographical longitude
  created_at: string;       // Profile creation timestamp
  updated_at: string;       // Profile last update timestamp
}

// Profile photos table - stores links to user photos
export type ProfilePhotosTable = {
  id: string;              // Primary key, UUID
  profile_id: string;      // Foreign key to user_profiles table
  storage_path: string;    // Path to photo in storage
  position: number;        // Order position of photo (1, 2, 3, etc.)
  is_primary: boolean;     // Whether this is the main profile photo
  created_at: string;      // Upload timestamp
}

// User interests table - stores user interests/tags
export type UserInterestsTable = {
  id: string;              // Primary key, UUID
  profile_id: string;      // Foreign key to user_profiles table
  interest: string;        // Interest tag name
}

// Likes table - stores user likes/dislikes
export type LikesTable = {
  id: string;              // Primary key, UUID
  liker_id: string;        // User ID who gave the like
  likee_id: string;        // User ID who received the like
  is_like: boolean;        // true = like, false = dislike
  created_at: string;      // Timestamp when like/dislike occurred
}

// Matches table - automatically populated when mutual likes occur
export type MatchesTable = {
  id: string;              // Primary key, UUID
  user1_id: string;        // First user in match
  user2_id: string;        // Second user in match
  created_at: string;      // When the match occurred
  active: boolean;         // Whether match is still active
}

// User filters table - stores user search preferences
export type UserFiltersTable = {
  id: string;                 // Primary key, UUID
  user_id: string;            // Foreign key to users table
  min_age: number;            // Minimum age preference
  max_age: number;            // Maximum age preference
  distance: number;           // Maximum distance in km
  religious_levels: string[];  // Array of acceptable religious levels
  marital_statuses: string[];  // Array of acceptable marital statuses
  looking_for: string;        // What user wants to find
  has_telegram: boolean;      // Filter for profiles with Telegram
  created_at: string;         // When filters were created
  updated_at: string;         // When filters were last updated
}

/**
 * Database Schema Relationships:
 * 
 * 1. One User has one UserProfile (1:1)
 * 2. One UserProfile has many ProfilePhotos (1:N)
 * 3. One UserProfile has many UserInterests (1:N)
 * 4. Users can like/dislike many other Users (N:N through Likes)
 * 5. When two users like each other, a Match is created (derived from Likes)
 * 6. One User has one set of UserFilters (1:1)
 */

/**
 * Security Considerations:
 * 
 * 1. Row Level Security (RLS) policies ensure users can only:
 *    - Read their own private data
 *    - Read limited public data of other profiles
 *    - Update only their own data
 * 
 * 2. Telegram usernames are only visible when there's a mutual match
 * 
 * 3. User authentication handled via secure methods (JWT, OAuth)
 */

/**
 * Implementation Notes:
 * 
 * - In a real implementation with Supabase, we would implement this schema
 *   using SQL CREATE TABLE statements
 * - We would also implement RLS policies for each table
 * - Photo storage would use Supabase Storage
 * - Authentication would use Supabase Auth
 */
