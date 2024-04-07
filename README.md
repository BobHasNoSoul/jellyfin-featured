# jellyfin-featured

what does this do? 
well it makes a featured banner that changes every 10 seconds to the next item defined by the admin, it takes a single link per item, text title and your website url and does the rest for you. when a user clicks the item it will open and just take them to the item that is on that banner at that time. this works on the clients and pc but has one issue at the moment with the tv clients that stops the banner being clicked on because the <button> doesnt know what to do when it is inside an iframe.. if you know how to fix this send a pull request :)

![Screenshot 2023-11-11 090503](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/be19e601-da6f-4428-ba66-0c8179b2dd55)
![Screenshot 2023-11-11 090444](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/b130be09-fe20-489f-a22a-7d241c429a71)
![Screenshot 2023-11-11 090420](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/38532b32-f335-4918-a970-48a5d6685076)


## REQUIREMENTS
- a jellyfin install
- jq installed on the system for the descriptions to load `sudo apt install jq`
- the ability to read this guide. (maybe also grab my avatars pack that will be updated soon too)

## okay so there have been a number of updates

API integration to also pull the details for the items that are in the lists.. for this you need to modify make.sh with your userid and an api key for jellyfin like we did with pull.py but in make.sh, everything else stays the same but it has a sleeker look.

the old version without the update to descriptions etc can still be used at makeold.sh
API integration to pull a specific user favorites, you can use that by editing the pull.py and adding your own userid (its in the address bar when you edit that user userid=STRINGYOUNEEDHERE so you would only copy the part that is after the = sign) then you put your api key in there from jellyfin (generate a new one if needed) you then simply need to make sure your base_url is correct so specify the correct ip and port or use a domain name etc then save it 

to update it to your favorites you need to run this command after you have completed the above steps of editing the one file with the needed keys and ids `sudo ./make.sh -p -h "Featured Content" -l ./userfavorites.txt` if you wish the userfavorites to be shuffled so they are not in alphabetical order just run this command `sudo ./make.sh -p -m -h "Featured Content" -l ./shuffle.txt`

