# Admin Panel Setup Guide

## Overview
The admin panel allows you to manage all dynamic content for the Sukhrup Garden website through Firebase.

## Setup Steps

### 1. Firebase Configuration
The Firebase configuration is already set up in `src/lib/firebase.ts`. Make sure your Firebase project is created and the configuration matches your Firebase Console settings.

### 2. Create Firebase Database Collections
In your Firebase Console, create the following Firestore collections:

#### Hero Slides (`heroSlides`)
- `image`: string (URL to image in Storage)
- `subtitle`: string
- `title`: string
- `description`: string
- `order`: number

#### About Content (`aboutContent`)
- `title`: string
- `description`: string
- `stats`: array of objects with `icon`, `value`, `suffix`, `label`

#### Facilities (`facilities`)
- `icon`: string
- `title`: string
- `desc`: string
- `order`: number

#### Services (`services`)
- `image`: string (URL to image in Storage)
- `title`: string
- `desc`: string
- `order`: number

#### Gallery Items (`galleryItems`)
- `image`: string (URL to image/video in Storage)
- `label`: string
- `type`: "image" | "video"
- `order`: number

#### Testimonials (`testimonials`)
- `name`: string
- `event`: string
- `comment`: string
- `rating`: number (1-5)
- `order`: number

#### Contact Info (`contactInfo`)
- `phone`: string
- `email`: string
- `address`: string
- `mapUrl`: string
- `socialMedia`: array of objects with `platform`, `url`

#### Booking Info (`bookingInfo`)
- `title`: string
- `subtitle`: string
- `ctaText`: string
- `ctaLink`: string

### 3. Enable Authentication
In Firebase Console, enable Email/Password authentication method.

### 4. Default Admin Credentials
Default login credentials (change after first login):
- Email: `admin@sukhroopgardan.com`
- Password: `admin123`

### 5. Access Admin Panel
Navigate to `/admin/login` to access the admin panel.

## Features

### Hero Slides Management
- Add new slides with images
- Edit existing slides
- Delete slides
- Reorder slides

### About Section
- Edit title and description
- Manage statistics cards
- Add/remove stats

### Facilities
- Add new facilities
- Edit facility details
- Delete facilities
- Manage facility order

### Services
- Add new services with images
- Edit service details
- Delete services
- Manage service order

### Gallery
- Add images/videos to gallery
- Edit gallery items
- Delete items
- Manage display order

### Testimonials
- Add new testimonials
- Edit existing testimonials
- Delete testimonials
- Manage ratings

### Contact Information
- Update contact details
- Add social media links
- Update map URL

### Booking Banner
- Edit banner text
- Update CTA button text and link

## Security Notes

1. **Change Default Password**: After first login, change the default admin password
2. **Firebase Rules**: Set up proper Firestore security rules to prevent unauthorized access
3. **Environment Variables**: Consider moving Firebase config to environment variables for production

## Future Enhancements

- Image upload directly to Firebase Storage
- Rich text editor for descriptions
- Bulk import/export functionality
- User role management
- Audit logs for changes
