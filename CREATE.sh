#!/bin/bash
#change the header for whatever you want for now it is set to featured content and is the text at the bottom left of the bar
HEADER="Featured Content"
#replace with your website including http:// or https://
WEBSITE="https://www.example.com"
#edit to have a list of your links WITHOUT serverid
main_links=(
    "https://www.example.com/web/index.html#!/details?id=423aa68d161105ecde863bc485dea839"
    "https://www.example.com/web/index.html#!/details?id=64c7de79ce32b4045590e1d5156be729&context=tvshows"
    "https://www.example.com/web/index.html#!/details?id=c2bad6a12281c4047e4f11c29aa18bec"
    "https://www.example.com/web/index.html#!/details?id=08fbbae4577385bd86b3513af7c30c8a"
    "https://www.example.com/web/index.html#!/details?id=beb2eaafafc9fca4b9c95db4b511732c"
    "https://www.example.com/web/index.html#!/details?id=b13e9925eb6a577b9da4bbc38d7521b5"
    "https://www.example.com/web/index.html#!/details?id=3a85aad6d324c8a4abb15395170b0fad&context=tvshows"
    "https://www.example.com/web/index.html#!/details?id=b6915af6864a6f7b213b8378c2e932b5"
)
# Create the HTML file
cat <<EOL > slideshow.html
<!DOCTYPE html>
<html>
<head>
    <title>Slideshow</title>
    <style>
/* Include the Google Fonts stylesheet for the Noto Sans font to match jellyfins font*/
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');
body {
  font-family: 'Noto Sans', sans-serif;
}
h1, h2, h3, p {
  font-family: 'Noto Sans', sans-serif;
  /* Additional styling properties can be added here */
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
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover; /* Maintain aspect ratio (typically 16:9) */
        }
        .logo {
            position: absolute;
            bottom: 10px;
            right: 10px;
            max-height: 50%;
            width: auto;
        }
        .featured-content {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.5);
            padding: 10px;
            color: white;
            font-size: 35px;
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
for main_link in "${main_links[@]}"; do
    item_id=$(echo "$main_link" | grep -oP '(?<=id=)[^&]+')
    backdrop_url="$WEBSITE/Items/$item_id/Images/Backdrop/0"
    logo_url="$WEBSITE/Items/$item_id/Images/Logo"
    cat <<EOL >> slideshow.html
    <a href="$main_link" class="slide" target="_blank" rel="noreferrer">
        <img class="backdrop" src="$backdrop_url" alt="Backdrop">
        <img class="logo" src="$logo_url" alt="Logo">
        <div class="featured-content">$HEADER</div>
        <div class="timer"></div>
    </a>
EOL
done
cat <<EOL >> slideshow.html
<script>
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
echo "HTML file created: slideshow.html"
