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
const seconds = 30;
const decreasingInterval = []
for (let i=0; i<11; ++i) {
  decreasingInterval.push(seconds + Math.log2((i+1))*seconds );
}
console.log(decreasingInterval);
timer = setInterval(animateMergeInIndividual, 20, loaderText);

// function animateMergeInGroup(querySelector) {
//   index = 0;
//   const seconds = 50 * Math.log2(index);
//   console.log(seconds);
//   timer = setInterval(animateMergeInIndividual, seconds, querySelector);
// }

function animateMergeInIndividual(querySelector) {
  const span = querySelector.querySelectorAll('span')[index];
  console.log(typeof(span));
  console.log(span);
  span.classList.add("fade");
  ++index;
  if (index == 11) {
    clearInterval(timer);
    timer = null;
  }
}

function removeLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.remove()
}

setTimeout(removeLoader, 1500);

//After Initial Load-In

const logo = document.querySelector(".logo");
const title = document.querySelector(".title");


window.addEventListener('scroll',trackScroll);

function trackScroll() {
  let documentHeight = document.documentElement.scrollHeight; //total document height
  let vpOffset = window.innerHeight; //viewport height
  let elementOffset = document.querySelector('.scroll-tracker').offsetHeight; //element height
  let curY = window.scrollY; //only gets top of vp height so we get offset

  // console.log(curY + " " + (vpOffset) + " " + documentHeight);
  let percentScroll = ((curY/(documentHeight-vpOffset)));
  let pixelScroll = percentScroll*vpOffset;
  let pixelScrollMax = vpOffset - elementOffset; //so I can still see the bottom of the tracker
  let finalTrackValue = Math.min(pixelScroll,pixelScrollMax);
  console.log(finalTrackValue);
  document.querySelector('.scroll-tracker').style["top"] =  finalTrackValue + "px";
}