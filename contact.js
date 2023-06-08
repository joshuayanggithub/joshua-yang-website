
let finger = document.querySelector("#finger");

let headerheight = document.querySelector("h2").clientHeight;
console.log(headerheight);
finger.style["height"] = headerheight*0.7 + "px";

window.addEventListener('resize', function() {
  let headerheight = document.querySelector("h2").clientHeight;
  console.log(headerheight);
  finger.style["height"] = headerheight*0.8 + "px";
}
);

