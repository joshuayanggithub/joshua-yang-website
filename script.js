//LOADING ANIMATION
const loaderText = document.querySelector(".loader");

createBannerSpans(loaderText)
// animateMergeInGroup(loaderText)

function createBannerSpans(querySelector) {
  const querySelectorContent = querySelector.textContent;
  const splitText = querySelectorContent.split("");
  querySelector.innerHTML = "";

  for (let i=0; i<splitText.length; ++i) {
    let element = document.createElement("span");
    let content = document.createTextNode(splitText[i]);
    element.appendChild(content);
    querySelector.appendChild(element);
  }
}

let index = 0;
const seconds = 100;
const decreasingInterval = []
for (let i=0; i<11; ++i) {
  decreasingInterval.push(seconds + Math.log2((i+1))*seconds );
}
console.log(decreasingInterval);
timer = setInterval(animateFadeInIndividual, seconds, loaderText, 11);

// function animateMergeInGroup(querySelector) {
//   index = 0;
//   const seconds = 50 * Math.log2(index);
//   console.log(seconds);
//   timer = setInterval(animateMergeInIndividual, seconds, querySelector);
// }

function animateFadeInIndividual(querySelector, stopLength) {
  const span = querySelector.querySelectorAll('span')[index];
  console.log(typeof(span));
  console.log(span);
  span.classList.add("fade");
  ++index;
  if (index == stopLength) {
    clearInterval(timer);
    timer = null;
  }
}

function animateMergeInIndividual(querySelector, stopLength) {
  const span = querySelector.querySelectorAll('span')[index];
  console.log(typeof(span));
  console.log(span);
  span.classList.add("merged");
  ++index;
  if (index == stopLength) {
    clearInterval(timer);
    timer = null;
  }
}

function removeLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.remove()
}

setTimeout(removeLoader, 1500);
setTimeout(animateBody, 1500);

//After Initial Load-In

const logo = document.querySelector(".logo");
const title = document.querySelector(".title");
const navBar = document.querySelector(".menu");

function animateBody() {
  index = 0;
  createBannerSpans(title);
  console.log(title);
  timer = setInterval(animateMergeInIndividual, 20, title, 11);

}

window.addEventListener('scroll',trackScroll);

function trackScroll() {
  let documentHeight = document.documentElement.scrollHeight; //total document height
  let documentWidth = document.documentElement.scrollWidth; 

  let vpHeight = window.innerHeight; //viewport height
  let vpWidth = window.innerHeight; //viewport width

  let elementHeight = document.querySelector('.scroll-tracker').offsetHeight; //element height
  let elementWidth = document.querySelector('.scroll-tracker').offsetWidth; //element width

  let curY = window.scrollY; //only gets top of vp height so we get offset

  console.log(curY + " " + (vpHeight) + " " + documentHeight);
  let percentScrolled = ((curY/(documentHeight-vpHeight)));

  let pixelScrolledVertical = percentScrolled*vpHeight;
  let pixelScrolledVerticalMax = vpHeight - elementHeight; //so I can still see the bottom of the tracker

  let finalTrackerHeight = Math.min(pixelScrolledVertical,pixelScrolledVerticalMax);

  console.log(finalTrackerHeight);
  document.querySelectorAll('.scroll-tracker')[0].style["top"] = finalTrackerHeight + "px";
  document.querySelectorAll('.scroll-tracker')[1].style["left"] = finalTrackValue + "px";
  document.querySelectorAll('.scroll-tracker')[2].style["top"] = finalTrackerHeight + "px";

}