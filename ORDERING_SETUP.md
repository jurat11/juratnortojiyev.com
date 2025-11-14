# Ordering Setup Guide

This guide explains how to set up the new ordering functionality for experiences and projects.

## Database Migration

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the `database_migration.sql` script to add the `display_order` columns

## Features Added

### 1. Display Order Field
- Each experience and project now has a `display_order` field
- Lower numbers appear first on the website
- Default value is 0

### 2. Admin Panel Updates
- **Drag and Drop**: You can now drag items to reorder them
- **Display Order Input**: Manual input field for precise ordering
- **Visual Feedback**: Items being dragged become semi-transparent

### 3. Website Display
- Experiences and projects are now ordered by `display_order` first, then by creation date
- The order you set in the admin panel will be reflected on the main website

## How to Use

### Reordering Items
1. Go to the Admin Panel (`/admin`)
2. Navigate to Experiences or Projects tab
3. Use the drag handle (↕️ icon) to drag items up or down
4. Drop them in the desired position
5. The order will be automatically saved

### Manual Order Setting
1. Edit any experience or project
2. Set the "Display Order" field (0 = first, 1 = second, etc.)
3. Save the changes

### Contact Information Updates
- Email: juratjushkinovich@gmail.com
- LinkedIn: https://www.linkedin.com/in/jur-at-nortojiyev-5399b034a/

## Technical Details

- The `display_order` field is an integer
- Items are sorted by `display_order` ASC, then by `created_at` DESC
- Drag and drop updates all affected items' display_order values
- The system automatically handles reordering when items are moved

## Troubleshooting

If items don't appear in the correct order:
1. Check that the database migration was run successfully
2. Verify that `display_order` values are set correctly
3. Clear your browser cache and refresh the page








