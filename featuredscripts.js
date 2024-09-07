// Configuration variables
const shuffleInterval = 8000; // Time in milliseconds between slide changes
const listFileName = 'list.txt'; // Name of the file containing the list of movie IDs

// Fetch credentials from sessionStorage
const jsonCredentials = sessionStorage.getItem('json-credentials');
const apiKey = sessionStorage.getItem('api-key');

let userId = null;
let token = null;

if (jsonCredentials) {
    const credentials = JSON.parse(jsonCredentials);
    userId = credentials.Servers[0].UserId;
    token = credentials.Servers[0].AccessToken;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function truncateText(element, maxLength) {
    if (!element || !element.innerText) return;
    let truncated = element.innerText;
    if (truncated.length > maxLength) {
        truncated = truncated.substr(0, maxLength) + '...';
    }
    element.innerText = truncated;
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function createSlideForMovie(movie, title, index) {
    const itemId = movie.Id;

    // Create image URLs
    const backdropUrl = `/Items/${itemId}/Images/Backdrop/0`;
    const logoUrl = `/Items/${itemId}/Images/Logo`;

    // Check if backdrop and logo images exist
    return Promise.all([
        fetch(backdropUrl, { method: 'HEAD' }).then(res => res.ok),
        fetch(logoUrl, { method: 'HEAD' }).then(res => res.ok)
    ]).then(([backdropExists, logoExists]) => {
        if (backdropExists && logoExists) {
            const slideElement = createSlideElement(movie, title, index);

            // Add lazy loading to images
            const backdrop = slideElement.querySelector('.backdrop');
            const logo = slideElement.querySelector('.logo');

            backdrop.setAttribute('loading', 'lazy');
            logo.setAttribute('loading', 'lazy');
            return waitForElm('#slides-container').then(elm => {
                elm.appendChild(slideElement);
            });

        } else {
            console.warn(`Skipping movie ${itemId}: Missing backdrop or logo.`);
        }
    });
}

function createSlideElement(movie, title, index) {
    const itemId = movie.Id;
    const plot = movie.Overview;

    const slide = document.createElement('a');
    slide.className = 'slide show-focus card focuscontainer-x';
    slide.href = `#/!details?id=${itemId}`;
    slide.target = '_top';
    slide.rel = 'noreferrer';
    slide.setAttribute('data-index', index); // Assign a unique data-index for each slide

    const backdrop = document.createElement('img');
    backdrop.className = 'backdrop';
    backdrop.src = `/Items/${itemId}/Images/Backdrop/0`;
    backdrop.alt = 'Backdrop';

    const logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = `/Items/${itemId}/Images/Logo`;
    logo.alt = 'Logo';

    const featuredContent = document.createElement('div');
    featuredContent.className = 'featured-content';
    featuredContent.textContent = title;

    const plotElement = document.createElement('div');
    plotElement.className = 'plot';
    plotElement.textContent = plot;

    truncateText(plotElement, 240); // Adjust 240 to your preferred character limit

    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'gradient-overlay';

    slide.appendChild(backdrop);
    slide.appendChild(gradientOverlay);
    slide.appendChild(logo);
    slide.appendChild(featuredContent);
    slide.appendChild(plotElement);
    slide.style.display = 'none';

    return slide;
}

let userInitiatedChange = false; // Flag to track if the change was user-initiated
let shuffleIntervalId;

function initializeSlideshow() {
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
    const shuffledIndexes = shuffleArray(Array.from({ length: slides.length }, (_, i) => i));

    function showSlide(index) {
        requestAnimationFrame(() => {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });

            const focusedSlide = slides[index];
            if (userInitiatedChange) {
                focusedSlide.focus({ focusVisible: true }); // Focus the current slide
                clearInterval(shuffleIntervalId);
                shuffleIntervalId = setInterval(nextSlide, shuffleInterval);
            }

            userInitiatedChange = false; // Reset the flag after updating the slide
        });
    }

    function nextSlide() {
        if (document.activeElement.classList.contains('slide')) {
            userInitiatedChange = true;
        }
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        if (document.activeElement.classList.contains('slide')) {
            userInitiatedChange = true;
        }
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function handleArrowKeys(event) {
        if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            prevSlide();
        } else if (event.key === 'Enter') {
            window.location.href = document.activeElement.href;
        }
    }

    document.addEventListener('keydown', function(event) {
        if (document.activeElement.classList.contains('slide') && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            userInitiatedChange = true; // Set the flag for user-initiated change
            event.preventDefault();
            handleArrowKeys(event);
        }
    });

    showSlide(currentSlide);
    shuffleIntervalId = setInterval(nextSlide, shuffleInterval);
}

function fetchMovies() {
    const noCacheUrl = "/web/avatars/" + listFileName + '?' + new Date().getTime();

    fetch(noCacheUrl)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('list.txt not found, fetching movies from server.');
            }
        })
        .then(text => {
            const lines = text.split('\n').filter(Boolean);
            const movieIds = shuffleArray(lines.map(line => line.substring(0, 32)));
            return Promise.all(movieIds.map(id => fetchMovieDetails(id)));
        })
        .then(movies => {
            const moviePromises = movies.map((movie, index) => createSlideForMovie(movie, 'Spotlight', index));
            return Promise.all(moviePromises);
        })
        .then(() => {
            initializeSlideshow();
        })
        .catch(error => {
            console.error(error);
        });
}

function fetchMovieDetails(movieId) {
    return fetch(`/Users/${userId}/Items/${movieId}`, {
        headers: {
            'Authorization': `MediaBrowser Client="Jellyfin Web", Device="YourDeviceName", DeviceId="YourDeviceId", Version="YourClientVersion", Token="${token}"`
        }
    })
    .then(response => response.json())
    .then(movie => {
        console.log("Movie Title:", movie.Name);
        console.log("Movie Overview:", movie.Overview);
        return movie;
    });
}

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        fetchMovies();
    }
});

fetchMovies();