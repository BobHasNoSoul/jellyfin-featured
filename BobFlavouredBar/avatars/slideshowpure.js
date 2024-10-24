// Configuration variables
const shuffleInterval = 10000;
//const listFileName = '/web/avatars/list.txt';
const listFileName = `${window.location.origin}/web/avatars/list.txt`; // the above line is a fix for windows.. how i hate windows
const jsonCredentials = sessionStorage.getItem('json-credentials');
const apiKey = sessionStorage.getItem('api-key');

let userId = null;
let token = null;

if (jsonCredentials) {
    const credentials = JSON.parse(jsonCredentials);
    userId = credentials.Servers[0].UserId;
    token = credentials.Servers[0].AccessToken;
}

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const truncateText = (element, maxLength) => {
    let text = element.innerText;
    if (text.length > maxLength) element.innerText = text.substring(0, maxLength) + '...';
};

const createSlideElement = (item, title) => {
    const itemId = item.Id;
    const plot = item.Overview || 'No overview available'; // Fallback text if overview is missing

    const slide = document.createElement('a');
    slide.className = 'slide';
    slide.href = `${window.location.origin}/web/#/details?id=${itemId}`;
    slide.target = '_top';
    slide.rel = 'noreferrer';
    slide.tabIndex = 0;
    slide.style.display = 'none'; // Initially hide all slides

    const backdrop = document.createElement('img');
    backdrop.className = 'backdrop';
    backdrop.src = `${window.location.origin}/Items/${itemId}/Images/Backdrop/0`;
    backdrop.alt = 'Backdrop';
    backdrop.loading = 'lazy';

    const logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = `${window.location.origin}/Items/${itemId}/Images/Logo`;
    logo.alt = 'Logo';
    logo.loading = 'lazy';

    const featuredContent = document.createElement('div');
    featuredContent.className = 'featured-content';
    featuredContent.textContent = title;

    const plotElement = document.createElement('div');
    plotElement.className = 'plot';
    plotElement.textContent = plot;
    truncateText(plotElement, 240); // Truncate the text to fit within the plot area

    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'gradient-overlay';

    slide.append(backdrop, gradientOverlay, logo, featuredContent, plotElement);
    return slide;
};

const createSlideForItem = async (item, title) => {
    const container = document.getElementById('slides-container');
    const itemId = item.Id;
    const backdropUrl = `${window.location.origin}/Items/${itemId}/Images/Backdrop/0`;
    const logoUrl = `${window.location.origin}/Items/${itemId}/Images/Logo`;

    const [backdropExists, logoExists] = await Promise.all([
        fetch(backdropUrl, { method: 'HEAD' }).then(res => res.ok),
        fetch(logoUrl, { method: 'HEAD' }).then(res => res.ok)
    ]);

    if (backdropExists && logoExists) {
        const slideElement = createSlideElement(item, title);
        container.appendChild(slideElement);
        console.log(`Added slide for item ${itemId}`); // Debugging log
        if (container.children.length === 1) {
            showSlide(0); // Show the first slide immediately
        }
    } else {
        console.warn(`Skipping item ${itemId}: Missing backdrop or logo.`);
    }
};

const fetchItemDetails = async (itemId) => {
    const response = await fetch(`${window.location.origin}/Users/${userId}/Items/${itemId}`, {
        headers: {
            'Authorization': `MediaBrowser Client="Jellyfin Web", Device="YourDeviceName", DeviceId="YourDeviceId", Version="YourClientVersion", Token="${token}"`
        }
    });
    const item = await response.json();
    console.log("Item Title:", item.Name);
    console.log("Item Overview:", item.Overview);
    return item;
};

const fetchItemIdsFromList = async () => {
    try {
        const response = await fetch(listFileName);
        if (!response.ok) {
            throw new Error('Failed to fetch list.txt');
        }
        const text = await response.text();
        return text.split('\n').map(id => id.trim()).filter(id => id); // Remove empty lines and trim
    } catch (error) {
        console.error('Error fetching list.txt:', error);
        return [];
    }
};

