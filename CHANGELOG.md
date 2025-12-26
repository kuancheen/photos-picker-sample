# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4 (Beta)] - 2024-12-27

### Fixed
- Download full video from Google Photos using `=dv` parameter instead of preview
- This fixes YouTube "Processing abandoned" error caused by uploading incomplete video files

## [0.1.3 (Beta)] - 2024-12-27

### Fixed
- **YouTube upload now works!** Fixed endpoint URL to use `/upload/youtube/v3` instead of `/youtube/v3`
- Added detailed logging for upload debugging

## [0.1.2 (Beta)] - 2024-12-27

### Fixed
- Added required `X-Upload-Content-Type` and `X-Upload-Content-Length` headers for YouTube resumable upload
- Improved error messages with helpful troubleshooting steps for common YouTube API errors

## [0.1.1 (Beta)] - 2024-12-27

### Fixed
- Corrected element ID reference for selected photos section

## [0.1.0 (Beta)] - 2024-12-27

### Added
- **YouTube Upload Feature** for GitHub Pages version
- Upload videos from Google Photos directly to YouTube
- OAuth scope for YouTube Data API v3
- Upload buttons on video cards with YouTube red theme
- Resumable upload protocol for large videos
- User prompts for video title, description, and privacy settings

## [0.0.9 (Beta)] - 2024-12-27

### Added
- "Clear Config" button in footer to reset Client ID configuration
- Confirmation dialog before clearing configuration

## [0.0.8 (Beta)] - 2024-12-27

### Fixed
- Photo thumbnails now load correctly by fetching with Bearer token authentication
- Converted authenticated image responses to blob URLs to bypass 403 Forbidden errors
- Updated to use `mediaFile.filename` and `mediaFile.mimeType` from API response

## [0.0.7 (Beta)] - 2024-12-27

### Fixed
- Photo thumbnails now load correctly by accessing `baseUrl` from nested `mediaFile` object
- Updated metadata display to use `item.type` (VIDEO/PHOTO) as fallback

## [0.0.6 (Beta)] - 2024-12-27

### Fixed
- Added error handling for missing photo baseUrl
- Added console logging to debug thumbnail loading issues
- Added fallback placeholder images when thumbnails fail to load

## [0.0.5 (Beta)] - 2024-12-27

### Changed
- Replaced configuration modal with inline input field for simpler UX
- Added inline success/error messages for configuration feedback
- Removed modal completely - cleaner, more straightforward interface

## [0.0.4 (Beta)] - 2024-12-27

### Fixed
- Modal no longer auto-popups on page load; only shows when user clicks "Configure" button
- Photo metadata now shows "Image" instead of "undefined" when mimeType is missing

### Changed
- Improved sign-in UX: auto-connects if Client ID exists in localStorage

## [0.0.3 (Beta)] - 2024-12-27

### Fixed
- Improved Google Identity Services initialization timing to prevent race condition errors

## [0.0.2 (Beta)] - 2024-12-27

### Fixed
- Modal close button now works correctly after configuration
- Google Sign-In button renders programmatically to prevent undefined client_id error

### Added
- HTML comment header in `index.html` with app metadata
- Favicon (📸 emoji as SVG data URI)
- Cache bursting for CSS and JS assets
- Version update workflow for automated version management

## [0.0.1 (Beta)] - 2024-12-27

### Added
- Initial beta release
- GitHub Codespaces version (Node.js + Passport) in `/server` directory
- GitHub Pages version (client-side) in `/docs` directory
- Modal-based configuration for easy setup
- Comprehensive documentation for both deployment options


### Added
- Initial project release.
- Added GitHub Codespaces configuration (`.devcontainer`).
- Creating GitHub repository `photos-picker-sample`.
