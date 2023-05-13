const slider = document.querySelector(".slider");

slider.addEventListener("scroll", function() {
  // console.log(images.scrollLeft);

  let scrollXPercent = slider.scrollLeft / (slider.scrollWidth - window.innerWidth) * 100;
  // console.log(scrollXPercent);

  for (img of slider.getElementsByClassName("slider-image")) {
    img.animate({
      objectPosition: `${scrollXPercent}% 50%`
    }, { duration: 1200, fill: "forwards" });
  }
});

window.addEventListener("pointermove", function(e) {
  let x = e.clientX;
  let y = e.clientY;

  // console.log(x + " " + y);

  const mouseTrailer = document.querySelector(".mouse-trailer");

  mouseTrailer.animate({
    left: `${x}px`,
    top: `${y}px`
  }, { duration: 1400, fill: "forwards" });

});


const images = document.querySelectorAll(".slider-image");

for (let img of images) {
  console.log(img);
  img.addEventListener("click", function () {
    console.log(img.classList);
    if (img.classList.length > 1) {
      img.classList.remove("clicked");
      console.log("dfsa");
    }
    else {
      img.classList.add("clicked");
      console.log("fdsaf");
    }
  });
}
