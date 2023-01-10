import React from 'react'
import Typed from 'react-typed'

const Home = () => {
  return (
    <>
      <div class="h-screen py-10 px-5 flex flex-col items-center justify-center" style={{backgroundImage: "url(/imgs/Sunset3.jpg)",  height: '100vh', width: "100vw", backgroundRepeat: "no-repeat",  backgroundPosition: 'left', backgroundSize: 'cover',}}>
        {/*<h1 class="text-center py-10 px-8 my-3 mx-4 text-black font-pageheader font-bold text-8xl max-w-8xl">About Me</h1>*/}
        <p class="text-5xl text-center p-5 m-20 mx-52 justify-between indent-10 text-black text-xl font-pageheader font-extrabold " >Hello! Welcome to My Website! </p>
        <div class="flex text-5xl font-navheader uppercase">
          <p>🇨🇳 x 🇺🇸.</p>
          <Typed
            strings = {[' Bay Area Cali. 06er']}
            typeSpeed ={120}
            backSpeed ={180}
            loop
          />
        </div>
      </div>
    </>
  );
}

export default Home