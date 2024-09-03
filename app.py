from flask import Flask, request, jsonify
from math import radians, sin, cos, sqrt, atan2

app = Flask(__name__)

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in kilometers
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c * 1000  # Convert to meters
    return distance

@app.route('/mark_attendance', methods=['POST'])
def mark_attendance():
    data = request.json
    user_lat = data['latitude']
    user_lng = data['longitude']
    geofence_lat = 37.7749  # Example latitude (e.g., office or school)
    geofence_lng = -122.4194  # Example longitude
    radius = 200  # 200 meters

    distance = calculate_distance(user_lat, user_lng, geofence_lat, geofence_lng)

    if distance <= radius:
        return jsonify({'message': 'Attendance marked successfully'})
    else:
        return jsonify({'message': 'You are outside the geofenced area'}), 403

if __name__ == '__main__':
    app.run(debug=True)
    