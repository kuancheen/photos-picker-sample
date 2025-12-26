// Google Photos Picker - Client-Side Application
let accessToken = null;
let currentSession = null;
let tokenClient = null;
let clientId = null;

// Configuration
const CONFIG = {
    scope: 'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
    apiEndpoint: 'https://photospicker.googleapis.com/v1'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

    // Check for stored client ID
    clientId = localStorage.getItem('google_client_id');

    if (clientId) {
        // Pre-fill the input
        document.getElementById('client-id-input').value = clientId;

        // Show sign-in section, hide config form
        document.getElementById('config-form').classList.add('hidden');
        document.getElementById('signin-section').classList.remove('hidden');

        // Check for stored session
        const storedToken = sessionStorage.getItem('access_token');
        if (storedToken) {
            accessToken = storedToken;
            initializeApp();
        }

        // Initialize Google Sign-In button
        waitForGoogleScript();
    }

    // Event listeners
    document.getElementById('sign-out-btn')?.addEventListener('click', signOut);
    document.getElementById('open-picker-btn')?.addEventListener('click', openPhotoPicker);
    document.getElementById('save-config-btn')?.addEventListener('click', saveConfig);
    document.getElementById('clear-config-btn')?.addEventListener('click', clearConfig);
});

// Show configuration modal
function showConfigModal() {
    const modal = document.getElementById('config-modal');
    const input = document.getElementById('client-id-input');
    input.value = clientId || '';
    modal.classList.remove('hidden');
}

// Close configuration modal
function closeConfigModal() {
    document.getElementById('config-modal').classList.add('hidden');
}

// Save configuration
function saveConfig() {
    const input = document.getElementById('client-id-input');
    const message = document.getElementById('config-message');
    const newClientId = input.value.trim();

    // Clear previous message
    message.classList.add('hidden');
    message.className = 'config-message hidden';

    if (!newClientId) {
        showMessage('Please enter a valid Client ID', 'error');
        return;
    }

    if (!newClientId.endsWith('.apps.googleusercontent.com')) {
        showMessage('Client ID should end with .apps.googleusercontent.com', 'error');
        return;
    }

    clientId = newClientId;
    localStorage.setItem('google_client_id', clientId);

    showMessage('✓ Configuration saved! Initializing...', 'success');

    // Hide config form, show sign-in section
    setTimeout(() => {
        document.getElementById('config-form').classList.add('hidden');
        document.getElementById('signin-section').classList.remove('hidden');
        waitForGoogleScript();
    }, 1000);
}

// Show inline message
function showMessage(text, type) {
    const message = document.getElementById('config-message');
    message.textContent = text;
    message.className = `config-message ${type}`;
    message.classList.remove('hidden');
}

// Clear configuration
function clearConfig() {
    if (confirm('Are you sure you want to clear your Client ID configuration? You will need to re-enter it.')) {
        localStorage.removeItem('google_client_id');
        sessionStorage.removeItem('access_token');
        location.reload();
    }
}

// Wait for Google Identity Services script to load
function waitForGoogleScript() {
    if (typeof google !== 'undefined' && google.accounts) {
        initializeGIS();
    } else {
        setTimeout(waitForGoogleScript, 100);
    }
}

// Initialize Google Identity Services
function initializeGIS() {
    if (typeof google === 'undefined') {
        console.error('Google Identity Services not loaded');
        return;
    }

    if (!clientId) {
        console.error('Client ID not configured');
        return;
    }

    // Initialize token client
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: CONFIG.scope,
        callback: (response) => {
            if (response.access_token) {
                accessToken = response.access_token;
                sessionStorage.setItem('access_token', accessToken);
                initializeApp();
            }
        },
    });

    // Render the sign-in button
    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('signin-button-container'),
        {
            type: 'standard',
            size: 'large',
            theme: 'outline',
            text: 'sign_in_with',
            shape: 'rectangular',
            logo_alignment: 'left'
        }
    );
}

// Handle credential response from Google Sign-In
function handleCredentialResponse(response) {
    // Request access token
    tokenClient.requestAccessToken();
}

// Initialize the app after authentication
async function initializeApp() {
    try {
        // Get user info
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(r => r.json());

        // Update UI
        document.getElementById('user-name').textContent = userInfo.name;
        document.getElementById('user-avatar').src = userInfo.picture;

        // Show app section, hide auth section
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('app-section').classList.remove('hidden');

        // Create a picker session
        await createPickerSession();

    } catch (error) {
        console.error('Error initializing app:', error);
        signOut();
    }
}

