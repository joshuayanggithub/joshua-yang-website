//LOADING ANIMATION
const loaderText = document.querySelector(".loader");

// //Start Initial Loader Screen
document.querySelector("main").style["display"] = "none";

const svgLoadingText = document.querySelectorAll("#svg-loading-text>path"); //the mask in svg is annoying
for (let i=0; i<svgLoadingText.length; ++i) {
  // console.log(svgLoadingText[i].getTotalLength());
  let length = svgLoadingText[i].getTotalLength();
  svgLoadingText[i].style["stroke-dasharray"] = length;
  svgLoadingText[i].style["stroke-dashoffset"] = length;
  // svgLoadingText[i].classList.add("draw");
  svgLoadingText[i].style["animation"] = "draw-letters 2s linear forwards";
  svgLoadingText[i].addEventListener("animationend", listener, false);
}

//fill in white - for some reason, also need to make svg mask element white for this shi to work
const animationDone = document.querySelector("#svg-loading-text>path");
animationDone.addEventListener("animationend", listener, false);

function listener(event) {
  document.querySelector("#svg-loading-text mask").style["fill"] = "white";
}

//finish loading screen and animate body
setTimeout(FinishLoader, 0);

function FinishLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.remove();
  document.querySelector("main").style["display"] = "initial";
}

//IMPORTANT ANIMATION FUNCTIONS FOR MODULARITY
function createBannerSpans(querySelector) { //convert h1 or text container to inline elements
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

function animateMergeIn(querySelector, stopLength, elementType) {
  const seconds = 100;
  timer = setInterval(animateMergeInIndividual, seconds, querySelector, stopLength, elementType);
  return;
}

function animateMergeInIndividual(querySelector, stopLength, elementType) {
  const element = querySelector.querySelectorAll(elementType + ":not(.merged)")[0]; //thank god to not selectors, select all non merged
  if (element == null) {
    console.log("Animated Merge Group Finished");
    clearInterval(timer);
    timer = null;
    return;
  }
  element.classList.add("merged");
}
//END OF ANIMATIONS

//LOAD IN BODY
setTimeout(animateBody, 0);

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


