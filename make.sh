#!/bin/bash

# Default values
HEADER="Featured Content"
INPUT_FILE="list.txt"
RUN_PRE_SCRIPT=false
RUN_M_SCRIPT=false

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
    <style>
        /* Include the Google Fonts stylesheet for the Noto Sans font */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');

/* Apply the font to the body or specific elements */
body {
  font-family: 'Noto Sans', sans-serif;
}

/* You can customize other text styles as needed */
h1, h2, h3, p {
  font-family: 'Noto Sans', sans-serif;
  /* Additional styling properties can be added here */
}

/* Example: Change the font size and color */
p {
  font-size: 16px;
  color: #333;
}

/* Example: Change the font size and color for headers */
h1 {
  font-size: 36px;
  color: #FF5733;
}

        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide {
            position: relative;
            width: 100vw;
            height: 100vh;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
.backdrop {
    position: absolute;
    top: 50%; /* Adjust this value to position the backdrop vertically */
    left: 0;
    width: 100%;
    height: auto;
    transform: translateY(-45%); /* Vertically center the backdrop */
    object-fit: cover; /* Maintain aspect ratio (typically 16:9) */
}
        .logo {
            position: absolute;
            bottom: 10px;
            left: 10px;
            max-height: 50%;
            max-width:30%;
            width: auto;
        }
.logo::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: -1; /* Place the shadow behind the logo */
}
.featured-content {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    color: white;
    font-size: 25px;
}
        .timer {
            position: absolute;
            display: none;
            top: 20px;
            left: 20px; /* Move the timer to the top left */
            background: rgba(0, 0, 0, 0.5);
            padding: 10px;
            color: white;
            font-size: 35px;
            border-radius: 50%;
        }
    </style>
</head>
<body>
EOL

# Iterate through the main item IDs and create slides
for item_id in "${main_item_ids[@]}"; do
    # Generate the backdrop and logo URLs based on the item ID
    backdrop_url="/Items/$item_id/Images/Backdrop/0"
    logo_url="/Items/$item_id/Images/Logo"

    cat <<EOL >> slideshow.html
    <a href="/#!/details?id=$item_id" class="slide" target="_top" rel="noreferrer">
        <img class="backdrop" src="$backdrop_url" alt="Backdrop">
        <img class="logo" src="$logo_url" alt="Logo">
        <div class="featured-content">$HEADER</div>
        <div class="timer"></div>
    </a>
EOL
done

# Close the HTML file and add JavaScript for automatic slideshow
cat <<EOL >> slideshow.html
<script>
    function reloadParent(url) {
        // Change the parent window's location to the specified URL
        top.location.href = url;
    }

    var slides = document.querySelectorAll(".slide");
    var currentSlide = 0;

    function showSlide(index) {
        for (var i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[index].style.display = "block";
        countdown = 10; // Reset countdown for each slide
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    showSlide(currentSlide);

    // Initial call for the first slide
    var countdown = 10;
    var timer = document.querySelector(".timer");
    timer.innerHTML = countdown;

    function updateTimer() {
        countdown--;
        timer.innerHTML = countdown;
        if (countdown <= 0) {
            nextSlide();
        }
    }

    // Timer for slide transition
    setInterval(updateTimer, 1000);
</script>
</body>
</html>
EOL

# Display a message indicating the HTML file has been created
echo "Slideshow HTML file created: slideshow.html"

#cp slideshow.html /path/to/mapped/avatars/slideshow.html
