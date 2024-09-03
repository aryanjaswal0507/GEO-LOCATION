const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from 'public' directory
app.use(bodyParser.json());

app.post('/api/validate-location', (req, res) => {
    const { latitude, longitude } = req.body;
    const officeLat = 40.7128; // Example lat
    const officeLng = -74.0060; // Example lng
    const maxDistance = 200; // in meters

    const distance = getDistanceFromLatLonInM(latitude, longitude, officeLat, officeLng);

    if (distance <= maxDistance) {
        res.json({ isWithinGeofence: true });
    } else {
        res.json({ isWithinGeofence: false });
    }
});

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in meters
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
