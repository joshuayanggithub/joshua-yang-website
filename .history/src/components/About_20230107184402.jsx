import React from 'react'

const About = () => {
  return (
    <div class="h-screen py-10 px-5" style={{backgroundImage: "url(/imgs/snow_background.jpg)",  height: '100vh', width: "100vw", backgroundRepeat: "no-repeat",  backgroundPosition: 'left', backgroundSize: 'cover',}}>
      <h1 class="py-10 px-8 my-3 mx-4 text-black font-pageheader text-5xl max-w-4xl">About Me</h1>
      <p class="py-20  px-8 my-3 mx-4 indent-10 text-black text-xl font-pageheader" >I am 16 years old. From the Bay Area. Learning webdevelopment with React and Tailwind CSS, climbing to specialist in CodeForces, and learning new things on the way. I watch and play soccer for fun amateurly, while stepping foot in the weightroom. </p>
    </div>
  );
}

export default About