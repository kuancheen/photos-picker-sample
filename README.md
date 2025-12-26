# Google Photos Picker Sample App
![Version](https://img.shields.io/badge/version-v0.2.2%20(Beta)-blue)
![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-yellow.svg)
![Semantic Versioning](https://img.shields.io/badge/semver-2.0.0-blue)
![Views](https://hits.sh/kuancheen.github.io/photos-picker-sample.svg?view=today-total&style=flat&label=👁️%20Views&extraCount=0&color=6366f1)
![Status](https://img.shields.io/badge/status-active-success)

> **Note**: This repository provides two implementations of the Google Photos Picker API.

## 🚀 Two Deployment Options

This repository contains **two versions** of the same Google Photos Picker sample:

### 1. 🌐 GitHub Pages (Client-Side) - **Recommended for Testing**
- **Location**: `/docs` directory
- **Live Demo**: [https://kuancheen.github.io/photos-picker-sample](https://kuancheen.github.io/photos-picker-sample)
- **Tech**: Pure HTML/CSS/JavaScript
- **Auth**: Google Identity Services (browser-based OAuth)
- **Deployment**: Automatic via GitHub Pages
- **Best for**: Quick testing, demos, simple integrations

### 2. ☁️ Codespaces (Server-Side)
- **Location**: `/server` directory
- **Tech**: Node.js + Express + Passport
- **Auth**: Server-side OAuth with session management
- **Deployment**: GitHub Codespaces
- **Best for**: Learning server-side OAuth, production-like setup

---

## 📖 Quick Start

### Option A: GitHub Pages (Easiest)

1. **Visit the live demo**: [https://kuancheen.github.io/photos-picker-sample](https://kuancheen.github.io/photos-picker-sample)

2. **Configure Google Cloud** (first-time setup):
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Photos Picker API"
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized JavaScript origin: `https://kuancheen.github.io`
   - Add redirect URI: `https://kuancheen.github.io/photos-picker-sample`

3. **Fork this repo** (to customize):
   - Fork the repository
   - Go to Settings > Pages > Source: "Deploy from a branch" > Branch: `main` > Folder: `/docs`
   - Copy `docs/config-template.js` to `docs/config.js`
   - Add your OAuth Client ID to `docs/config.js`
   - Add your OAuth Client ID to `docs/config.js`
   - Commit and push

### 📹 YouTube Upload Setup

To enable "Upload to YouTube" functionality:

1. **Enable API**: Enable "YouTube Data API v3" in Google Cloud Console
2. **Add Scopes**: Add `https://www.googleapis.com/auth/youtube.upload` to your OAuth consent screen
3. **Re-authorize**: If you've used the app before, sign out and sign back in to grant the new permission

> **Note**: For the GitHub Pages (client-side) version, video uploads may be limited by browser security (CORS). For full upload capabilities, use the Codespaces (server-side) version.

### Option B: Codespaces (For Development)

1. Click **Code** > **Codespaces** > **Create codespace on main**
2. Wait for environment setup (automatic `npm install` in `/server`)
3. Configure credentials:
   ```bash
   cd server
   cp config.cjs config-test.cjs
   ```
4. Edit `config-test.cjs` with your OAuth credentials
5. Get your Codespace URL:
   ```bash
   echo "https://${CODESPACE_NAME}-8080.app.github.dev"
   ```
6. Add that URL to Google Cloud Console (authorized origins + redirect URIs with `/auth/google/callback`)
7. Run the app:
   ```bash
   npm run dev
   ```

---

## ☁️ Google Cloud Configuration

### Create OAuth Credentials

1. **Create Project**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable API**: Search for "Photos Picker API" and enable it
3. **OAuth Consent Screen**:
   - User Type: External
   - Add scope: `.../auth/photospicker.mediaitems.readonly`
   - Add test users (your email)
4. **Create Credentials**:
   - Type: OAuth client ID > Web application
   - **For GitHub Pages**:
     - JavaScript origins: `https://kuancheen.github.io`
     - Redirect URIs: `https://kuancheen.github.io/photos-picker-sample`
   - **For Codespaces**:
     - JavaScript origins: `https://<your-codespace>-8080.app.github.dev`
     - Redirect URIs: `https://<your-codespace>-8080.app.github.dev/auth/google/callback`

---

## 📁 Repository Structure

```
photos-picker-sample/
├── docs/                      # GitHub Pages (client-side)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── config-template.js
├── server/                    # Codespaces (Node.js)
│   ├── app.js
│   ├── auth.js
│   ├── config.cjs
│   ├── package.json
│   ├── views/
│   └── static/
├── .devcontainer/            # Codespaces configuration
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

## 🔒 Security Notes

- **GitHub Pages**: OAuth credentials are visible in browser. Use a separate OAuth client for production.
- **Codespaces**: Credentials stored in `config-test.cjs` (gitignored). More secure for sensitive data.
- **Never commit** real credentials to public repositories.

---

## 📝 License

Apache 2.0 - See [LICENSE](LICENSE)

Copyright 2024 Google LLC (original sample)  
Modifications © 2024 [kuancheen](https://github.com/kuancheen)
