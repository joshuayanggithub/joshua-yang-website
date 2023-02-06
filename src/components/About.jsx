import React from "react"; 
import { ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax';

const About = () => {
  return  (
    <div class = "my-10 p-20 bg-slate-600" style={{backgroundImage: "url(/imgs/snow_background.jpg)",  height: '100vh', width: "100vw", backgroundRepeat: "no-repeat",  backgroundPosition: 'left', backgroundSize: 'cover',}}>
      <p class="py-40 justify-between px-8 m-20 my-30 indent-10 text-black text-xl font-pageheader font-extrabold" >I am 16 years old and from the Bay Area. In my free time I learn coding, math, and other such activities. Outside, I like biking, soccer, and other new activities. I strive to try new things, balance ECs, while maintaining good grades. </p>
    </div>
  );
}

export default About