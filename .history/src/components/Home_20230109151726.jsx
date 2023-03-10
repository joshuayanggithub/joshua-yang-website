import React from 'react'

const Home = () => {
  return (
    <div class="h-screen py-10 px-5 flex items-center" style={{backgroundImage: "url(/imgs/Sunset3.jpg)",  height: '100vh', width: "100vw", backgroundRepeat: "no-repeat",  backgroundPosition: 'left', backgroundSize: 'cover',}}>
      {/*<h1 class="text-center py-10 px-8 my-3 mx-4 text-black font-pageheader font-bold text-8xl max-w-8xl">About Me</h1>*/}
      <p class="py-40 justify-between px-8 my-20 mx-4 indent-10 text-black text-xl font-pageheader font-extrabold text-end" >I am 16 years old. From the Bay Area. Learning webdevelopment with React and Tailwind CSS, climbing to specialist in CodeForces, and learning new things on the way. I watch and play soccer for fun amateurly, while stepping foot in the weightroom. </p>
    </div>
  );
}

export default Home