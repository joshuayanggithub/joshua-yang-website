window.addEventListener('load', onLoad, false);

function onLoad() {

//MENU BAR
const menu = document.querySelector("#menu");
const footer = document.querySelector("footer");
const aside = document.querySelector("aside");

const burger = document.querySelector(".hamburger");
let opened = false;

let myFunc = () => {
    console.log("Done");
}

const menuOpenClose = gsap.timeline(
    {
        paused: true,
        onComplete: myFunc,
    }
);

menuOpenClose.from(aside,
    {
        height: '0%',
        duration: 0.5,
    }
);
menuOpenClose.from(
    ".menu-column a", 
{
    yPercent: '100',
    // ease: CustomEase.create("easeName", "0.86,0.13,0.404,0.773"),
    ease: Expo.easeInOut,
    duration: '1.2',
    stagger: '0.1',
}
)

burger.addEventListener('click', () => {
  if (!opened) {
    burger.classList.add("open");
    // // footer.classList.add("open");
    // aside.classList.add("open");
    opened = true;
    menuOpenClose.play();
  }
  else {
    burger.classList.remove("open");
    // footer.classList.remove("open");
    // aside.classList.remove("open");
    opened = false;
    menuOpenClose.reverse();
  }
})

};