const slider = document.querySelector(".slider");
const sliderContainers = document.querySelector(".slider-image-containers");
const images = document.querySelectorAll(".slider-image");

slider.addEventListener("scroll", function() {

  let scrollXPercent = slider.scrollLeft / (slider.scrollWidth - window.innerWidth);
  console.log(scrollXPercent);

  let w = slider.getElementsByClassName("slider-image")[0].offsetWidth;
  console.log(w);

  for (img of slider.getElementsByClassName("slider-image")) {
    img.animate({
    objectPosition: `-${scrollXPercent*w/3}px 50%`
    }, { duration: 1200, fill: "forwards" });

    // img.animate({
    //   transform: 'skew(-5deg)'
    // }, { duration: 1000, fill: "forwards" });
  }
});

// window.addEventListener("pointermove", function(e) {
//   let x = e.clientX;
//   let y = e.clientY;
//   const mouseTrailer = document.querySelector(".mouse-trailer");
//   mouseTrailer.animate({
//     left: `${x}px`,
//     top: `${y}px`
//   }, { duration: 900, fill: "forwards" });

// });

// for (let img of images) {
//   console.log(img);
//   img.addEventListener("click", function () {
//   let imgContainer = img.parentElement;
//   console.log(imgContainer);
//     console.log(img.classList);
//     if (img.classList.length > 1) {
//       for (let img of images) {
//         img.classList.remove("clicked");
//         img.parentElement.classList.remove("clicked");
//       }
//       img.classList.remove("clicked");
//       imgContainer.classList.remove("clicked");
//       sliderContainers.classList.remove("clicked");
//     }
//     else {
//       for (let img of images) {
//         img.classList.remove("clicked");
//         img.parentElement.classList.remove("clicked");
        
//       }
//       console.log(img);
//       img.classList.add("clicked");
//       imgContainer.classList.add("clicked");
//       sliderContainers.classList.add("clicked");

//       setTimeout(img.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//         inline: 'center'
//        }),800);
//     }
//   });
// }
