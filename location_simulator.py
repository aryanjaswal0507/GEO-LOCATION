import time
import random
import requests

# Define your server URL
server_url = 'http://localhost:5000/api/attendance'

# Define your geofence parameters (same as the server's)
geofence_center = (37.7749, -122.4194)  # Example: San Francisco coordinates
geofence_radius = 1000  # 1 kilometer radius

def generate_random_location(center, radius):
    # Generate a random point within a certain radius around a center point
    lat_center, lon_center = center
    radius_in_degrees = radius / 111320  # Approximate conversion from meters to degrees
    lat = lat_center + random.uniform(-radius_in_degrees, radius_in_degrees)
    lon = lon_center + random.uniform(-radius_in_degrees, radius_in_degrees)
    return (lat, lon)

def send_location_to_server(location):
    payload = {
        'userId': 'TEST_USER',
        'latitude': location[0],
        'longitude': location[1]
    }
    try:
        response = requests.post(server_url, data=payload)
        print(response.json())
    except requests.ConnectionError as e:
        print(f"Connection error: {e}")

# Continuously simulate location updates
try:
    while True:
        simulated_location = generate_random_location(geofence_center, geofence_radius)
        print(f"Sending location: {simulated_location}")
        send_location_to_server(simulated_location)
        time.sleep(10)  # Simulate a new location every 10 seconds
except KeyboardInterrupt:
    print("Client simulation stopped.")