you can still make manual lists like i have by editing the files in lists directory with the itemid of the content (in the url there is an itemid in there that you just put one per line its really quite simple. 



## Crontab example
To use crontabs sucessfully you should edit the bottom line of the make.sh script to point to where you have your mounted avatars folder for slideshow.html to be injected properly.

``` 
# christmas featured list (1st december)
0 1 1 12 * /path/to/jellyfin-featured/make.sh -h "Christmas Season" -l /path/to/jellyfin-featured/lists/christmas.txt
#new year featured list (day after boxing day)
0 1 27 12 * /path/to/jellyfin-featured/make.sh -h "Happy New Year" -l /path/to/jellyfin-featured/lists/newyears.txt
#Normal list (2nd jan)
0 1 2 1 * /path/to/jellyfin-featured/make.sh -h "Featured Content" -l /path/to/jellyfin-featured/lists/normal.txt
#Valentines Day (10th onwards)
0 1 10 2 * /path/to/jellyfin-featured/make.sh -h "Valentines Hits" -l /path/to/jellyfin-featured/lists/valentines.txt
#Normal list (15th feb)
0 1 15 2 * /path/to/jellyfin-featured/make.sh -h "Featured Content" -l /path/to/jellyfin-featured/lists/normal2.txt
#Easter (mar 15th onwards)
0 1 15 3 * /path/to/jellyfin-featured/make.sh -h "Easter Eggs-travaganza" -l /path/to/jellyfin-featured/lists/easter.txt
#Normal list (15th april)
0 1 15 4 * /path/to/jellyfin-featured/make.sh -h "Featured Content" -l /path/to/jellyfin-featured/lists/normal.txt
#Halloween (1st october onwards)
0 1 1 10 * /path/to/jellyfin-featured/make.sh -h "Halloween Featured" -l /path/to/jellyfin-featured/lists/halloween.txt
#Normal list (1nd nov)
0 1 1 11 * /path/to/jellyfin-featured/make.sh -h "Featured Content" -l /path/to/jellyfin-featured/lists/normal2.txt
#Stephenkings brithday 21st september
0 1 21 9 * /path/to/jellyfin-featured/make.sh -h "Stephen King Day" -l /path/to/jellyfin-featured/lists/stephenking.txt
#Normal list (1nd nov)
0 1 22 9 * /path/to/jellyfin-featured/make.sh -h "Featured Content" -l /path/to/jellyfin-featured/lists/normal2.txt
```

## Installation

 - Windows Install

1. download the files from this repo using the zip or gitclone, you pick.
2. install ubuntu from the windows store and use windows subsystem linux for the shell script (you could use cygwin but at this point there isnt a real reason to).
3. open `C:\Program Files\Jellyfin\Server\jellyfin-web\` and create a new folder called `avatars` this will be where the slideshow.html will be living.
4. open ubuntu for windows via the start menu and enter the following commands

```
sudo apt install jq python3
cd "/mnt/c/Program Files/Jellyfin/Server/jellyfin-web/"
ls | grep home-html
```
copy the output line that is like this but the uuid changed home-html.5c3fff1ba3bf5ae955e7.chunk.js you will need to modify that file with the following.

find this part 

`data-backdroptype="movie,series,book">` and insert the following directly after the `>`

`<style>.featurediframe { width: 89vw; height: 300px; display: block; border: 1px solid #000; margin: 0 auto}</style> <iframe class="featurediframe" src="/web/avatars/slideshow.html"></iframe>`

okay now we have injected the iframe we are %80 of the way there.

5. get the following info api key for jellyfin (settings page of jellyfin look for api and make a new one), your website url (or your ip and port), a user uuid (get this from the profile page and the url will look like this `http://192.168.1.76:8096/web/index.html#!/useredit.html?userId=8cc7e498c8e84dae945321f091ad675f` the uuid for that user is the end part `8cc7e498c8e84dae945321f091ad675f` 

6. edit pull.py and add your API key from jellyfin and user uuid in there and save

7. edit make.sh and add your API key from jellyfin, user uuid and webite url on line 18 onwards (there are only three options to edit there)

7b. optional edit the bottom to point to your avatars folder and replace itself on each run making it semi automatic so you can run it as a crontab.
example for most installs will be the following `sudo cp slideshow.html /mnt/c/Program Files/Jellyfin/Server/jellyfin-web/avatars/slideshow.html`

8. save the file and run it in the ubuntu window via `./make.sh -p -l userfavorites.txt -h "TEXT FOR TITLE HERE"`

9. done get your clients to reload their cache and it will be there if you dont have any favorites before running step 8 it will give you a white box, add some favorites and pull them again with the command from step 8, also you could use the list.txt as outlined in the readme. (this is a hobby not my main job so its kinda a rush to throw all the info up here then head out to work).

---

if you are using docker you will need to change the directories it is using for your mapped directories, and then the steps are pretty much identical.

*if you are using windows, you have to put it in your C:\Program Files\Jellyfin\Server\jellyfin-web\avatars\ directory and modify the home-html.chunk in the C:\Program Files\Jellyfin\Server\jellyfin-web\ directory directly*

*if you are using bare metal install of jellyfin on linux i will assume you already know where the server files for jellyfin-web are installed if not they will be in the log when you first start the server.*

*if your users cannot see it they need to clear their browser data/cache NOTE: description has been disabled for mobile users because of restrictions on screen space*

You need to link you home-html chunk js file in docker to a custom file on your server if using docker

first find your file name (every file name is different because the random string generated on install)
run the following commands (this assumes official docker image on linux)

`sudo docker exec -it jellyfin /bin/bash`
then 
`cd /jellyfin/jellyfin-web/`
then 
`ls | grep home-html`

it will output a line like `home-html.5c3fgf6ba3bf5ap999c.chunk.js` you want to use that in the next part because your random string should be different

e.g. in your volumes you would put something like this but obviously change the random string to match yours you just found

`- ./custom-html-chunk.js:/jellyfin/jellyfin-web/home-html.5c3fgf6ba3bf5ap999c.chunk.js`

you will need to bring the docker container up again with the mapping changes.

this will be edited to iject the iframe as needed for the featured bar In that file you need to insert the following code directly after  `data-backdroptype="movie,series,book">` 

the code to insert is 
`<style> .featurediframe { width: 89vw; height: 300px; display: block; margin: 0 auto;} </style> <iframe class="featurediframe" src="/web/avatars/slideshow.html"></iframe> `

save the file

then you need a new mapping create a folder called avatars and map that to /usr/share/jellyfin/web/avatars for example

`- ./avatars:/jellyfin/jellyfin-web/avatars`

## Alternate Installation
thanks to SethBacon at forum.jellyfin.org for this custom html that allows for 200 movies/shows etc to be pulled when there is an abscence of a list.txt written mainly in javascript creates a slightly different experiance 

![phone](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/13c20204-2af4-4412-b485-004ff5201f24)
![Capture2](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/6dbd403d-fe75-48b5-a4cf-6ed4d8b45cb3)

simply edit alternate.html and change the "CHANGEME" sections for the userid and api key then save a copy of alternate.html as slideshow.html in your avatars dir 

this will then pull on load a list of 200 random movies and tv shows it also gives a nice looking style to it to match the original jellyfin theming including header. 

NOTE: THIS VERSION ISNT ABLE TO BE RAN VIA MAKE.SH YET SO CRONTAB EXAMPLE WILL NOT WORK FOR IT.. YET

## USAGE: 
now create a slideshow with your links we need to create a list.txt with our itemids one per line you can get your ids from the url of the item you are wanting to link e.g. `https://example/web/index.html#!/details?id=32e64643a3a798aa85943d6b55c4a038&context=tvshows` becomes `32e64643a3a798aa85943d6b55c4a038`

`sudo chmod +x ./make.sh`

you can now run the main script by using `./make.sh -h "YOUR TITLE HERE" -l ./list.txt` that will create the featured bar be populated with the items which ids are in list.txt and have a title of "YOUR TITLE HERE" simply change that as appropriate

it will make the new file "slideshow.html" copy that into your avatars dir you made and mapped a second ago and bring up the docker container again with the new mapping for the avatars folder.

you can add the following line but edit it to fit your specific setup in make.sh
`cp slideshow.html /path/to/mapped/slideshow.html`

all done

# If you experiance slow loading of the interface because of 200+ images on clients with slow internet connection you can fix that by editing the following

in home-html you need to add this to the already inserted code from above all we are doing is adding the display none part to it. 

`<iframe class="featurediframe" src="/web/avatars/slideshow.html" style="display:none;"></iframe>`

you now need to edit index.html and insert the following code in the <body></body> tags (this makes it load after 8 seconds (my clients have semi slow intenet speeds to i tuned it to them.. however if they have dialup maybe increase this higher to reduce load at the same time)


````
<script>// page loads starts delay timer
_delay = setInterval(delayCheck, 500)
    // Function to load content after 8 seconds
    function loadContentDelayed() {
        setTimeout(function() {
            // Replace 'featurediframe' with your CSS selector
            var elements = document.querySelectorAll('.featurediframe');
            elements.forEach(function(element) {
                element.style.display = 'block';
            });
        }, 8000); // 8 seconds in milliseconds
    }

    // Call the function when the page finishes loading
    window.onload = loadContentDelayed;
</script>
````
