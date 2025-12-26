# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-26

### Added
- **GitHub Pages version**: Client-side implementation in `/docs` directory
- Client-side authentication using Google Identity Services
- Modern dark-themed UI for GitHub Pages version
- Live demo at https://kuancheen.github.io/photos-picker-sample
- Configuration template (`config-template.js`) for easy setup

### Changed
- **Repository restructure**: Moved Node.js server code to `/server` directory
- Updated `.devcontainer` to work with new `/server` structure
- Comprehensive README with both deployment options
- Updated version badges to v2.0.0

### Fixed
- Passport authentication issues (downgraded to v0.6.0)
- Duplicate strategy configuration in server version

## [1.0.0] - 2024-12-26

### Added
- Initial project release.
- Added GitHub Codespaces configuration (`.devcontainer`).
- Creating GitHub repository `photos-picker-sample`.
