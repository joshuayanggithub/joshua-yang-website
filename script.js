const loadedText = document.querySelector(".loader").children;
console.log(loadedText);

for (let i=0; i<loadedText.length; ++i) {
  let span = loadedText[i];
  // span.style.animationDelay = i*0.2 + "s";
  span.style.transitionDelay = i*0.2 + "s";
}

const loadedText2 = document.querySelector(".loader").children;
console.log(loadedText2);