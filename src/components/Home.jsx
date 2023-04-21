import React from 'react'
import { motion } from "framer-motion";

const landingPageSentences= [
  {sentence: "Hi There!", id:1},
  {sentence: "I Am Joshua Yang.", id:2},
  {sentence: "From The Bay.", id:3},
  {sentence: "Born and Raised", id:4},
  {sentence: "2006 AAPI CO'24", id:5}
];

const AnimatedLetters = ({line}) => {
  const loaded = Array.from(line);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.06, delayChildren: 0.04, ease: "easeIn"
      },
    },
  };
  
  const child = {
    visible: {
      opacity: 1,
      y:0,
    },
    hidden: {
      opacity: 0,
      y:200,
    },
  };

  return (
    <motion.div
      class="flex text-[16vh] py-0 my-0 font-fancyheader"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {loaded.map( (char, charInd) => 
        <motion.div
          class="mr-0.5 p-0 my-0 inline-block leading-none "
          variants={child}
          key={charInd}
        >
          {char == " " ? "\u00A0" : char}
        </motion.div>
      )}
    </motion.div>
  )
}

const Home = () => {

  return (
    <>
      <div id="Home" class="z-10 h-screen flex flex-row items-center bg-gray-100 gap-36">
        <div class="w-1/2">
          {landingPageSentences.map((obj) => (
            <AnimatedLetters key={obj.id} line={obj.sentence}/>
          ))}
        </div>  
        
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