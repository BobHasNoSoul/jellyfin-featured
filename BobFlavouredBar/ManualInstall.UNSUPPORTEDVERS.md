Manual installation (for unsupported version, seriously this only outlines what to do)

open your webroot

first identify the index.html make a backup file of it called index.html.bak (or your own backup system)

open the index.html in nano or another text editor 

add the following inside the <body> tags </body> 


```
<link rel="stylesheet" href="/web/avatars/custom.css">
<script>
// Function to make the Home button inside the hamburger menu work as intended with the featured bar
(function() {
    // Polling interval to check for the button
    const intervalId = setInterval(function() {
        // Try to find the button using the provided CSS selector
        const homeButton = document.querySelector('.mainDrawer-scrollContainer > a:nth-child(2)');

        // If the button is found
        if (homeButton) {
            // Attach the click event listener
            homeButton.addEventListener('click', function(event) {
                // Prevent the default action
                event.preventDefault();
                // Redirect to /web/index.html#/home.html
                window.location.href = '/web/index.html#/home.html';
            });

            // Clear the interval to stop further checks
            clearInterval(intervalId);
        }
    }, 100); // Check every 100ms
})();
</script>
<script>
    // Function to check if credentials exist in sessionStorage and reload main page fix for chrome and initial load
    function checkCredentialsAndReload() {
        try {
            // Check if credentials exist
            const credentials = sessionStorage.getItem('json-credentials');
            const reloaded = sessionStorage.getItem('home-page-reloaded');

            // If credentials exist and the page hasn't reloaded yet
            if (credentials && !reloaded) {
                // Reload the home page
                window.location.href = '/web/index.html';

                // Set the flag to stop constant reloading
                sessionStorage.setItem('home-page-reloaded', 'true');
            }
        } catch (error) {
            console.error('Error checking credentials:', error);
        }
    }

    // Call this function on page load to check credentials
    checkCredentialsAndReload();
</script>
<script>
// Function to make the Home button work as intended with the featured bar
    (function() {
        // Polling interval to check for the button
        const intervalId = setInterval(function() {
            // Try to find the button
            const homeButton = document.querySelector('.headerHomeButton.barsMenuButton');

            // If the button is found
            if (homeButton) {
                // Attach the click event listener
                homeButton.addEventListener('click', function(event) {
                    // Redirect to /web/index.html#/home.html
                    window.location.href = '/web/index.html#/home.html';
                });

                // Clear the interval to stop further checks
                clearInterval(intervalId);
            }
        }, 100); // Check every 100ms
    })();
</script>
<script>
// Function to save credentials to sessionStorage
function saveCredentialsToSessionStorage(credentials) {
  try {
    // Store the credentials in sessionStorage
    sessionStorage.setItem('json-credentials', JSON.stringify(credentials));
    console.log('Credentials saved to sessionStorage.');
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
}

// Function to save the API key to sessionStorage
function saveApiKey(apiKey) {
  try {
    sessionStorage.setItem('api-key', apiKey);
    console.log('API key saved to sessionStorage.');
  } catch (error) {
    console.error('Error saving API key:', error);
  }
}

// Override the default console.log function
(function() {
  var originalConsoleLog = console.log;

  console.log = function(message) {
    // Call the original console.log method
    originalConsoleLog.apply(console, arguments);

    // Check if the message contains the JSON credentials
    if (typeof message === 'string' && message.startsWith('Stored JSON credentials:')) {
      try {
        // Extract the JSON credentials from the message
        var jsonString = message.substring('Stored JSON credentials: '.length);
        var credentials = JSON.parse(jsonString);

        // Save the credentials to sessionStorage
        saveCredentialsToSessionStorage(credentials);
      } catch (error) {
        console.error('Error parsing credentials:', error);
      }
    }

    // Check if the message contains the WebSocket URL with api_key
    if (typeof message === 'string' && message.startsWith('opening web socket with url:')) {
      try {
        // Extract the API key from the message
        var url = message.split('url:')[1].trim();
        var urlParams = new URL(url).searchParams;
        var apiKey = urlParams.get('api_key');

        if (apiKey) {
          saveApiKey(apiKey);
        }
      } catch (error) {
        console.error('Error extracting API key:', error);
      }
    }
  };
})();
</script>

```

now you need to save it and identify home-html file (this will have a different uuid each build so it will be something like home-html.*.js but with a uuid where * is 

note you can also find this file using the inspect in your web browser going to the network tab then reloading the page in jellyfin and filter the word home (it has two of these but only one is called home-html)

once you have found that file and made a backup of it add 

```

<script>const script=document.createElement("script");script.src="/web/avatars/slideshowpure.js?t=" + new Date().getTime();script.defer=true;document.head.appendChild(script);</script><<script>(function() { const hasReloaded = sessionStorage.getItem("has-reloaded"); if (!hasReloaded) { setTimeout(function() { window.location.reload(); sessionStorage.setItem("has-reloaded", "true"); }, 1500); } })();</script>

```

before the final </div>

and now add the following directly AFTER the part in that file that reads `data-backdroptype="movie,series,book">`

```

<div id="slides-container" class="slides-container"><div class="slide"></div></div>


```


now you simply have to save the avatars folder from the repo and their files into the avatars folder in your webroot

there we have it you have now manually installed it 
