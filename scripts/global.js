window.addEventListener('load', onLoad, false);

function onLoad() {

//MENU BAR
const menu = document.querySelector("#menu");
const footer = document.querySelector("footer");
const aside = document.querySelector("aside");

const burger = document.querySelector(".hamburger");
let opened = false;

burger.addEventListener('click', () => {
  if (!opened) {
    burger.classList.add("open");
    // footer.classList.add("open");
    aside.classList.add("open");
    opened = true;
  }
  else {
    burger.classList.remove("open");
    // footer.classList.remove("open");
    aside.classList.remove("open");
    opened = false;
  }
})

};