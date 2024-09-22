#!/bin/bash

# Define color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Getting user preferences
read -p "$(echo -e Input, ${YELLOW}in seconds${NC}, how much time each slide should be shown --\> ) " slide_time
slide_time=${slide_time:-10}
slide_time=$((slide_time * 1000)) # Times 1000 to convert to milisseconds

read -p "$(echo -e How many ${YELLOW}movies${NC} you want to be fetched if no list is found? --\> ) " movies_count
movies_count=${movies_count:-15}
read -p "$(echo -e How many ${YELLOW}series${NC} you want to be fetched if no list is found? --\> ) " series_count
series_count=${series_count:-15}


# The files, single lined, that will be created to be used
css='@import url(https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap);.backdrop,.slide{position:absolute}.featured-content,.plot-container{font-family:"Noto Sans",sans-serif;left:0}.plot,body{overflow:hidden}body{margin:0;padding:0}.fade-in{opacity:1!important}.fade-out{opacity:0!important}#slides-container{height: 350px}.slide{opacity:0;transition:opacity 1s ease-in-out;top:0;left:0;width:100%;height:350px}.slide.active{opacity:1;z-index:1}.slide:focus{outline:#fff solid 2px}.backdrop{right:0;width:70%;height:100%;object-fit:cover;object-position:center 20%;border-radius:5px;z-index:1;loading:lazy}.logo-container{width:35%;height:40%;position:relative;display:flex;justify-content:center;align-items:center}.logo{max-height:80%;max-width:80%;width:auto;z-index:3;loading:lazy}.featured-content{position:absolute;top:0;width:100%;height:50px;background-color:transparent;color:#d3d3d3;font-size:22px;display:none;align-items:center;justify-content:flex-start;z-index:2}.plot-container{position:absolute;bottom:0;color:#fff;width:33%;height:60%;font-size:15px;padding:10px 0 25px 15px;border-radius:5px;z-index:4;box-sizing:border-box;display:flex;align-items:center;justify-content:center;text-align:center}.plot{display:-webkit-box;line-clamp:8;-webkit-line-clamp:8;-webkit-box-orient:vertical}.gradient-overlay{position:absolute;top:0;left:0;width:70%;height:100%;background:linear-gradient(to right,#000 49%,rgba(0,0,0,0) 70%);z-index:2}@media only screen and (max-width:767px){.gradient-overlay{width:100%;height:68%;top:unset;bottom:0;background:linear-gradient(to top,#000 49%,rgba(0,0,0,0) 70%)}.backdrop{width:100%}.logo-container{width:50%;height:35%;justify-content:start;align-items:start;margin:10px}.logo{padding:5px;background:rgba(0,0,0,.5);border-radius:5px}.plot-container{padding:10px;height:35%;width:100%}.plot{line-clamp:4;-webkit-line-clamp:4}}'
js='const slidesInit=()=>{const e=`${window.location.origin}/web/avatars/list.txt`,t=sessionStorage.getItem("json-credentials"),o=sessionStorage.getItem("api-key");let n=null,i=null;if(t){const e=JSON.parse(t);n=e.Servers[0].UserId,i=e.Servers[0].AccessToken}const s=e=>e.sort((()=>Math.random()-.5)),a=async(e,t)=>{const o=document.querySelector("#indexPage:not(.hide)");if(!o)return;const n=o.querySelector("#slides-container"),i=e.Id,s=`${window.location.origin}/Items/${i}/Images/Backdrop/0`,a=`${window.location.origin}/Items/${i}/Images/Logo`,[r,c]=await Promise.all([fetch(s,{method:"HEAD"}).then((e=>e.ok)),fetch(a,{method:"HEAD"}).then((e=>e.ok))]);if(r&&c){const o=((e,t)=>{const o=e.Id,n=e.Overview||"No overview available",i=document.createElement("a");i.className="slide",i.href=`${window.location.origin}/web/#/details?id=${o}`,i.target="_top",i.rel="noreferrer",i.tabIndex=0;const s=document.createElement("img");s.className="backdrop",s.src=`${window.location.origin}/Items/${o}/Images/Backdrop/0`,s.alt="Backdrop",s.loading="lazy";const a=document.createElement("img");a.className="logo",a.src=`${window.location.origin}/Items/${o}/Images/Logo`,a.alt="Logo",a.loading="lazy";const r=document.createElement("div");r.className="logo-container",r.appendChild(a);const l=document.createElement("div");l.className="featured-content",l.textContent=t;const c=document.createElement("span");c.className="plot",c.textContent=n;const d=document.createElement("div");d.className="plot-container",d.appendChild(c);const m=document.createElement("div");return m.className="gradient-overlay",i.append(m,s,r,l,d),i})(e,t);n.appendChild(o),console.log(`Added slide for item ${i}`),1===n.children.length&&l(0)}else console.warn(`Skipping item ${i}: Missing backdrop or logo.`)},r=async e=>{const t=await fetch(`${window.location.origin}/Users/${n}/Items/${e}`,{headers:{Authorization:`MediaBrowser Client="Jellyfin Web", Device="YourDeviceName", DeviceId="YourDeviceId", Version="YourClientVersion", Token="${i}"`}}),o=await t.json();return console.log("Item Title:",o.Name),console.log("Item Overview:",o.Overview),o},l=e=>{const t=document.querySelector("#indexPage:not(.hide)");if(!t)return;t.querySelectorAll(".slide").forEach(((t,o)=>{o===e?(t.style.display="block",t.offsetHeight,t.style.opacity="1",t.classList.add("active")):(t.style.opacity="0",t.classList.remove("active"),setTimeout((()=>{t.style.display="none"}),500))}))};t&&o?(async()=>{const t=await(async()=>{try{const t=await fetch(e);if(!t.ok)throw new Error("Failed to fetch list.txt");return(await t.text()).split("\n").map((e=>e.trim())).filter((e=>e))}catch(e){return console.warn("Error fetching list.txt:",e),[]}})();let o;if(t.length>0){const e=t.map((e=>r(e)));console.groupCollapsed("Item Details"),o=await Promise.all(e),console.groupEnd()}else{const e=await(async()=>{try{const e=await fetch(`${window.location.origin}/Users/${n}/Items?IncludeItemTypes=Movie,Series&Recursive=true&hasOverview=true&imageTypes=Logo,Backdrop&isPlayed=False&Limit=1500`,{headers:{Authorization:`MediaBrowser Client="Jellyfin Web", Device="YourDeviceName", DeviceId="YourDeviceId", Version="YourClientVersion", Token="${i}"`}}),t=(await e.json()).Items,o=t.filter((e=>"Movie"===e.Type)),a=t.filter((e=>"Series"===e.Type)),r=s(o),l=s(a),c=r.slice(0,$movies_count),d=l.slice(0,$series_count),m=[],u=Math.max(c.length,d.length);for(let e=0;e<u;e++)e<c.length&&m.push(c[e]),e<d.length&&m.push(d[e]);return m}catch(e){return console.error("Error fetching items:",e),[]}})(),t=e.map((e=>r(e.Id)));console.groupCollapsed("Item Details"),o=await Promise.all(t),console.groupEnd()}await(async e=>{console.groupCollapsed("Creating slides"),await Promise.all(e.map((e=>a(e,"Movie"===e.Type?"Movie":"TV Show")))),console.groupEnd()})(o),(()=>{const e=document.querySelector("#indexPage.hide");if(e){const t=e.querySelector("#slides-container");t&&t.remove()}const t=document.querySelector("#indexPage:not(.hide)");if(!t)return;const o=t.querySelectorAll(".slide"),n=t.querySelector("#slides-container");let i=0,s=null,a=!1;const r=e=>{i=(e+o.length)%o.length,l(i)},c=()=>{s&&(window.location.href=s.href)};o.length>0&&(l(i),n.style.display="block","undefined"!=typeof intervalChangeSlide&&null!==intervalChangeSlide&&clearInterval(intervalChangeSlide),setTimeout((()=>{setInterval((()=>{r(i+1)}),$slide_time)}),1e4)),o.forEach((e=>{e.addEventListener("focus",(()=>{s=e,n.classList.remove("disable-interaction")}),!0),e.addEventListener("blur",(()=>{s===e&&(s=null)}),!0)})),t.addEventListener("keydown",(e=>{if(a)switch(e.keyCode){case 37:r(i-1);break;case 39:r(i+1);break;case 13:c()}})),t.addEventListener("click",(e=>{e.target.closest(".slide")&&c()})),t.addEventListener("focusin",(e=>{e.target.closest("#slides-container")&&(a=!0,n.classList.remove("disable-interaction"))})),t.addEventListener("focusout",(e=>{e.target.closest("#slides-container")||(a=!1,n.classList.add("disable-interaction"))}))})()})():console.error("No credentials or API key found.")};'

