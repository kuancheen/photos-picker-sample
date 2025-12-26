// Configuration for Google Photos Picker API
// Copy this file to config.js and fill in your credentials

const CONFIG = {
    // Get this from Google Cloud Console > Credentials
    // Create an OAuth 2.0 Client ID for "Web application"
    clientId: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',

    // The Photos Picker API scope
    scope: 'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',

    // API endpoint
    apiEndpoint: 'https://photospicker.googleapis.com/v1'
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
