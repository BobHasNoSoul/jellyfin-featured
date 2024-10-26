// Configuration variables
const shuffleInterval = 10000;
//const listFileName = '/web/avatars/list.txt';
const listFileName = `${window.location.origin}/web/avatars/list.txt`; // the above line is a fix for windows.. how i hate windows
const jsonCredentials = sessionStorage.getItem("json-credentials");
const apiKey = sessionStorage.getItem("api-key");

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
  if (text.length > maxLength)
    element.innerText = text.substring(0, maxLength) + "...";
};

const createSlideElement = (item, title) => {
  const itemId = item.Id;
  const plot = item.Overview || "No overview available"; // Fallback text if overview is missing
  const rating = item.CommunityRating;
  const tomato = item.CriticRating;
  const runtime = item.RunTimeTicks;
  const genre = item.Genres;
  const youtube = item.RemoteTrailers;
  const age = item.OfficialRating;
  const date = item.PremiereDate;
  const season = item.ChildCount;
  function createSeparator() {
    const separatorHtml =
      '<i class="fa-solid fa-grip-lines-vertical separator-icon"></i>';
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = separatorHtml;
    return tempDiv.firstChild;
  }

  const slide = document.createElement("a");
  slide.className = "slide";
  //slide.href = `${window.location.origin}/web/#/details?id=${itemId}`;
  slide.target = "_top";
  slide.rel = "noreferrer";
  slide.tabIndex = 0;
  slide.style.display = "none"; // Initially hide all slides

  const backdrop = document.createElement("img");
  backdrop.className = "backdrop";
  backdrop.src = `${window.location.origin}/Items/${itemId}/Images/Backdrop/0`;
  backdrop.alt = "Backdrop";
  //backdrop.loading = "lazy";
  const backdropOverlay = document.createElement("div");
  backdropOverlay.className = "backdrop-overlay";

  const backdropContainer = document.createElement("div");
  backdropContainer.className = "backdrop-container";
  backdropContainer.appendChild(backdrop);
  backdropContainer.appendChild(backdropOverlay);

  const logo = document.createElement("img");
  logo.className = "logo";
  logo.src = `${window.location.origin}/Items/${itemId}/Images/Logo`;
  logo.alt = "Logo";
  //logo.loading = "lazy";
  const logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";
  logoContainer.appendChild(logo);

  const featuredContent = document.createElement("div");
  featuredContent.className = "featured-content";
  featuredContent.textContent = title;

  const plotElement = document.createElement("div");
  plotElement.className = "plot";
  plotElement.textContent = plot;
  truncateText(plotElement, 240); // Truncate the text to fit within the plot area

  const plotContainer = document.createElement("div");
  plotContainer.className = "plot-container";
  plotContainer.appendChild(plotElement);

  const gradientOverlay = document.createElement("div");
  gradientOverlay.className = "gradient-overlay";

  const runTimeElement = document.createElement("div");
  runTimeElement.className = "runTime";
  if (season === undefined) {
    // If ChildCount (season) is undefined, show runtime element with end time
    const milliseconds = runtime / 10000;
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + milliseconds);
    const options = { hour: "2-digit", minute: "2-digit", hour12: !0 };
    const formattedEndTime = endTime.toLocaleTimeString([], options);
    runTimeElement.textContent = `Ends at ${formattedEndTime}`;
  } else {
    // If ChildCount (season) is defined, show the season value
    runTimeElement.textContent = `${season} Season${season > 1 ? "s" : ""}`;
  }

  const ratingTest = document.createElement("div");
  ratingTest.className = "rating-value";
  const imdbLogo = document.createElement("img");
  imdbLogo.className = "imdb-logo";
  imdbLogo.src =
    "https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg";
  imdbLogo.alt = "IMDb Logo";
  imdbLogo.style.width = "30px";
  imdbLogo.style.height = "30px";
  ratingTest.appendChild(imdbLogo);
  if (typeof rating === "number") {
    const formattedRating = rating.toFixed(1);
    ratingTest.innerHTML += `${formattedRating} ⭐`;
  } else {
    console.error("Rating is undefined or not a number:", rating);
    ratingTest.innerHTML += `N/A ⭐`;
  }
  ratingTest.appendChild(createSeparator());

  const tomatoRatingDiv = document.createElement("div");
  tomatoRatingDiv.className = "tomato-rating";
  const criticRating = item.CriticRating;
  const tomatoLogo = document.createElement("img");
  tomatoLogo.className = "tomato-logo";
  const criticLogo = document.createElement("img");
  criticLogo.className = "critic-logo";
  tomatoLogo.src =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Rotten_Tomatoes_positive_audience.svg/1920px-Rotten_Tomatoes_positive_audience.svg.png";
  let valueElement;
  if (typeof criticRating === "number") {
    valueElement = document.createTextNode(`${criticRating}% `);
  } else {
    valueElement = document.createTextNode(`N/A `);
  }
  if (criticRating === undefined || criticRating <= 59) {
    criticLogo.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Rotten_Tomatoes_rotten.svg/1024px-Rotten_Tomatoes_rotten.svg.png";
    criticLogo.alt = "Rotten Tomato";
  } else {
    criticLogo.src = "https://i.imgur.com/iMfwDk7.png";
    criticLogo.alt = "Fresh Tomato";
  }
  tomatoLogo.style.width = "15px";
  tomatoLogo.style.height = "17px";
  criticLogo.style.width = "15px";
  criticLogo.style.height = "15px";
  tomatoRatingDiv.appendChild(tomatoLogo);
  tomatoRatingDiv.appendChild(valueElement);
  tomatoRatingDiv.appendChild(criticLogo);
  tomatoRatingDiv.appendChild(createSeparator());
  const ageRatingDiv = document.createElement("div");
  ageRatingDiv.className = "age-rating";
  if (item.OfficialRating) {
    ageRatingDiv.innerHTML = `${item.OfficialRating}`;
  } else {
    ageRatingDiv.innerHTML = `N/A`;
  }
  const calender = "📅";
  const premiereDate = document.createElement("div");
  premiereDate.className = "date";
  const year = date ? new Date(date).getFullYear() : "N/A";
  premiereDate.textContent = isNaN(year) ? "N/A" : year;
  ratingTest.appendChild(tomatoRatingDiv);
  ratingTest.appendChild(document.createTextNode(calender));
  ratingTest.appendChild(premiereDate);
  ratingTest.appendChild(createSeparator());
  ratingTest.appendChild(ageRatingDiv);
  ratingTest.appendChild(createSeparator());
  ratingTest.appendChild(runTimeElement);

  const genresArray = item.Genres;
  function parseGenres(genresArray) {
    if (genresArray && genresArray.length > 0) {
      return genresArray.join(" 🔹 ");
    } else {
      return "No Genre Available";
    }
  }

  const genreElement = document.createElement("div");
  genreElement.className = "genre";
  genreElement.innerHTML = parseGenres(genresArray);
  const infoContainer = document.createElement("div");
  infoContainer.className = "info-container";
  infoContainer.appendChild(ratingTest);

  const playButton = document.createElement("button");
  playButton.className = "play-button";
  playButton.innerHTML = `
    <span class="play-icon"><i class="fas fa-play"></i></span>
    <span class="play-text">Watch Now</span>
  `;
  playButton.onclick = () => {
    window.top.location.href = `/#!/details?id=${itemId}`;
  };

  slide.append(
    logoContainer,
    backdropContainer,
    gradientOverlay,
    featuredContent,
    plotContainer,
    infoContainer,
    genreElement,
    playButton
  );
  return slide;
};

