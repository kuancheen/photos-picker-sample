# Google Photos Picker Sample App
![Version](https://img.shields.io/badge/version-v1.0.0-blue)
![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-yellow.svg)
![Semantic Versioning](https://img.shields.io/badge/semver-2.0.0-blue)
![Views](https://hits.sh/kuancheen.github.io/photos-picker-sample.svg?view=today-total&style=flat&label=👁️%20Views&extraCount=0&color=6366f1)
![Status](https://img.shields.io/badge/status-active-success)

> **Note**: This project is a sample Google Photos Picker application running on Node.js.


This is a sample Node.js application demonstrating how to use the Google Photos Picker API.

## 🚀 Quick Start with GitHub Codespaces

You can run this application entirely in your browser using GitHub Codespaces.

1.  Click the **Code** button on the GitHub repository page.
2.  Select the **Codespaces** tab.
3.  Click **Create codespace on main**.

Once the codespace environment is ready (it will automatically install dependencies):

1.  Open `config.cjs` in the editor.
2.  Add your Google Cloud credentials (see below).
3.  In the terminal, run `npm run dev`.
4.  Codespaces will prompt you to open the application in a new tab (port 8080).

## ☁️ Google Cloud Configuration

To run this app, you need a Google Cloud Project with the Photos Picker API enabled and OAuth credentials.

1.  **Create a Project**: Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2.  **Enable API**: Search for "Photos Picker API" and enable it for your project.
3.  **Configure OAuth Consent Screen**:
    *   Set **User Type** to **External** (unless you are a Google Workspace user).
    *   Fill in required fields (App Name, Support Email).
    *   Add `.../auth/photospicker.mediaitems.readonly` to **Scopes**.
    *   Add your own email as a **Test User**.
4.  **Create Credentials**:
    *   Go to **Credentials** > **Create Credentials** > **OAuth client ID**.
    *   Select **Web application**.
    *   **Authorized JavaScript origins**:
        *   For local: `http://localhost:8080`
        *   For Codespaces: The base URL of your codespace (e.g., `https://<your-codespace-name>-8080.app.github.dev`). You can find this in the "Ports" tab in VS Code.
    *   **Authorized redirect URIs**:
        *   For local: `http://localhost:8080/auth/google/callback`
        *   For Codespaces: `https://<your-codespace-name>-8080.app.github.dev/auth/google/callback`.
5.  **Update Config**:
    *   It is recommended to create a `config-test.cjs` file (which is git-ignored) by copying `config.cjs`.
    *   Paste your **Client ID** and **Client Secret** into the config file.
    *   Update `config.oAuthCallbackUrl` to match your environment (Local or Codespaces URL).

## 💻 Local Developement

1.  Install Node.js.
2.  Run `npm install`.
3.  Configure `config.cjs` (or `config-test.cjs`).
4.  Run `npm run dev`.
5.  Open `http://localhost:8080`.

## ⚠️ Important

*   **Security**: Never commit your `config.cjs` with real credentials if you are pushing to a public repository. The `.gitignore` includes `config-test.cjs` for this purpose. Use `config-test.cjs` for your local keys.
