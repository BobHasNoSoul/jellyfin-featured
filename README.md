# jellyfin-featured

what does this do? 
well it makes a featured banner that changes every 10 seconds to the next item defined by the admin, it takes a single link per item, text title and your website url and does the rest for you.

![Screenshot 2023-11-08 171638](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/c0765ae0-1eaa-4126-8963-792697d13a68)
![Screenshot 2023-11-08 171524](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/c8865f2b-1a91-4c38-ad49-ce3e768395bb)
![Screenshot 2023-11-08 171453](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/d44b5c3c-7c2f-469f-a1ba-bc433f27633d)

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

*if you are using windows, you have to put it in your C:\Program Files\Jellyfin\Server\jellyfin-web\avatars\ directory and modify the home-html.chunk in the C:\Program Files\Jellyfin\Server\jellyfin-web\ directory directly*

*if you are using bare metal install of jellyfin on linux i will assume you already know where the server files for jellyfin-web are installed if not they will be in the log when you first start the server.*

*if your users cannot see it they need to clear their browser data/cache*

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

## USAGE: 
now create a slideshow with your links we need to create a list.txt with our itemids one per line you can get your ids from the url of the item you are wanting to link e.g. `https://example/web/index.html#!/details?id=32e64643a3a798aa85943d6b55c4a038&context=tvshows` becomes `32e64643a3a798aa85943d6b55c4a038`

`sudo chmod +x ./make.sh`

you can now run the main script by using `./make.sh -h "YOUR TITLE HERE" -l ./list.txt` that will create the featured bar be populated with the items which ids are in list.txt and have a title of "YOUR TITLE HERE" simply change that as appropriate

it will make the new file "slideshow.html" copy that into your avatars dir you made and mapped a second ago and bring up the docker container again with the new mapping for the avatars folder.

you can add the following line but edit it to fit your specific setup in make.sh
`cp slideshow.html /path/to/mapped/slideshow.html`

all done
