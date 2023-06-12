//MENU BAR
const menu = document.querySelector("#menu");
const menuOverlay = document.querySelector("#menu-overlay");
// console.log(menu);
menu.addEventListener("mouseover", menuHover);

function menuHover() {
  console.log("hovered");
  if (menuOverlay.classList.length > 1) {
    menuOverlay.classList.remove("show");
  }
  else {
    menuOverlay.classList.add("show");
  }
}

const burger = document.querySelector(".hamburger");
let opened = false;

burger.addEventListener('click', () => {
  if (!opened) {
    burger.classList.add("open");
    opened = true;
  }
  else {
    burger.classList.remove("open");
    opened = false;
  }
})