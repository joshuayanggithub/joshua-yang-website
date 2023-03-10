import React from 'react'
import { motion } from "framer-motion";

const Home = () => {
  const landingPageSentences= [
    {sentence: "Hi There!", id:1},
    {sentence: "I Am Joshua Yang.", id:2},
    {sentence: "From The Bay.", id:3},
    {sentence: "Born and Raised", id:4},
    {sentence: "2006 AAPI CO'24", id:5}
  ];

  return (
    <>
        <div id="Home" class="z-10 h-screen flex flex-row items-center bg-gray-100 gap-36">

          <motion.div class="w-1/2"
            animate={{ x: 100 }} 
            transition={{ ease: "easeOut", duration: 0.4 }}
            >

            {landingPageSentences.map((phrase, line) => (

              <motion.div class="inline-block"
              >

                {phrase.sentence.split(" ").map( (word, ind) => (
                  <motion.span  
                    class="m-6 p-1 uppercase text-7xl font-normalheader hover:font-semibold  hover:cursor-pointer hover:duration-300 ease-in-out text-black" 
                    key={word.id*7 + ind}
                    initial={{opacity:0,translateX:-100}}
                    animate={{opacity:1, translateX:100}}
                    transition={{
                      duration: 1, 
                      delay:line*0.3+ind*0.2, 
                    }}
                  >
                    {word}
                  </motion.span>
                ))}

              </motion.div>

            ))} 

          </motion.div> 

          <motion.img src="/imgs/MyselfCartoon.png" alt="Me!" class="h-3/4"
            initial={{translateX:100}}
            animate={{translateX:0}}
            whileHover={{
              scale: 1.05,
              transition: { duration: 2, delay: 2 },
            }}
          />

        </div>
    </>
  );
}

export default Home