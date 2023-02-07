import React from 'react'

const Goals = () => {
  return (
    <div id="Goals" class="my-4 scroll-smooth">
      <p class="indent-10 text-gray-600 text-xl">
      </p>
      {/* <h1 class="text-black text-4xl font-pageheader">Goals</h1> */}
      <div class="bg-gray-50 min-h-screen flex items-center justify-center px-16">
        <div class="flex-col">
          <h1 class="text-center text-black text-4xl font-pageheader">Goals</h1>
          <img src="/imgs/bike_bridge.jpg" class = " h-1/5 w-2/3"/>
        </div>
        <div class="relative w-full max-w-lg">
          <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob "></div>
          <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div class="absolute -bottom-32 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div class="m-8 relative space-y-4">
            <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              Learning more about the web. 
            </div>
            <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              Learning new algorithmic concepts TCS, familiarizing with what I know, consolidating and honing skills of problem solving through consistent practice.
            </div>
            <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              Learning to disregard other's opinions, and do myself. Learning to control myself out of boundaries. 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goals