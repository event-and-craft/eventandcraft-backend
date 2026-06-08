# EventCraft Database Schema Specification

This document provides a detailed overview of the database schema for the EventCraft platform. The schema covers users, creators, service catalogues, posts, social features, and global support structures (categories, galleries, and locations).

---

## Entity-Relationship Diagram

Below is the Mermaid ER diagram representing the tables and their relations:

```mermaid
erDiagram
    User ||--o{ userSearchFilter : "userId"
    User ||--o{ userSessions : "userId"
    User ||--o? creatorProfile : "userId"
    User ||--o{ intrestedUserCatgories : "userId"
    User ||--o{ serviceCatalogue : "userId"
    User ||--o{ reviews : "userId"
    User ||--o{ reviews : "creatorId"
    User ||--o{ followers : "followedTo"
    User ||--o{ followers : "followedFrom"
    User ||--o{ posts : "userId"
    User ||--o{ comments : "userId"
    User ||--o{ comments : "creatorId"
    User ||--o{ likes : "userId"
    User ||--o{ likes : "postCreatorId"
    User ||--o{ wishlist : "userId"
    User ||--o{ wishlist : "postCreatorId"

    gallery ||--o{ creatorProfile : "galleryId"
    gallery ||--o{ serviceImage : "galleryId"
    gallery ||--o{ post_media : "galleryId"

    categoires ||--o{ userSearchFilter : "location"
    locations ||--o{ userSearchFilter : "location"
    
    categoires ||--o{ intrestedUserCatgories : "categorieId"
    categoires ||--o{ serviceCatalogue : "category"
    categoires ||--o{ categoires : "parentid"

    serviceCatalogue ||--o{ serviceImage : "catalog_item_id"
    serviceCatalogue ||--o{ ItemAddOn : "catalog_item_id"
    serviceCatalogue ||--o{ reviews : "serviceId"
    serviceCatalogue ||--o{ posts : "connectedserviceId"
    serviceCatalogue ||--o{ post_service_connector : "serviceId"

    posts ||--o{ post_service_connector : "postId"
    posts ||--o{ post_media : "postId"
    posts ||--o{ comments : "postId"
    posts ||--o{ likes : "postId"
    posts ||--o{ wishlist : "postId"
```

---

## Table Specifications

### 1. User & Auth Module

#### User
Represents core user identity, credentials, and settings.
* **Table Name**: `users`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique user identifier. |
| `profileImg` | String | Nullable | URL of the profile image. |
| `priority` | Integer | Indexed | priority ranking/indexing. |
| `name` | String | Indexed | Full name. |
| `username` | String | Indexed, Unique | Unique handle. |
| `mobile` | String | Nullable | Phone number. |
| `email` | String | Unique, Indexed | Primary contact/login email. |
| `password` | String | Nullable | Hashed password (null for social auth). |
| `isAdmin` | Boolean | Default: `false` | Admin status flag. |
| `userType` | Integer | `0: Admin`, `1: User`, `2: Creator` | Role classification. |
| `authType` | String | `Oauth-google`, `Oauth-apple`, `emailandpassword` | Signup provider mechanism. |
| `optmisticLock`| Integer | Default: `0` | Lock version to reduce deadlocks. |
| `status` | String | `active`, `blocked`, `pending-verification` | Account lifecycle state. |
| `createdAt` | Integer | Timestamps | Date of registration. |
| `updatedAt` | Integer | Timestamps | Date of last profile update. |
| `createdBy` | String | Nullable | Auditor / Creator ID. |
| `updatedUBy` | String | Nullable | Auditor / Modifier ID. |
| `deletedAt` | DateTime | Paranoid | Soft delete timestamp. |

#### userSearchFilter
Stores search and feed filter configurations customized by users.
* **Table Name**: `user_search_filters`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Filter setting identifier. |
| `userId` | UUID | Foreign Key (`User.id`) | Belongs to user. |
| `location` | UUID | Foreign Key (`locations.id`) | Filtered geographical boundary. |
| `basicIntrestFilter` | String | Nullable | Keywords or preferences. |
| `status` | String | `active`, `inactive` | Filter status. |

#### userSessions
Active authentication sessions for multiple device logins.
* **Table Name**: `user_sessions`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Session identifier. |
| `userId` | UUID | Foreign Key (`User.id`) | Owner of the session. |
| `ipAddress` | String | Nullable | IP address of login. |
| `location` | String | Nullable | Resolved geography. |
| `token` | String | Nullable | JWT or session reference. |
| `status` | String | `active`, `deactivate` | Login validity status. |
| `deviceName` | String | Nullable | Device user-agent tag. |
| `createdAt` | Integer | Timestamps | Session start. |
| `updatedAt` | Integer | Timestamps | Session last access. |
| `createdBy` | String | Nullable | Creator auditor. |
| `updatedUBy` | String | Nullable | Modifier auditor. |
| `deletedAt` | DateTime | Paranoid | Soft delete session. |

---

### 2. Creator Profiles & Catalogues