# Replacing parts of the file with variables
js="${js//\$slide_time/$slide_time}"
js="${js//\$movies_count/$movies_count}"
js="${js//\$series_count/$series_count}"

# Use printf to handle create the files
printf '%s\n' "$css" > slideshowStyle.css
printf '%s\n' "$js" > slideshowScript.js


# "Installing" it, modifying jellyfin files
nedded_functions='function saveCredentialsToSessionStorage(e){try{sessionStorage.setItem("json-credentials",JSON.stringify(e)),console.log("Credentials saved to sessionStorage.")}catch(e){console.error("Error saving credentials:",e)}}function saveApiKey(e){try{sessionStorage.setItem("api-key",e),console.log("API key saved to sessionStorage.")}catch(e){console.error("Error saving API key:",e)}}!function(){var e=console.log;console.log=function(r){if(e.apply(console,arguments),"string"==typeof r&&r.startsWith("Stored JSON credentials:"))try{var s=r.substring(25);saveCredentialsToSessionStorage(JSON.parse(s))}catch(e){console.error("Error parsing credentials:",e)}if("string"==typeof r&&r.startsWith("opening web socket with url:"))try{var o=r.split("url:")[1].trim(),t=new URL(o).searchParams.get("api_key");t&&saveApiKey(t)}catch(e){console.error("Error extracting API key:",e)}}}();'
printf '%s\n' "$nedded_functions" > init_script.js

