#!/bin/bash

# Default values
HEADER="Featured Content"
INPUT_FILE="list.txt"
RUN_PRE_SCRIPT=false
RUN_M_SCRIPT=false


get_item_description() {
    local user_id="$1"
    local item_id="$2"
    local description
    description=$(curl -s -H "X-Emby-Token: $api_key" "http://$website/emby/Users/$user_id/Items?Ids=$item_id&fields=Overview" | jq -r '.Items[0].Overview')
    echo "$description"
}

# Set the user ID and API key for the request
website="WWW.EXAMPLE.COM" # replace with your domain name
user_id="CHANGEME"  # Replace with the actual user ID
api_key="CHANGEME"  # Replace with your Jellyfin API key


# Function to display usage information
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo "Create an HTML slideshow that can be used as a featured content bar in jellyfin."
    echo "OPTIONS:"
    echo "  -h, --header HEADER  Set the header text (default: Featured Content)"
    echo "  -l, --list FILE      Specify the input file containing item IDs (default: list.txt)"
    echo "  -p, --pre-script     Run a pre-script before launching the main script"
    echo "  -m, --m-script       run the shuffle script the favorites order randomly (only with -p)"
    echo "  -help                Show this help message"
    echo "EXAMPLE:"
    echo "  $0 -p -m -h 'Custom Header' -l /path/to/list.txt"
    exit 0
}

# Function to run the m-script
run_m_script() {
    echo "Running m-script (shuffle.py)"
    python3 ./shuffle.py
}

# Function to run a pre-script
run_pre_script() {
    echo "Getting favorites pulled from the jellyfin API using pull.py"
    python3 ./pull.py
}

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -h|--header)
            HEADER="$2"
            shift
            ;;
        -l|--list)
            INPUT_FILE="$2"
            shift
            ;;
        -p|--pre-script)
            RUN_PRE_SCRIPT=true
            ;;
        -m|--m-script)
            RUN_M_SCRIPT=true
            ;;
        -help)
            show_help
            ;;
        *)
            echo "Unknown parameter: $1"
            show_help
            ;;
    esac
    shift
done

# Run the m-script if -p flag and -m flag are set
if [ "$RUN_PRE_SCRIPT" = true ]; then
    if [ "$RUN_M_SCRIPT" = true ]; then
        run_m_script
    fi
    run_pre_script
fi

main_item_ids=()  # Initialize an array for item IDs

while IFS= read -r item_id; do
    main_item_ids+=("$item_id")
done < "$INPUT_FILE"

# Create the HTML file
cat <<EOL > slideshow.html
<!DOCTYPE html>
<html>
<head>
    <title>Slideshow</title>
    <link rel="stylesheet" href="featuredstyles.css">

</head>
<body>
EOL

# Iterate through the main item IDs and create slides with descriptions
for item_id in "${main_item_ids[@]}"; do
    # Generate the backdrop and logo URLs based on the item ID
    backdrop_url="/Items/$item_id/Images/Backdrop/0"
    logo_url="/Items/$item_id/Images/Logo"
    description=$(get_item_description "$user_id" "$item_id")

    cat <<EOL >> slideshow.html
    <a href="/#!/details?id=$item_id" class="slide" target="_top" rel="noreferrer">
        <img class="backdrop" src="$backdrop_url" alt="Backdrop">
        <img class="logo" src="$logo_url" alt="Logo">
        <div class="featured-content">$HEADER</div>
        <div class="item-description">$description</div>
        <div class="timer"></div>
    </a>
EOL
done

# Add the JavaScript for randomizing the order of slides
cat <<EOL >> slideshow.html
<script src="featuredscripts.js"></script>
</body>
</html>
EOL

# Display a message indicating the HTML file has been created
echo "Slideshow HTML file created: slideshow.html"
#sudo cp slideshow.html /mnt/HP2/jellyfin-avatars/slideshow.html
