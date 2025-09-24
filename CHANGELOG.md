# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-09-23

Initial release: Expo React Native app for book tracking and reviews
UI library: React Native Paper
Navigation: Expo Router (Home, Add Book, Saved Books, Search tabs)
Tab bar icons: MaterialCommunityIcons (home, book-plus, bookshelf, magnify)
Add Book screen: photo picker, description, rating, tags, category
Local data storage: SQLite (expo-sqlite async API)
Saved Books tab: displays all saved books from database
Improved UI/UX: spacing, error handling, form reset
Removed unused tabs and icons, cleaned up navigation
CHANGELOG.md now uses semantic versioning

### [Saved Books Refresh] - 2025-09-23

- Saved Books tab now automatically refreshes and displays new books whenever you navigate back to it
- Uses Expo Router's focus event for seamless updates

### [Camera Feature] - 2025-09-23

- Add Book screen now supports direct photo capture using device camera (Expo Image Picker)
- Users can take a photo of the book and attach it to their review
- Camera permission handling and error alerts added
- UI restored and improved for photo, description, rating, tags, and category

### [UI/UX Polish] - 2025-09-23

- Polished Book Details screen: card styling, improved spacing, accessibility labels, consistent layout
- Polished Saved Books screen: card shadow, improved spacing, accessibility, consistent layout
