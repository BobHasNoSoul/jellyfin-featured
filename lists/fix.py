import sys
import re

# Define a regular expression pattern to extract the IDs from the URLs
pattern = r'id=([a-f0-9]+)'

# Function to extract and return the IDs from a given URL
def extract_ids(url):
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    else:
        return None

if len(sys.argv) != 2:
    print("Usage: python3 fix.py input_file")
    sys.exit(1)

input_file = sys.argv[1]

# Read the input file
with open(input_file, "r") as file:
    lines = file.readlines()

# Process the URLs and extract the IDs
ids = [extract_ids(line) for line in lines]

# Write the IDs back to the same file
with open(input_file, "w") as file:
    for id in ids:
        file.write(id + "\n")
