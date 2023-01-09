import React, {useState} from "react";
import {AiOutlineMenu,AiOutlineClose} from 'react-icons/ai'
import {BsMailbox2} from 'react-icons/bs'
import { IconContext } from "react-icons"
import Button from './Button'

const NavBar = () => {
  const [nav, setNav] = useState(true) //react hooks!

  const toggleNav = () => {
    setNav(!nav)
  }

  const links = [
    {'id': 1, 'name': 'About'},
    {'id': 2, 'name': 'Projects'}, 
    {'id': 3, 'name': 'Setup'},
    {'id': 4, 'name': 'Links'}
  ]

  const closeButton = (
    <div><AiOutlineClose size={40}/> </div>
  )

  const menuButton = (
    <div class=""><AiOutlineMenu  size={40} ></AiOutlineMenu></div>
  )

  return (
    <div class="fixed w-screen flex-row"> {/*md:flex flex-row w-full justify-between items-center mx-auto */}
      
      <div class="md:flex align-center my-0 mx-auto justify-between items-center w-screen p-5">
        <a href="#About" class="duration-300 font-pageheader text-black hover:font-bold hover:text-gray-500 text-3xl p-5">Joshua Yang.</a>
        {/*rounded-full transition-shadow ease-in-out duration-300 shadow-none hover:shadow-2xl*/}
        <div class="p-5 md:flex gap-8 items-center">
          <ul class="hidden md:flex gap-10">
            {
              links.map((link) => 
                <li key={link.id} class="">
                  <a href='#About' class="text-2xl text-black p-3 hover:font-bold hover:text-gray-500 duration-300 font-navheader">{link.name}</a>
                </li>
              )
            }
          </ul>
          <div class="hidden md:flex ">
            <IconContext.Provider value={{ className: "shared-class", size: 40, fontWeight: "bold", }}> {/*Why do I have to use IconContext to work nvm???*/}
              <>
                <BsMailbox2 /> 
              </>
            </IconContext.Provider>
          </div>
        </div>
      </div>

      <div class = "w-8" onClick={toggleNav}> {/* flex md:hidden*/}
        {nav ? menuButton: closeButton}
      </div>

      <div class={!nav ? 'fixed left-0 top-0 w-[30%] h-full border-r bg-gray-500 bg-opacity-80 border-r-gray-600 ease-in-out duration-500' : "fixed  ease-in-out duration-500 left-[-100%] "}>
        <h1 class="font-pageheader text-5xl font-bold text-black m-10">JY</h1>
        <ul class="p-4">
          {
            links.map((link) => 
              <li key={link.id} class="p-4 border-b border-b-gray-400">
                <a href='#About' class="text-2xl text-black p-3 hover:font-bold hover:text-gray-500 duration-300 font-navheader">{link.name}</a>
              </li>
            )
          }
        </ul>
      </div>

      
    </div>
  );
};

export default NavBar;