const createSlideForItem = async (item, title) => {
  const container = document.getElementById("slides-container");
  const itemId = item.Id;
  const backdropUrl = `${window.location.origin}/Items/${itemId}/Images/Backdrop/0`;
  const logoUrl = `${window.location.origin}/Items/${itemId}/Images/Logo`;

  const [backdropExists, logoExists] = await Promise.all([
    fetch(backdropUrl, { method: "HEAD" }).then((res) => res.ok),
    fetch(logoUrl, { method: "HEAD" }).then((res) => res.ok),
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
  const response = await fetch(
    `${window.location.origin}/Users/${userId}/Items/${itemId}`,
    {
      headers: {
        Authorization: `MediaBrowser Client="Jellyfin Web", Device="YourDeviceName", DeviceId="YourDeviceId", Version="YourClientVersion", Token="${token}"`,
      },
    }
  );
  const item = await response.json();
  console.log("Item Title:", item.Name);
  console.log("Item Overview:", item.Overview);
  return item;
};

const fetchItemIdsFromList = async () => {
  try {
    const response = await fetch(listFileName);
    if (!response.ok) {
      throw new Error("Failed to fetch list.txt");
    }
    const text = await response.text();
    return text
      .split("\n")
      .map((id) => id.trim())
      .filter((id) => id); // Remove empty lines and trim
  } catch (error) {
    console.error("Error fetching list.txt:", error);
    return [];
  }
};

const fetchItemsFromServer = async () => {
  try {
    const response = await fetch(
      `${window.location.origin}/Users/${userId}/Items?IncludeItemTypes=Movie,Series&Recursive=true&hasOverview=true&imageTypes=Logo,Backdrop&isPlayed=False&Limit=1500`,
      {
        headers: {
          Authorization: `MediaBrowser Client="Jellyfin Web", Device="YourDeviceName", DeviceId="YourDeviceId", Version="YourClientVersion", Token="${token}"`,
        },
      }
    );
    const data = await response.json();
    const items = data.Items;

    // Separate movies and TV shows
    const movies = items.filter((item) => item.Type === "Movie");
    const tvShows = items.filter((item) => item.Type === "Series");

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
    console.error("Error fetching items:", error);
    return [];
  }
};

const createSlidesForItems = async (items) => {
  await Promise.all(
    items.map((item) =>
      createSlideForItem(item, item.Type === "Movie" ? "Movie" : "TV Show")
    )
  );
};

const createPaginationDots = () => {
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "dots-container";

  for (let i = 0; i < 5; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dotsContainer.appendChild(dot);
  }

  const container = document.getElementById("slides-container");
  container.appendChild(dotsContainer);
};

const showSlide = (index) => {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.display = "block"; // Ensure the slide is visible
      // Force a reflow to apply the initial opacity before starting the fade-in
      slide.offsetHeight; // Trigger a reflow
      slide.style.opacity = "1"; // Fade in by setting opacity to 1
      slide.classList.add("active");
    } else {
      slide.style.opacity = "0"; // Fade out by setting opacity to 0
      slide.classList.remove("active");
      // Use setTimeout to wait for the opacity transition before hiding
      setTimeout(() => {
        slide.style.display = "none"; // Hide after fading out
      }, 500); // Match this timeout with your opacity transition duration
    }
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index % 5);
  });
};

