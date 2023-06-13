//MENU BAR
const menu = document.querySelector("#menu");
const footer = document.querySelector("footer");
const aside = document.querySelector("aside");

const menuOverlay = document.querySelector("#menu-overlay");
// console.log(menu);
menu.addEventListener("mouseover", menuHover);

function menuHover() {
  // console.log("hovered");
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
    footer.classList.add("open");
    aside.classList.add("open");
    opened = true;
  }
  else {
    burger.classList.remove("open");
    footer.classList.remove("open");
    aside.classList.remove("open");
    opened = false;
  }
})

// aside.addEventListener('mousemove', () => {
//   for (let i=0; i<aside.children.length; ++i) {
//     let child = aside.children[i];

//     let link = child.querySelector("a");
//     let img = child.querySelector("img");

//     // console.log(img);
//     let hovered = false;

//     link.addEventListener('mouseover', () => {
//         hovered = true;
//         console.log(hovered);

//         if (hovered) {
//           img.classList.add("hovered");
//           console.log("fdasf");
//         }
//     });

   
//   }
// })