# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
