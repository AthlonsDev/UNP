import os
import json


DATA_FILE = os.path.join(os.path.dirname(__file__), 'Tools.json')

def read_data():
    """Reads and returns the data from the JSON file."""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"number of entries read: {len(data)}")
            return data
    except Exception as e:
        print(f"Error reading data from {DATA_FILE}: {e}")
        return None

def update_data(new_data):
    """Writes the new data to the JSON file."""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, indent=4)
            print(f"Data successfully written to {DATA_FILE}")
    except Exception as e:
        print(f"Error writing data to {DATA_FILE}: {e}")

if __name__ == "__main__":
    # Example usage
    sample_data = {"name": "Sample Tool", "link": "https://example.com", "timestamp": "2024-01-01T00:00:00Z"}
    data = read_data()
    if data is not None:
        data.append(sample_data)
        update_data(data)
    
    