const fetchItemsFromServer = async () => {
    try {
        const response = await fetch(`${window.location.origin}/Users/${userId}/Items?IncludeItemTypes=Movie,Series&Recursive=true&hasOverview=true&imageTypes=Logo,Backdrop&isPlayed=False&Limit=1500`, {
            headers: {
                'Authorization': `MediaBrowser Client="Jellyfin Web", Device="YourDeviceName", DeviceId="YourDeviceId", Version="YourClientVersion", Token="${token}"`
            }
        });
        const data = await response.json();
        const items = data.Items;

        // Separate movies and TV shows
        const movies = items.filter(item => item.Type === 'Movie');
        const tvShows = items.filter(item => item.Type === 'Series');

        // Shuffle and select
        const shuffledMovies = shuffleArray(movies);
        const shuffledTvShows = shuffleArray(tvShows);
        const selectedMovies = shuffledMovies.slice(0, 15); // Adjust number as needed
        const selectedTvShows = shuffledTvShows.slice(0, 15); // Adjust number as needed

        // Combine movies and TV shows in alternating order
        const allItems = [];
        const maxLength = Math.max(selectedMovies.length, selectedTvShows.length);

        for (let i = 0; i < maxLength; i++) {
            if (i < selectedMovies.length) allItems.push(selectedMovies[i]);
            if (i < selectedTvShows.length) allItems.push(selectedTvShows[i]);
        }

        return allItems;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
};

const createSlidesForItems = async (items) => {
    await Promise.all(items.map(item => createSlideForItem(item, item.Type === 'Movie' ? 'Movie' : 'TV Show')));
};

const showSlide = (index) => {
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.style.display = 'block'; // Ensure the slide is visible
            // Force a reflow to apply the initial opacity before starting the fade-in
            slide.offsetHeight; // Trigger a reflow
            slide.style.opacity = '1'; // Fade in by setting opacity to 1
            slide.classList.add("active");
        } else {
            slide.style.opacity = '0'; // Fade out by setting opacity to 0
            slide.classList.remove("active");
            // Use setTimeout to wait for the opacity transition before hiding
            setTimeout(() => {
                slide.style.display = 'none'; // Hide after fading out
            }, 500); // Match this timeout with your opacity transition duration
        }
    });
};

const initializeSlideshow = () => {
    const slides = document.querySelectorAll(".slide");
    const container = document.getElementById('slides-container');
    let currentSlideIndex = 1;
    let focusedSlide = null; // Track currently focused slide
    let containerFocused = false; // Track if the container is focused

    // Function to update the current slide
    const updateCurrentSlide = (index) => {
        currentSlideIndex = (index + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    };

    // Function to open the currently focused slide
    const openActiveSlide = () => {
        if (focusedSlide) {
            window.location.href = focusedSlide.href;
        }
    };

    // Show the first slide immediately and start cycling after 10 seconds
    if (slides.length > 0) {
        showSlide(currentSlideIndex);

        // Make the slides container visible once the first slide is ready
        container.style.display = 'block'; // Make the container visible

        setTimeout(() => {
            setInterval(() => {
                // Automatically cycle through slides every shuffleInterval
                updateCurrentSlide(currentSlideIndex + 1);
            }, shuffleInterval);
        }, 10000); // Wait 10 seconds before starting the interval
    }

    // Handle focus state for slides
    slides.forEach((slide) => {
        slide.addEventListener('focus', () => {
            focusedSlide = slide; // Set the currently focused slide
            container.classList.remove('disable-interaction'); // Enable interaction when a slide is focused
        }, true); // Use capture phase to ensure focus events are caught

        slide.addEventListener('blur', () => {
            if (focusedSlide === slide) {
                focusedSlide = null; // Clear focus when slide is no longer focused
            }
        }, true);
    });

    // Handle keyboard events for navigation and selection
    document.addEventListener('keydown', (event) => {
        if (containerFocused) {
            switch (event.keyCode) {
                case 37: // Left arrow key
                    updateCurrentSlide(currentSlideIndex - 1);
                    break;
                case 39: // Right arrow key
                    updateCurrentSlide(currentSlideIndex + 1);
                    break;
                case 13: // Enter key
                case 32: // Space key
                    openActiveSlide();
                    break;
            }
        }
    });

    // Ensure the container captures focus for keyboard navigation
    container.addEventListener('focus', () => {
        containerFocused = true;
    });

    container.addEventListener('blur', () => {
        containerFocused = false;
    });
};

// Fetch item IDs from list.txt or from the server
const initializeSlides = async () => {
    const itemIds = await fetchItemIdsFromList();
    let items;

    if (itemIds.length > 0) {
        // Fetch items based on IDs from list.txt
        const itemPromises = itemIds.map(id => fetchItemDetails(id));
        items = await Promise.all(itemPromises);
    } else {
        // Fetch random items from the server
        const allItems = await fetchItemsFromServer();
        const itemPromises = allItems.map(item => fetchItemDetails(item.Id));
        items = await Promise.all(itemPromises);
    }

    // Shuffle the items array to randomize the order of slides
    items = shuffleArray(items);

    await createSlidesForItems(items);
    initializeSlideshow();
};

// Fetch items when the script is loaded
if (jsonCredentials && apiKey) {
    initializeSlides();
} else {
    console.error('No credentials or API key found.');
}
