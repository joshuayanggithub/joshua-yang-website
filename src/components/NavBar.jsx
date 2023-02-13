import React, {useState} from "react";
import {AiOutlineMenu,AiOutlineClose} from 'react-icons/ai'
import {BsMailbox2} from 'react-icons/bs'
import { motion, useScroll} from "framer-motion";

const NavBar = () => {
  const [nav, setNav] = useState(true) //react hooks!

  const toggleNav = () => {
    setNav(!nav)
  }

  const links = [
    {'id': 1, 'name': 'About'},
    {'id': 2, 'name': 'Goals'}, 
    {'id': 3, 'name': 'Dev'},
    {'id': 4, 'name': 'Links'}
  ]

  const closeButton = (
    <div class="hover:text-bold hover:text-gray-300"><AiOutlineClose size={40}/> </div>
  )

  const menuButton = (
    <div class="hover:text-bold hover:text-gray-300"><AiOutlineMenu  size={40} /></div>
  )

  const { scrollYProgress } = useScroll();

  return (
    <div class="fixed w-full flex items-center">

      <motion.div class="fixed origin-top-left top-0 left-0 right-0 h-2 bg-black" style={{ scaleX: scrollYProgress }} />  


      <div class="md:flex mx-auto justify-between items-center w-full p-5">
        
        <a href="#Home" class="align-center duration-300 font-fancyheader text-black hover:font-bold hover:text-gray-200 text-3xl m-3">Joshua Yang.</a>

        <div class="md:flex gap-6 items-center">
          <ul class="hidden md:flex gap-10">
            {
              links.map((link) => 
                <li key={link.id} class="">
                  <a href={'#' + link.name} class="text-2xl text-black hover:font-bold hover:text-gray-200 duration-300 font-normalheader">{link.name}</a>
                </li>
              )
            }
          </ul>

          <a href="mailto: jyangftw@gmail.com">
            <div class="hidden md:flex hover:text-bold hover:text-gray-200">
              <BsMailbox2 size = {40}/>
            </div>
          </a>

        </div>

      </div>

      <div class = "m-4 hover:cursor-pointer" onClick={toggleNav}>
        {/*nav ? menuButton: closeButton*/}
        {menuButton}
      </div>

      <div class={!nav ? 'fixed left-0 top-0 w-full h-full bg-gray-100  ease-in-out duration-500' : "fixed w-full h-full ease-in-out duration-500 left-[-100%] "}>
        <h1 class="font-normalheader text-5xl font-bold text-black m-10">JY</h1>
        <ul class="p-4">
          {
            links.map((link) => 
              <li key={link.id} class="p-4">
                <a href={'#' + link.name} class="text-2xl text-black p-3 hover:font-bold hover:text-gray-500 duration-300 font-normalheader">{link.name}</a>
              </li>
            )
          }
        </ul>
        <div class = {!nav ? "ease-in-out duration-600 fixed top-0 right-0 hover:cursor-pointer": "hidden"} onClick={toggleNav}>
          {closeButton}
        </div>
      </div>

      
    </div>
  );
};

export default NavBar;