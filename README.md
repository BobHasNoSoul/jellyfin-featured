# jellyfin-featured

NOTE: this works for the webui only at its current form, there is another way to do this that works with re-writing chunk.js files themselves but for now this works well on webui (so any browser based experiance)

what does this do? 
well it makes a featured banner that changes every 10 seconds to the next item defined by the admin, it takes a single link per item, text title and your website url and does the rest for you.

[2023-10-29 12-00-53-1.webm](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/b41b28e3-5cf4-4c3a-a702-8eab59e10358)

![Screenshot 2023-10-29 at 22-05-39 Jellyfin](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/6589502e-b85c-4d53-9c9e-881072401c35)

![Screenshot 2023-10-29 at 22-04-33 Jellyfin](https://github.com/BobHasNoSoul/jellyfin-featured/assets/23018412/94c112a9-4da5-4667-8f82-a304b03c0365)


## Installation

You need to link you home-html chunk js file in docker to a custom file on your server if using docker

first find your file name (every file name is different because the random string generated on install)
run the following commands (this assumes official docker image on linux)

'sudo docker exec -it jellyfin /bin/bash' then 'cd /jellyfin/jellyfin-web/' then `ls | grep home-html`

it will output a line like `home-html.5c3fgf6ba3bf5ap999c.chunk.js` you want to use that in the next part because your random string should be different

e.g. in your volumes you would put something like this but obviously change the random string to match yours you just found

`- ./custom-html-chunk.js:/jellyfin/jellyfin-web/home-html.5c3fgf6ba3bf5ap999c.chunk.js`

you will need to bring the docker container up again with the mapping changes.

this will be edited to iject the iframe as needed for the featured bar In that file you need to insert the following code directly after  `data-backdroptype="movie,series,book">` 

the code to insert is 
`<style> .featurediframe { width: 89vw; height: 300px; display: block; border: 1px solid #000; margin: 0 auto;} </style> <iframe class="featurediframe" src="/web/avatars/slideshow.html"></iframe> `

save the file

then you need a new mapping create a folder called avatars and map that to /usr/share/jellyfin/web/avatars for example

`- ./avatars:/jellyfin/jellyfin-web/avatars`

now create a slideshow with your links REMOVE SERVER ID FROM THE URLS or it can bug out

modify the CREATE.sh file at the top there are a few things to change like HEADER WEBSITE and the links of the content you want to uset modify them to be your own items

now you can save the script with your links in it and header and url changed

sudo chmod +x CREATE.sh

now just run ./CREATE.sh

it will make the new file "slideshow.html" copy that into your avatars dir you made and mapped a second ago and bring up the docker container again with the new mapping for the avatars folder.

all done

if you are using windows, you have to put it in your C:\Program Files\Jellyfin\Server\jellyfin-web\avatars\ directory and modify the home-html.chunk in the C:\Program Files\Jellyfin\Server\jellyfin-web\ directory directly

if you are using bare metal install of jellyfin on linux i will assume you already know where the server files for jellyfin-web are installed if not they will be in the log when you first start the server.

if your users cannot see it they need to clear their browser data /cache (opera sucks for this)
