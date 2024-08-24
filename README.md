# jellyfin-featured

what does this do? 
well it makes a featured banner that changes every 10 seconds to the next item defined by the admin, it takes a single link per item, text title and your website url and does the rest for you. when a user clicks the item it will open and just take them to the item that is on that banner at that time. this works on the clients and pc but has one issue at the moment with the tv clients that stops the banner being clicked on because the <button> doesnt know what to do when it is inside an iframe.. if you know how to fix this send a pull request :)

![Screenshot 2023-11-11 090503](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/be19e601-da6f-4428-ba66-0c8179b2dd55)
![Screenshot 2023-11-11 090444](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/b130be09-fe20-489f-a22a-7d241c429a71)
![Screenshot 2023-11-11 090420](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/38532b32-f335-4918-a970-48a5d6685076)


## REQUIREMENTS
- a jellyfin install
- a brain
- the ability to read this guide. (maybe also grab my avatars pack that will be updated soon too)

## okay so there have been a number of updates

oh no major updates (okay so since i got tagged in an issue a user was having with the alternate.html im going to rewrite it in my image.. for i am... bob)

what it does now (oh no there is no need to get an api key.. or userid 

if no list.txt is present the user that is currently logged in will see random items that that user has access to (so kids dont get recommended horror films that give them nightmares or your friend that doesnt understand your anime fettish doesnt get your anime library.. yes this is about someone.. you know who you are). 

does it have the same format for lists.txt? No 

now it goes 

Title of playlist here
itemid
itemid
itemid

this is great for custom playlists and loads really really fast

it is slower to load random lists because it does a api call and fetch (2-3 seconds on slower systems)

oh also because people have items without both backdrops and logos ive taken care of that.. they will not load slides containing an item without both a backdrop and a logo.. do not open an issue about this not loading your logoless item.. it looks weird if you dont have both.. if you want that fork the repo and mod to your hearts content.. if you made it a toggle.. i would happily accept a pull request however i really cant be arsed to re theme a logo-less one and then a backdropless one.

Security updates:
because i didnt like the js being able to have plain text api key and userid.. i have rewrote it to make the user get their own automatically using javascript and having them in the sessionstorage, this wont save forever so dont worry it just gets seen by the slideshow

also it no longer leaks content out like the backdrop or logos or descriptions to non logged in users, it will only work if they are using it inside of jellyfin after logging in.. so all around more secure.


## sudo Crontab example
okay so this assumes you already have the lists made i reccomend using lists/halloween.txt etc as a naming standard

so with that said we will be doing a simple keep your lists out of the dir then copy them over crontab so they auto update.

``` 
# christmas featured list (1st december)
0 1 1 12 * cp /path/to/lists/christmas.txt /usr/share/jellyfin/web/avatars/list.txt
#new year featured list (day after boxing day)
0 1 27 12 * cp /path/to/lists/newyears.txt /usr/share/jellyfin/web/avatars/list.txt
#Normal random list (2nd jan)
0 1 2 1 * rm /usr/share/jellyfin/web/avatars/list.txt
#Valentines Day (10th onwards)
0 1 10 2 * cp /path/to/lists/valentines.txt /usr/share/jellyfin/web/avatars/list.txt
#Normal list (15th feb)
0 1 15 2 * rm /usr/share/jellyfin/web/avatars/list.txt
#Easter (mar 15th onwards)
0 1 15 3 * cp /path/to/lists/easter.txt /usr/share/jellyfin/web/avatars/list.txt
#Normal list (15th april)
0 1 15 4 * rm /usr/share/jellyfin/web/avatars/list.txt
#Halloween (1st october onwards)
0 1 1 10 * cp /path/to/lists/halloween.txt /usr/share/jellyfin/web/avatars/list.txt
#Normal list (1nd nov)
0 1 1 11 * rm /usr/share/jellyfin/web/avatars/list.txt
#Stephenkings brithday 21st september
0 1 21 9 * cp /path/to/lists/stephenking.txt /usr/share/jellyfin/web/avatars/list.txt
#Normal list (1nd nov)
0 1 22 9 * rm /usr/share/jellyfin/web/avatars/list.txt
```

## Installation

 - Windows Install

1. download the files from this repo using the zip or gitclone, you pick.. its the same result
2. install ubuntu from the windows store and use windows subsystem linux for the shell script (you could use cygwin but at this point there isnt a real reason to).
3. open `C:\Program Files\Jellyfin\Server\jellyfin-web\` and create a new folder called `avatars` this will be where the slideshow.html will be living.
4. open ubuntu for windows via the start menu and enter the following commands

```
cd "/mnt/c/Program Files/Jellyfin/Server/jellyfin-web/"
ls | grep home-htm
```
 copy the output line that is like this but the uuid changed home-html.YOURSWILLHAVENUMBERSHERE.chunk.js you will need to modify that file with the following.

find this part 

`data-backdroptype="movie,series,book">` and insert the following directly after the `>`

`<style>.featurediframe { width: 89vw; height: 300px; display: block; border: 1px solid #000; margin: 0 auto}</style> <iframe class="featurediframe" src="/web/avatars/slideshow.html"></iframe>`

okay now we have injected the iframe we are %80 of the way there.

5. Okay so now we just need to edit the index.html in your webroot (/mnt/c/Program Files/Jellyfin/Server/jellyfin-web/index.html) so open it in your favorite text editor and find the following 

`</body></html>`

replace with 

`<script>
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
</body></html>`

6. save the file and close the file

7. simply reload the page after clearing the cache (incognito mode or ctrl+shift+r on some browsers)

7b (optional). make custom lists and crontab them for best effect

---

## Docker

Instructions to be added at a later date

---

## Linux

to install on linux it is super simple 

your webroot is /usr/share/jellyfin/web (by default if it isnt just adjust this for your custom one you put in) 

inside webroot make the avatars folder and then download the slideshow.html from this repo and put that inside the avatars folder inside of webroot (that should be /usr/share/jellyfin/web/avatars/slideshow.html)

when inside the webroot run  the following

`sudo nano index.html`

find `</body></html>`

replace with 

`<script>
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
</body></html>`

then run `sudo nano home-html.*.chunk.js`

find `data-backdroptype="movie,series,book">` and insert the following directly after the `>`

`<style>.featurediframe { width: 89vw; height: 300px; display: block; border: 1px solid #000; margin: 0 auto}</style> <iframe class="featurediframe" src="/web/avatars/slideshow.html"></iframe>`

now save it and you should be good to go once you reload your browsers cache on the client side 

optional make a list.txt inside /usr/share/jellyfin/web/avatars/list.txt using the following syntax

TITLE OF PLAYLIST HERE
itemid
itemid
itemid

---
