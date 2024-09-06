# jellyfin-avatars

keyupdate: it no longer needs the user to download the image and manually add it, it just updates the current users image with a simple tap or click

adds a html page and a button to jellyfin 10.7.x and higher for users to get more avatars

this guide was thrown together as a more in depth way of getting avatars on jellyfin from my jellyfin-mods repo.. if you like this head there and maybe you will see some other things you like. 

![](https://user-images.githubusercontent.com/23018412/115957171-d65a0300-a4f8-11eb-8a8a-698e4620ea6d.PNG)
![](https://user-images.githubusercontent.com/23018412/115976186-3eddca00-a563-11eb-8597-81341924c750.PNG)

---

# installation
go to your web root (usually /usr/share/jellyfin/web) now run these commands

    sudo wget https://github.com/BobHasNoSoul/jellyfin-avatars/archive/refs/heads/main.zip
    sudo unzip main.zip

and now we need to edit the profile tab to enable the button :D 

    sudo nano user-profile-index-html.*.bundle.js

now replace the following string:

    <span>${DeleteImage}</span> </button>

with the following:

    <span>${DeleteImage}</span> </button> <button is="emby-buttoon" type="button" class="raised" id="btnMoreImages">><STYLE>A {text-decoration: none; color: #def3fb} </STYLE><span>${<a href="/web/jellyfin-avatars-main/avatars.html" target="_blank">More Images</a>}</span></button>

now you can just simply save this file 

one extra edit is needed to make this work (or you will get an api error)

simply edit `index.html` and add find and replace `</body></html>` with 

```
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
</body></html>
```

now save the file and clear cache and reload in your client browser / app

all set :D