const initializeSlideshow = () => {
  const slides = document.querySelectorAll(".slide");
  createPaginationDots();
  const container = document.getElementById("slides-container");
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
    container.style.display = "block"; // Make the container visible

    setTimeout(() => {
      setInterval(() => {
        // Automatically cycle through slides every shuffleInterval
        updateCurrentSlide(currentSlideIndex + 1);
      }, shuffleInterval);
    }, 10000); // Wait 10 seconds before starting the interval
  }

  // Handle focus state for slides
  slides.forEach((slide) => {
    slide.addEventListener(
      "focus",
      () => {
        focusedSlide = slide; // Set the currently focused slide
        container.classList.remove("disable-interaction"); // Enable interaction when a slide is focused
      },
      true
    ); // Use capture phase to ensure focus events are caught

    slide.addEventListener(
      "blur",
      () => {
        if (focusedSlide === slide) {
          focusedSlide = null; // Clear focus when slide is no longer focused
        }
      },
      true
    );
  });

  // Handle keyboard events for navigation and selection
  document.addEventListener("keydown", (event) => {
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
  container.addEventListener("focus", () => {
    containerFocused = true;
  });

  container.addEventListener("blur", () => {
    containerFocused = false;
  });
};

// Fetch item IDs from list.txt or from the server
const initializeSlides = async () => {
  const itemIds = await fetchItemIdsFromList();
  let items;

  if (itemIds.length > 0) {
    // Fetch items based on IDs from list.txt
    const itemPromises = itemIds.map((id) => fetchItemDetails(id));
    items = await Promise.all(itemPromises);
  } else {
    // Fetch random items from the server
    const allItems = await fetchItemsFromServer();
    const itemPromises = allItems.map((item) => fetchItemDetails(item.Id));
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
  console.error("No credentials or API key found.");
}
