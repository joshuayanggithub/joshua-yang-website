import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  const loadingPageWords= [
    {sentence: "Joshua", id:1},
    {sentence: "Yang.", id:2},
  ];

  return (
    <>
      <div class= "absolute text-center" 
      >
        {loadingPageWords.map( (word, id) => (
          <motion.span class="mr-5"
            animate = {{x:100}}
            transition ={{duration:1.5}}
          >
          word.sentence
          </motion.span>
        )
        )}
      </div>
    </>
  )
}

export default LoadingScreen