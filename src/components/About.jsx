import React from "react"; 
import {useParallax } from 'react-scroll-parallax';
import { motion } from "framer-motion";

const About = () => {
  return  (
    <>
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