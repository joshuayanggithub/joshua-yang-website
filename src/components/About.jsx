import React from "react"; 
import { motion } from "framer-motion";
import { useState } from "react";

const About = () => {
  const hiddenMask = 'repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)';
  const visibleMask = 'repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)';
  const [inView, setInView] = useState(false);

  return  (
    <>
        <div id="About" class = "h-full bg-gray-100">
          <motion.div class="flex flex-col items-center justify-center"
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
            <div class="flex flex-col items-center justify-center">
              <img src="/imgs/skiday.jpg" class = "w-11/12 "/>
              <div class="uppercase w-11/12 my-3 flex flex-row justify-between">
                <span> Lake Tahoe.</span>
                <span> Dec. 2022</span>
              </div> 
            </div>
          </motion.div>
        </div>
    </>
  )
}

export default About