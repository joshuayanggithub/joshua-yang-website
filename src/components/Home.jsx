import React from 'react'
import { motion } from "framer-motion";
import {Typed} from 'react-typed'

const Home = () => {
  return (
    <>
        <div id="Home" class="h-screen py-10 px-5 flex flex-col items-center justify-center">
          {/*<h1 class="text-center py-10 px-8 my-3 mx-4 text-black font-pageheader font-bold text-8xl max-w-8xl">About Me</h1>*/}
        
          <motion.div class="absolute left-0 flex-col justify-start"
          animate={{ x: 100 }} 
          transition={{ ease: "easeOut", duration: 0.4 }}
          >

            <motion.h1 class="m-5 p-1 uppercase text-8xl font-apple hover:font-semibold  hover:cursor-pointer ease-out duration-300 text-black" 
              animate={{ x: 100 }} 
              transition={{ ease: "easeOut", duration: 0.4 }}
              >
              Joshua
            </motion.h1>

            <motion.div class="m-5 p-1 uppercase text-8xl  hover:font-semibold  hover:cursor-pointer ease-out duration-300 text-black" animate={{ x: 100 }} >
              Yang
            </motion.div>

          </motion.div>

          <motion.img src="/imgs/MyselfCartoon.png" class="absolute right-0 h-4/5"
            animate={{x:-100}}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.3 },
            }}
          />
          <div class="flex text-5xl font-navheader font-bold text-white uppercase">
          </div>
            {
              /*
              <p>🇨🇳 x 🇺🇸.</p>
              <Typed
                strings = {[' Bay Area Cali. 06er']}
                typeSpeed ={120}
                backSpeed ={180}
                loop
              />
            />*/}

        </div>
    </>
  );
}

export default Home