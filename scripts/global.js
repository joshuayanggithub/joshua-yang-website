window.addEventListener("load", onLoad, false);
//MOUSE TRACKER
window.onpointermove = (event) => {
  let x = event.clientX;
  let y = event.clientY;

  console.log(x + " " + y);

  let mouseTrailer = document.querySelector("#mouse-trailer");
  // mouseTrailer.style["left"] = x + "px";
  // mouseTrailer.style["top"] = y + "px";

  mouseTrailer.animate(
    {
      left: `${x}px`,
      top: `${y}px`,
    },
    { duration: 1400, fill: "forwards" }
  );
};
function onLoad() {
  //MENU BAR
  const menu = document.querySelector("#menu");
  const footer = document.querySelector("footer");
  const aside = document.querySelector("aside");

  const burger = document.querySelector(".hamburger");
  let opened = false;

  let myFunc = () => {
    console.log("Done");
  };

  const menuOpenClose = gsap.timeline({
    paused: true,
    onComplete: myFunc,
  });

  menuOpenClose.to(aside, {
    height: "100%",
    duration: 0.5,
  });
  menuOpenClose.from(".menu-column a", {
    yPercent: "100",
    // ease: CustomEase.create("easeName", "0.86,0.13,0.404,0.773"),
    ease: Expo.easeInOut,
    duration: "1.2",
    stagger: "0.1",
  });

  burger.addEventListener("click", () => {
    if (!opened) {
      burger.classList.add("open");
      // // footer.classList.add("open");
      // aside.classList.add("open");
      opened = true;
      menuOpenClose.play();
    } else {
      burger.classList.remove("open");
      // footer.classList.remove("open");
      // aside.classList.remove("open");
      opened = false;
      menuOpenClose.reverse();
    }
  });
}
