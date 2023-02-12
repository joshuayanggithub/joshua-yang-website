import React from "react"; 
import {useParallax,Parallax } from 'react-scroll-parallax';
import { motion } from "framer-motion";
import { useState } from "react";

const About = () => {
  const hiddenMask = 'repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)';
  const visibleMask = 'repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)';
  const [inView, setInView] = useState(false);

  return  (
    <>
        <motion.div class="flex justify-center my-40"
          initial = {false}
          animate={
            inView
              ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
              : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
          }
          transition={{ duration: 0.9, delay: 0.5 }}
          onViewportEnter={() => setInView(true)}
          onViewportLeave={() => setInView(false)}
        >
          <img src="/imgs/sunset3.jpg" class = "w-11/12 "/>
        </motion.div>

        <div id="About" class = "flex">

          <div class="left-0 flex-col">
            <motion.h1 class="p-1 m-4 uppercase text-8xl font-bold font-fancyheader"
            whileInView={{x:100}}
            > 
              About
            </motion.h1>

            <motion.h1 class="m-4 uppercase text-8xl font-bold font-fancyheader" 
            whileInView={{x:100}}> 
              Me
            </motion.h1>
          </div> 

          <div class="flex-row">
            <motion.p class="text-black text-xl font-normalheader" 
            whileInView={{x:100}}
            >
            
            I am 16 years old and from the Bay Area. In my free time I learn coding, math, and other such activities. Outside, I like biking, soccer, and other new activities. 
            
            </motion.p>

            <img src="/imgs/bike_bridge.jpg" class="w-2/3" />
          </div>



        </div>
    </>
  )
}

export default About