#### creatorProfile
Extended details for users who register as Creators.
* **Table Name**: `creator_profiles`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Profile record identifier. |
| `userId` | UUID | Foreign Key (`User.id`) | Refers to base user. |
| `galleryId` | UUID | Foreign Key (`gallery.id`) | Showcase/banner gallery. |
| `creatorID` | String | Unique | Autogenerated unique public creator ID. |
| `profileImg` | String | Nullable | Secondary profile image source. |
| `profileupdateStage`| Integer | Default: `0` | Stage progression tracker. |
| `isApprovedTandC` | Boolean | Default: `false` | Has accepted Terms & Conditions. |
| `age` | Integer | Nullable | Age. |
| `address` | String | Nullable | Street address. |
| `city` | String | Nullable | City. |
| `state` | String | Nullable | State / Region. |
| `nationality` | String | Nullable | Country of origin. |
| `govId` | String | Nullable | Government identification verification token/reference. |
| `bio` | String | Nullable | Bio text introduction. |
| `creatorProfileStatus`| String| `approval-pending`, `enabled`, `disabled`, `blocked` | Account lifecycle state. |
| `totalfollowing` | Integer | Default: `0` | Count of entities followed. |
| `totalrating` | Float | Default: `0.0` | Average review rating. |
| `totalfollowers` | Integer | Default: `0` | Count of followers. |
| `totalevents` | Integer | Default: `0` | Created event catalogue count. |
| `createdAt` | Integer | Timestamps | Date of creation. |
| `updatedAt` | Integer | Timestamps | Date of last modification. |
| `createdBy` | String | Nullable | Creator auditor. |
| `updatedUBy` | String | Nullable | Modifier auditor. |

#### intrestedUserCatgories
Categories that users are interested in (used for matching feeds).
* **Table Name**: `interested_user_categories`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Log identifier. |
| `categorieId` | UUID | Foreign Key (`categoires.id`) | Target category ID. |
| `userId` | UUID | Foreign Key (`User.id`) | Interested user ID. |
| `createdAt` | Integer | Timestamps | Log created date. |
| `updatedAt` | Integer | Timestamps | Log updated date. |
| `createdBy` | String | Nullable | Creator auditor. |
| `updatedUBy` | String | Nullable | Modifier auditor. |

---

### 3. Service Catalogue

#### serviceCatalogue
Products or services offered by creators.
* **Table Name**: `service_catalogues`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Catalog item identifier. |
| `userId` | UUID | Foreign Key (`User.id`) | Provider User ID. |
| `creatorID` | String | Nullable | Provider Creator identifier. |
| `serviceName` | String | Nullable | Label of the service. |
| `serviceType` | String | `product`, `service` | Offering classification. |
| `fulfillment_type` | String | `Digital Interaction`, `Physical Product` | Fulfillment mechanism. |
| `description` | String | Nullable | Detailed specifications. |
| `bannerImage` | String | Nullable | Feature image URL. |
| `category` | UUID | Foreign Key (`categoires.id`) | Grouping classification. |
| `status` | String | `approved`, `draft` | Listing lifecycle state. |
| `base_price` | Integer | Divide by 100 on fetch | Price represented in Fils/Cents. |
| `is_starting_price`| Boolean | Default: `false` | Indicates price varies ("Starts at..."). |

#### serviceImage
Media/Images attached to a catalogue entry.
* **Table Name**: `service_images`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Image identifier. |
| `catalog_item_id` | UUID | Foreign Key (`serviceCatalogue.id`) | Belongs to item. |
| `name` | String | Nullable | Custom title. |
| `url` | String | Nullable | CDN/Storage media path. |
| `galleryId` | UUID | Foreign Key (`gallery.id`) | Refers to raw file gallery asset. |
| `main` | Boolean | Default: `false` | Is hero image for item. |
| `order` | Integer | Default: `0` | Sort index for display. |

#### ItemAddOn
Add-ons or upgrades for catalogue items.
* **Table Name**: `item_add_ons`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Upgrade option identifier. |
| `catalog_item_id` | UUID | Foreign Key (`serviceCatalogue.id`) | Reference item. |
| `title` | String | Nullable | Description label. |
| `price_fils` | Integer | Price | Additional cost in Fils. |
| `is_mandatory` | Boolean | Default: `false` | Must be purchased with base item. |

#### reviews
Customer reviews for catalogue items and creators.
* **Table Name**: `reviews`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Review record. |
| `userId` | UUID | Foreign Key (`User.id`) | Review author. |
| `title` | String | Nullable | Subject headline. |
| `description` | String | Nullable | Body text copy. |
| `rating` | Integer | 1 to 5 scale | Numerical rating score. |
| `serviceId` | UUID | Foreign Key (`serviceCatalogue.id`) | Refers to item. |
| `creatorId` | UUID | Foreign Key (`User.id`) | Target Creator profile user. |

---

### 4. Posts & Social Interaction

