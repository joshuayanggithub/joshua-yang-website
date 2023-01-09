import React, {useState} from "react";
import {AiOutlineMenu,AiOutlineClose} from 'react-icons/ai'
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
    <div><AiOutlineClose> size={100}</AiOutlineClose></div>
  )

  const menuButton = (
    <div><AiOutlineMenu> size={100} </AiOutlineMenu></div>
  )

  return (
    <div class="md:flex bg-sasskyblue w-full justify-between items-center h-20 mx-auto px-4">
      
      <div onClick={toggleNav} class="md:hidden">
        {nav ? <AiOutlineMenu> size="50px"</AiOutlineMenu>: null}
      </div>
      <div class={!nav ? 'hidden' : "hidden md:flex items-center justify-between w-9/12"}>
        <h1 class="font-cursive text-5xl font-bold text-blue-200 m-10">Jy.</h1>
        <ul class="hidden md:flex gap-10 ">
          {
            links.map((link) => 
              <li key={link.id} class="">
                <a href='#About' class="text-3xl text-white px-5 hover:bg-sasnavyblue hover:font-bold duration-300 uppercase font-navheader">{link.name}</a>
              </li>
            )
          }
        </ul>
        <Button> Email Me </Button>
      </div>

      <div class={!nav ? 'fixed left-0 top-0 w-[30%] h-full border-r border-r-gray-600 bg-sasnavyblue ease-in duration-1000' : "fixed hidden"}>
        <h1 class="font-cursive text-5xl font-bold text-blue-200 m-10">Jy.</h1>
        <ul class="p-4">
          {
            links.map((link) => 
              <li key={link.id} class="p-4 border-b border-b-gray-400">
                <a href='#About' class="text-2xl text-white p-5 hover:bg-sasnavyblue hover:font-bold duration-300 uppercase font-navheader">{link.name}</a>
              </li>
            )
          }
        </ul>
      </div>

      <div onClick={toggleNav}>
        {nav ? null : closeButton }
      </div>
    </div>
  );
};

export default NavBar;