import os
import requests

def get_photo_ids_from_db():
    response = requests.get('http://localhost:3002/UserPhotosId')
    if response.status_code == 200:
        return set(photo['PhotoLink'] for photo in response.json())
    else:
        raise Exception("Failed to fetch photo IDs")

def clean_unused_photos(folder_path):
    photo_ids = get_photo_ids_from_db()
    for photo_file in os.listdir(folder_path):
        photo_id = os.path.splitext(photo_file)[0]
        if photo_id not in photo_ids:
            os.remove(os.path.join(folder_path, photo_file))

if __name__ == "__main__":
    clean_unused_photos('uploads/')