#### followers
Follow connections between users/creators.
* **Table Name**: `followers`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Follow record ID. |
| `followedTo` | UUID | Foreign Key (`User.id`) | User receiving the follow. |
| `followedFrom` | UUID | Foreign Key (`User.id`) | User initiating the follow. |
| `status` | Boolean | Default: `true` | Active/inactive relationship. |

#### posts
Feed posts authored by creators.
* **Table Name**: `posts`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Post identifier. |
| `userId` | UUID | Foreign Key (`User.id`) | Author User ID. |
| `creatorID` | String | Nullable | Author Creator ID. |
| `content` | String | Nullable | Rich body text or copy. |
| `status` | String | `draft`, `published`, `scheduled` | Publication status. |
| `tags` | Array of Strings | Default: `[]` | Post indexing hashtags. |
| `likes` | Integer | Counter cache, Default: `0` | Number of likes. |
| `comments` | Integer | Counter cache, Default: `0` | Number of comments. |
| `shareCount` | Integer | Counter cache, Default: `0` | Number of shares. |
| `connectedserviceId`| UUID | Foreign Key (`serviceCatalogue.id`) | Optional linked catalogue item. |

#### post_service_connector
Connects specific services/offers directly inside feed posts.
* **Table Name**: `post_service_connectors`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `postId` | UUID | Foreign Key (`posts.id`) | Source post. |
| `type` | String | `price`, `custom` | Link layout style. |
| `tag` | String | Nullable | Promotion tag / Badge label. |
| `offer` | String | Nullable | Promotional discount details. |
| `serviceId` | UUID | Foreign Key (`serviceCatalogue.id`) | Connected service details. |

#### post_media
Attached files/images for post slider.
* **Table Name**: `post_medias`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Media reference index. |
| `postId` | UUID | Foreign Key (`posts.id`) | Belongs to post. |
| `name` | String | Nullable | Label. |
| `url` | String | Nullable | Asset link (CDN). |
| `galleryId` | UUID | Foreign Key (`gallery.id`) | Refers to file entry in gallery. |
| `main` | Boolean | Default: `false` | Is cover media. |
| `order` | Integer | Default: `0` | Slider ordering index. |

#### comments
User-generated comments on posts.
* **Table Name**: `comments`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Comment index. |
| `userId` | UUID | Foreign Key (`User.id`) | Author User ID. |
| `title` | String | Nullable | Header note. |
| `description` | String | Nullable | Message body text. |
| `rating` | Integer | Nullable | Optional reaction rating. |
| `postId` | UUID | Foreign Key (`posts.id`) | Target Post. |
| `creatorId` | UUID | Foreign Key (`User.id`) | Target Author User ID. |

#### likes
User likes on posts.
* **Table Name**: `likes`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Record index. |
| `userId` | UUID | Foreign Key (`User.id`) | Liked-by user ID. |
| `postId` | UUID | Foreign Key (`posts.id`) | Target Post. |
| `postCreatorId`| UUID | Foreign Key (`User.id`) | Post author/creator ID. |

#### wishlist
User wishlisted items/posts.
* **Table Name**: `wishlists`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Record index. |
| `userId` | UUID | Foreign Key (`User.id`) | Wishlisted-by user ID. |
| `postId` | UUID | Foreign Key (`posts.id`) | Reference post. |
| `postCreatorId`| UUID | Foreign Key (`User.id`) | Reference post author. |

---

### 5. Global / Shared Structures

#### categoires
Hierarchical structure for grouping services, portfolios, or creators.
* **Table Name**: `categories`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Category identifier. |
| `isParent` | String / Boolean | Nullable | Flag if it can have child nodes. |
| `parentid` | UUID | Foreign Key (`categoires.id`) | Parent node for subcategories. |
| `icon` | String | Nullable | Material icon name or image URL. |
| `name` | String | Nullable | Display name. |
| `description`| String | Nullable | Long description text. |

#### gallery
Stores global file assets (images, videos, documents) upload logs.
* **Table Name**: `galleries`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Gallery asset identifier. |
| `url` | String | Nullable | File URI (e.g. Firebase storage link). |
| `name` | String | Nullable | Filename. |
| `fileType` | String | `image`, `video`, `gif`, `doc` | MIME-type simplification. |
| `format` | String | Nullable | File extension (e.g., `png`, `mp4`). |
| `visiblity` | String | `public`, `private` | Access control tier. |

#### locations
Lookup table for valid geographical regions or points of interest.
* **Table Name**: `locations`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Location identifier. |
| `name` | String | Nullable | City / Region name. |
| `description`| String | Nullable | Extended notes. |
| `status` | String | `active`, `inactive` | Availability status. |
| `mapPointer` | String | Nullable | Coordinates JSON or map string. |

#### languages
Lookup table for supported languages in the system.
* **Table Name**: `languages`

| Column | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Language identifier. |
| `name` | String | Nullable | Name of the language. |
| `code` | String | Unique | Short code identifier (e.g. en, ar). |
| `status` | String | `active`, `inactive` | Availability status. |
