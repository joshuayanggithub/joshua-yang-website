//SCROLL BOX
window.addEventListener('scroll',trackScroll);

function trackScroll() {
  let sections =document.querySelectorAll(".skill");
  // console.log(sections);

  let topSectionHeight = sections[0].getBoundingClientRect().top;
  let bottomSectionHeight = sections[sections.length-1].getBoundingClientRect().top; //viewport width

  let totalDist = bottomSectionHeight - topSectionHeight;
  // console.log(topSectionHeight);
  // console.log(bottomSectionHeight);

  // topSectionHeight = Math.max(0,topSectionHeight);
  // bottomSectionHeight = Math.max(0, bottomSectionHeight); 

  // console.log(topSectionHeight);
  // console.log(bottomSectionHeight);

  if (topSectionHeight <=0 && bottomSectionHeight >= 0) {
    let pixelScrolled = Math.abs(topSectionHeight);
    let percentScrolled = pixelScrolled/totalDist*100;

    console.log(percentScrolled);

    let progressBox = document.querySelector(".progress-box");
    

    progressBox.animate({
      left: `${percentScrolled}%`,
    }, { duration: 1400, fill: "forwards" });

  }

}