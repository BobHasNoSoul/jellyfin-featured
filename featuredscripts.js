var countdown=0;function shuffleArray(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}var slides=document.querySelectorAll(".slide"),currentSlide=0,shuffledIndexes=shuffleArray(Array.from({length:slides.length},(e,t)=>t));function showSlide(e){for(var t=0;t<slides.length;t++)slides[t].style.display="none";slides[shuffledIndexes[e]].style.display="block",countdown=10,loadLogo(shuffledIndexes[e])}function loadLogo(e){var t=slides[e],n="/Items/"+t.id.split("_")[1]+"/Images/Logo",o=new Image;o.src=n,o.onload=function(){var e=document.createElement("img");e.className="logo",e.src=n,e.alt="Logo",e.loading="lazy",t.appendChild(e)}}function nextSlide(){showSlide(currentSlide=(currentSlide+1)%slides.length)}function updateTimer(){countdown--,document.querySelector(".timer").innerHTML=countdown,countdown<=0&&nextSlide()}setInterval(updateTimer,1e3),slides.forEach(function(e){e.addEventListener("click",function(){window.location.href=this.getAttribute("href")})}),slides.forEach(function(e){e.setAttribute("tabindex","0"),e.addEventListener("keydown",function(t){13===t.keyCode&&(window.location.href=e.getAttribute("href"))})}),slides.forEach(function(e){e.setAttribute("tabindex","0"),e.setAttribute("aria-label","Slideshow Item")});

// Add event listener for keydown events on slideshow elements
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) { // Enter key
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('slide')) {
            // Simulate click action on the focused slide
            focusedElement.click();
        }
    }
});
// fix the non selecable on tv mode
document.querySelector(".featurediframe").addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        this.contentWindow.location.href = this.src;
    }
});