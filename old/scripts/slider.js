// const slider = document.querySelector(".slider");
// const sliderContainers = document.querySelectorAll(".slider-image-container");
// const images = document.querySelectorAll(".slider-image");

// let arrowleft = document.querySelector(".arrow.left");
// let arrowright = document.querySelector(".arrow.right");

// // let v = document.querySelectorAll('video');
// // v.addEventListener('mouseover', function() { this.controls = true; }, false);
// // v.addEventListener('mouseout', function() { this.controls = false; }, false);
// for (const video of document.querySelectorAll('video')) {
//     console.log(video);
//     video.addEventListener("mouseover", function() {
//         console.log("dfasf");
//         this.play();
//     });
    
//     video.addEventListener("mouseleave", function() {
//         this.pause();
//     });
// }

// slider.addEventListener("wheel", (event) => {
//     event.preventDefault();
//     if (Math.abs(event.deltaY) > Math.abs(event.deltaX) ) {
//         slider.scrollLeft += event.deltaY;
//     }
//     else {
//         slider.scrollLeft += event.deltaX;
//     }
// });


// slider.addEventListener("scroll", function() {
//   let scrollXPercent = slider.scrollLeft / (slider.scrollWidth - window.innerWidth);
// //   console.log(scrollXPercent);

//   //calculate the maximum possible width you can scroll before the object position reaches max
//   let w = slider.getElementsByClassName("slider-image")[0].offsetWidth;
//   let originalWidth = slider.getElementsByClassName("slider-image")[0].naturalWidth;
//   let scaledOriginalWidth = originalWidth * (slider.getElementsByClassName("slider-image")[0].height / slider.getElementsByClassName("slider-image")[0].naturalHeight);
//   console.log(originalWidth, scaledOriginalWidth);
  

//   for (img of slider.getElementsByClassName("slider-image")) {
//     let originalWidth = img.naturalWidth;
//     let scaledOriginalWidth = originalWidth * (img.height / img.naturalHeight);

//     let maxDisplacement = Math.max(0, scaledOriginalWidth - img.width);
//     console.log(maxDisplacement);
    

//     img.animate({
//     objectPosition: `-${scrollXPercent*maxDisplacement}px 50%`
//     }, { duration: 1200, fill: "forwards" });

//     // img.animate({
//     //   transform: 'skew(-5deg)'
//     // }, { duration: 1000, fill: "forwards" });
//   }
// });

// // window.addEventListener("pointermove", function(e) {
// //   let x = e.clientX;
// //   let y = e.clientY;
// //   const mouseTrailer = document.querySelector(".mouse-trailer");
// //   mouseTrailer.animate({
// //     left: `${x}px`,
// //     top: `${y}px`
// //   }, { duration: 900, fill: "forwards" });
// // });



// sliderContainers.forEach((img, index) => {
//     img.style["left"] =  `${45*(index)}vmin`;

//     let imageClick = gsap.timeline({
//         paused: true,
//     });
    
//     imageClick.set(img,
//         {
//             zIndex: 100,
//         });
//     imageClick.to(img,
//         // {
//         //     xPercent: '0',
//         //     yPercent: '-50',
//         // },
//         {
//         position: 'fixed',
//         height: '80%',
//         width: '50%',
//         top: '50%',
//         left: '50%',
//         // transform: 'translate(-50%,-50%)', replacement is xPercent!
//         xPercent: '-50',
//         yPercent: '-50',
//         duration: 0.3,
//     });
//     // imageClick.to(":not(.clicked).slider-image:not(.clicked)", {
//     //     opacity: 0,
//     //     duration: 0.1,
//     // },
//     // // "<"
//     // );
//     imageClick.to(".arrow", {
//         opacity: 1,
//         duration: 0.5,
//     },
//     "<"
//     ); 


//     img.addEventListener("click", function () {

        
//         let imgContainer = img.parentElement;

//         if (img.classList.length > 1) {
//             console.log("removed");
//             for (let img of images) {
//                 img.classList.remove("clicked");
//             }
//             imageClick.reverse();

//             // let imageAppear = gsap.timeline();

//             // imageAppear.to(".slider-image:not(.clicked)", {
//             //         opacity: 1,
//             //         duration: 0.1,
//             //     },
//             //     // "<"
//             //     );
//         }
//         else {
//             for (let img of images) {
//                 img.classList.remove("clicked");
//             }
//             img.classList.add("clicked");
            
//             // console.log(document.querySelectorAll(".slider-image:not(.clicked)"));
//             // console.log(document.querySelectorAll(".slider-image.clicked"));
//             imageClick.play();

//             // let imageRemove = gsap.timeline();

//             // imageRemove.to(".slider-image:not(.clicked)", {
//             //         opacity: 0,
//             //         duration: 0.1,
//             //     },
//             //     // "<"
//             //     );

//             // img.style["opacity"] = 1;

//         }

//     });
// });

// arrowleft.addEventListener("click", function() {

// });