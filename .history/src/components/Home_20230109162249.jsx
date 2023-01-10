import React from 'react'
import Typed from 'react-typed'

const Home = () => {
  return (
    <>
      <div class="h-screen py-10 px-5 flex items-center justify-center" style={{backgroundImage: "url(/imgs/Sunset3.jpg)",  height: '100vh', width: "100vw", backgroundRepeat: "no-repeat",  backgroundPosition: 'left', backgroundSize: 'cover',}}>
        {/*<h1 class="text-center py-10 px-8 my-3 mx-4 text-black font-pageheader font-bold text-8xl max-w-8xl">About Me</h1>*/}
        <div class="text-5xl font-navheader uppercase">
          <Typed
            strings = {['Bay Area Cali. 06er']}
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