// Create a Photos Picker session
async function createPickerSession() {
    try {
        const response = await fetch(`${CONFIG.apiEndpoint}/sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to create session: ${response.statusText}`);
        }

        currentSession = await response.json();
        console.log('Picker session created:', currentSession);

    } catch (error) {
        console.error('Error creating picker session:', error);
        alert('Failed to initialize Photos Picker. Please try again.');
    }
}

// Open the Photos Picker
async function openPhotoPicker() {
    if (!currentSession || !currentSession.id) {
        alert('Session not ready. Please refresh the page.');
        return;
    }

    try {
        // Poll for selected items
        const pollInterval = setInterval(async () => {
            const session = await getSession();

            if (session.mediaItemsSet) {
                clearInterval(pollInterval);
                await displaySelectedPhotos();
            }
        }, 2000);

        // Open picker in new window
        const pickerUrl = currentSession.pickerUri;
        window.open(pickerUrl, 'PhotoPicker', 'width=800,height=600');

    } catch (error) {
        console.error('Error opening picker:', error);
        alert('Failed to open Photos Picker.');
    }
}

// Get current session status
async function getSession() {
    const response = await fetch(`${CONFIG.apiEndpoint}/sessions/${currentSession.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        throw new Error('Failed to get session');
    }

    return await response.json();
}

// Display selected photos
async function displaySelectedPhotos() {
    try {
        const response = await fetch(
            `${CONFIG.apiEndpoint}/mediaItems?sessionId=${currentSession.id}&pageSize=25`,
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch media items');
        }

        const data = await response.json();
        const mediaItems = data.mediaItems || [];

        console.log('Full API response:', JSON.stringify(data, null, 2));
        console.log('Media items received:', mediaItems);

        if (mediaItems.length === 0) {
            alert('No photos selected.');
            return;
        }

        // Display photos
        const grid = document.getElementById('photos-grid');
        grid.innerHTML = '';

        mediaItems.forEach(async (item) => {
            console.log('Processing item:', JSON.stringify(item, null, 2));

            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';

            const img = document.createElement('img');
            img.alt = item.mediaFile?.filename || 'Photo';

            // Check if mediaFile.baseUrl exists (Photos Picker API structure)
            const baseUrl = item.mediaFile?.baseUrl || item.baseUrl;

            if (baseUrl) {
                try {
                    // Fetch the image with authentication
                    const imageUrl = `${baseUrl}=w300-h300`;
                    const response = await fetch(imageUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        img.src = blobUrl;

                        // Clean up blob URL when image is removed
                        img.addEventListener('load', () => {
                            // Image loaded successfully
                        });
                    } else {
                        console.error('Failed to fetch image:', response.status, response.statusText);
                        img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="50" text-anchor="middle" fill="%23999" font-size="12">Error</text></svg>';
                    }
                } catch (error) {
                    console.error('Error loading image:', error);
                    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="50" text-anchor="middle" fill="%23999" font-size="12">Error</text></svg>';
                }
            } else {
                // Fallback: show a placeholder
                console.error('No baseUrl for item:', item);
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="50" text-anchor="middle" fill="%23999" font-size="12">No Image</text></svg>';
            }

            const info = document.createElement('div');
            info.className = 'photo-info';
            info.innerHTML = `
                <p><strong>${item.mediaFile?.filename || 'Untitled'}</strong></p>
                <p class="photo-meta">${item.mediaFile?.mimeType || item.type || 'Image'}</p>
            `;

            photoCard.appendChild(img);
            photoCard.appendChild(info);
            grid.appendChild(photoCard);
        });

        document.getElementById('selected-photos').classList.remove('hidden');

    } catch (error) {
        console.error('Error displaying photos:', error);
        alert('Failed to load selected photos.');
    }
}

// Sign out
function signOut() {
    accessToken = null;
    currentSession = null;
    sessionStorage.removeItem('access_token');

    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
    document.getElementById('selected-photos').classList.add('hidden');

    // Revoke token
    if (google?.accounts?.oauth2) {
        google.accounts.oauth2.revoke(accessToken, () => {
            console.log('Token revoked');
        });
    }
}
