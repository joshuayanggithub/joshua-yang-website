import React, { } from "react"; 
import { motion, useScroll, useTransform} from "framer-motion";
import { useState } from "react";

const About = () => {
  const hiddenMask = 'repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)';
  const visibleMask = 'repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)';
  const [inView, setInView] = useState(false);

  let { scrollYProgress } = useScroll();
  const aboutSize = useTransform(scrollYProgress, [0.3,0.6,0.6,1], [7,0,0,0]);

  const slides = [
    {path: "/imgs/skiday.jpg", location: "Lake Tahoe.", date: "Dec. 2022", id:1},
    /*{path: "/imgs/Sunset1.jpg", location: "Tassajara.", date: "Oct. 2021", id:2},
    {path: "/imgs/soccer_fallon.jpg", location: "Dublin.", date: "Jan. 2023", id:3},*/
  ];

  return  (
    <>
        <div id="About" class = "bg-gray-100 ">
          <div class="flex justify-center items-center min-h-screen font-normalheader uppercase text-center text-4xl">
            <motion.div 
              class=""
              style={{ scale: aboutSize }} 
            >
              About Me.
            </motion.div>
          </div>

          <motion.div class="flex flex-row min-w-full"
          >
            
            {slides.map( (image) => (
              <motion.div class="h-full w-full flex flex-col items-center justify-center"
                initial = {false}
                animate={
                  inView
                    ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                    : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
                }
                transition={{ duration: 0.5, delay: 0.6 }}
                onViewportEnter={() => setInView(true)}
                onViewportLeave={() => setInView(false)}
              >

                <motion.div class="flex flex-col items-center justify-center w-11/2"
                  animate={{
                  }}>

                  <img src={image.path} alt={image.location} class = "my-50 w-11/12"/>
                  <div class="uppercase w-11/12 my-3 flex flex-row justify-between text-3xl">
                    <span>{ image.location }</span>
                    <span> {image.date}</span>
                  </div> 

                </motion.div>

              </motion.div>
            ))}

          </motion.div> 

        </div>
    </>
  )
}

export default About