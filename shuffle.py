import random
import os 

# Define the filenames
shuffle_file = "shuffle.txt"

# Check if shuffle.txt exists and delete it if it does
if os.path.exists(shuffle_file):
    os.remove(shuffle_file)
    print(f"{shuffle_file} deleted")

# Read the lines from userfavorites.txt
with open("userfavorites.txt", "r") as file:
    lines = file.readlines()

# Shuffle the lines randomly
random.shuffle(lines)

# Write the shuffled lines to shuffle.txt
with open("shuffle.txt", "w") as file:
    file.writelines(lines)

print("Lines shuffled and saved to shuffle.txt")
