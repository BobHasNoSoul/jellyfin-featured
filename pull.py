import requests
import json

# Replace with your Jellyfin server's base URL
base_url = "http://192.168.1.14:8096"
# Replace with the user's ID
user_id = "USER-ID-GOES-HERE"
# Replace with your Jellyfin API key
api_key = "YOUR-API-KEY-GOES-HERE"

# Create headers with the API key
headers = {
    "X-Emby-Token": api_key
}

# Build the URL for getting the user's favorites
favorites_url = f"{base_url}/Users/{user_id}/Items?Recursive=True&Filters=IsFavorite&Fields=Path"

# Make a request to get the user's favorites
response = requests.get(favorites_url, headers=headers)

if response.status_code == 200:
    data = response.json()

    # Extract and save the name and id of each favorite item to a file
    with open("userfavorites.txt", "w") as file:
        for item in data['Items']:
            name = item['Name']
            id = item['Id']
            file.write(f"{id}\n")

    print("Favorites list saved to userfavorites.txt")
else:
    print(f"Failed to retrieve favorites. Status code: {response.status_code}")