check_backup() {
  local file="$1"
  if [ -n "$file" ] && [ -f "$file" ]; then
    manage_backup "$file"
  else
    echo "Warning: File not found or empty path: $file"
  fi
}

manage_backup() {
  local file="$1"
  local backup="${file}.bkp"

  if [ ! -f "$backup" ]; then
    cp "$file" "$backup"
    echo "Backup created: $backup"
  else
    rm "$file"
    cp "$backup" "$file"
  fi
}

parent_dir="../"
indexHtml=$(find "$parent_dir" -maxdepth 1 -name "index.html" 2>/dev/null)
check_backup "$indexHtml"

homeHtml=$(find "$parent_dir" -maxdepth 1 -name "home-html.*.chunk.js" 2>/dev/null)
check_backup "$homeHtml"

find='</body></html>'
replace_with='<script src="/web/avatars/init_script.js"></script><link rel="stylesheet" href="/web/avatars/slideshowStyle.css"><script async src="/web/avatars/slideshowScript.js"></script></body></html>'
sed -i "s|${find}|${replace_with}|g" "$indexHtml"

find='id="homeTab" data-index="0">'
replace_with='id="homeTab" data-index="0"><div id="slides-container"></div><script>slidesInit()</script>'
sed -i "s|${find}|${replace_with}|g" "$homeHtml"