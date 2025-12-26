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

    if (!clientId) {
        showConfigModal();
    } else {
        // Check for stored session
        const storedToken = sessionStorage.getItem('access_token');
        if (storedToken) {
            accessToken = storedToken;
            initializeApp();
        }

        // Initialize Google Identity Services
        initializeGIS();
    }

    // Event listeners
    document.getElementById('sign-out-btn')?.addEventListener('click', signOut);
    document.getElementById('open-picker-btn')?.addEventListener('click', openPhotoPicker);
    document.getElementById('config-btn')?.addEventListener('click', showConfigModal);
    document.getElementById('save-config-btn')?.addEventListener('click', saveConfig);
    document.getElementById('close-modal-btn')?.addEventListener('click', closeConfigModal);
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
    if (!clientId) {
        alert('You must configure a Client ID to use this app.');
        return;
    }
    document.getElementById('config-modal').classList.add('hidden');
}

// Save configuration
function saveConfig() {
    const input = document.getElementById('client-id-input');
    const newClientId = input.value.trim();

    if (!newClientId) {
        alert('Please enter a valid Client ID');
        return;
    }

    if (!newClientId.endsWith('.apps.googleusercontent.com')) {
        alert('Client ID should end with .apps.googleusercontent.com');
        return;
    }

    clientId = newClientId;
    localStorage.setItem('google_client_id', clientId);
    closeConfigModal();

    // Reload to initialize with new client ID
    location.reload();
}

// Initialize Google Identity Services
function initializeGIS() {
    if (typeof google === 'undefined') {
        console.error('Google Identity Services not loaded');
        setTimeout(initializeGIS, 100); // Retry
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

        if (mediaItems.length === 0) {
            alert('No photos selected.');
            return;
        }

        // Display photos
        const grid = document.getElementById('photos-grid');
        grid.innerHTML = '';

        mediaItems.forEach(item => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';

            const img = document.createElement('img');
            img.src = `${item.baseUrl}=w300-h300`;
            img.alt = item.filename || 'Photo';

            const info = document.createElement('div');
            info.className = 'photo-info';
            info.innerHTML = `
                <p><strong>${item.filename || 'Untitled'}</strong></p>
                <p class="photo-meta">${item.mimeType}</p>
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
