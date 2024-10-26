#!/bin/bash
echo "========================================="
echo "THIS SCRIPT IS JUST TO INSTALL ON LINUX DEFAULT WEBROOT 10.9.11 AND HAS NOT BEEN TESTED ON OTHER VERSIONS DO NOT RUN ON ANY OTHER VERSION UNLESS YOU WANT ZERO SUPPORT FOR NOT READING THIS VERY BASIC WARNING"
echo "========================================="
echo ""
echo "THIS IS THE DEFAULT WEBROOT LINUX VERSION"
echo ""
echo "========================================="
echo ""
echo "you have now got 30 seconds to exit if you are NOT sure you want to continue TO EXIT PRESS CTRL+C NOW"
sleep 1
echo "29"
sleep 1
echo "28" 
sleep 1 
echo "27"
sleep 1
echo "26"
sleep 1
echo "25"
sleep 1
echo "24"
sleep 1
echo "23"
sleep 1
echo "22"
sleep 1
echo "21"
sleep 1
echo "20"
sleep 1
echo "19"
sleep 1
echo "18"
sleep 1
echo "17"
sleep 1
echo "16"
sleep 1
echo "15"
sleep 1
echo "14"
sleep 1
echo "13"
sleep 1
echo "12"
sleep 1
echo "11"
sleep 1
echo "10"
sleep 1
echo "09"
sleep 1
echo "08"
sleep 1
echo "07"
sleep 1
echo "06"
sleep 1
echo "05"
sleep 1
echo "04"
sleep 1
echo "03"
sleep 1
echo "02"
sleep 1
echo "01"
sleep 1
echo "Installing BOBSFLAVOUREDBAR version of jellyfin-featured maintained and made awesome by BobHasNoSoul"
base_dir="/usr/share/jellyfin/web"
avatars_dir="$base_dir/avatars"
declare -A files=(
    ["$base_dir/home-html.8ce38bc7d6dc073656d4.chunk.js"]="https://raw.githubusercontent.com/BobHasNoSoul/jellyfin-featured/refs/heads/main/BobFlavouredBar/home-html.8ce38bc7d6dc073656d4.chunk.js"
    ["$base_dir/index.html"]="https://raw.githubusercontent.com/BobHasNoSoul/jellyfin-featured/refs/heads/main/BobFlavouredBar/index.html"
    ["$avatars_dir/slideshowpure.js"]="https://raw.githubusercontent.com/BobHasNoSoul/jellyfin-featured/refs/heads/main/BobFlavouredBar/avatars/slideshowpure.js"
    ["$avatars_dir/custom.css"]="https://raw.githubusercontent.com/BobHasNoSoul/jellyfin-featured/refs/heads/main/BobFlavouredBar/avatars/custom.css"
)
mkdir -p "$avatars_dir"
backup_file() {
    local file_path="$1"
    if [[ -f "$file_path" ]]; then
        local backup_path="${file_path}.$(date +'%Y%m%d_%H%M%S').bak"
        echo "Creating backup for $file_path at $backup_path"
        cp "$file_path" "$backup_path"
    fi
}
for target_path in "${!files[@]}"; do
    url="${files[$target_path]}"
    
    # Backup the original file if it exists
    backup_file "$target_path"
    
    # Download the file
    echo "Downloading $url to $target_path"
    curl -L -o "$target_path" "$url"
done
echo "All files have been downloaded successfully with backups created as needed."
echo "BOBSFLAVOUREDBAR HAS BEEN INSTALLED simply reload your client cache and you will be all set."



