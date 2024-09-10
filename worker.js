// worker.js
const targetLatitude = 31.515876; // Latitude of the geofence center
const targetLongitude = 76.878357; // Longitude of the geofence center
const geofenceRadius = 60; // Geofence radius in meters

let elapsedSeconds = 0; // To track elapsed time in seconds
let isPresent = false; // To track user presence status
let pauseCount = 0; // To count how many times the timer is paused
let timerInterval; // To hold the setInterval for timer

// Function to calculate the distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Function to handle attendance check
function checkAttendance(position) {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;

    const distance = calculateDistance(userLatitude, userLongitude, targetLatitude, targetLongitude);
    
    const isWithinGeofence = distance <= geofenceRadius;
    if (isWithinGeofence) {
        if (!isPresent) {
            isPresent = true;
            startTimer();
        }
    } else {
        if (isPresent) {
            isPresent = false;
            stopTimer();
            pauseCount++;
        }
    }
    postMessage({ type: 'update', isPresent, elapsedSeconds, pauseCount, distance });
}

// Timer management
function startTimer() {
    if (typeof timerInterval === 'undefined') {
        timerInterval = setInterval(() => {
            elapsedSeconds++;
            postMessage({ type: 'update', elapsedSeconds });
        }, 1000); // Increment the timer every second
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = undefined;
}

// Handle messages from the main thread
self.addEventListener('message', function(event) {
    if (event.data.type === 'check') {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(checkAttendance, function(error) {
                postMessage({ type: 'error', message: error.message });
            });
        } else {
            postMessage({ type: 'error', message: 'Geolocation not supported.' });
        }
    }
});
