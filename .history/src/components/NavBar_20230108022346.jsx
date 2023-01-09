import React, {useState} from "react";
import {AiOutlineMenu,AiOutlineClose} from 'react-icons/ai'
import Button from './Button'

const NavBar = () => {
  const [nav, setNav] = useState(false) //react hooks!

  const toggleNav = () => {
    
  }

  const links = [
    {'id': 1, 'name': 'About'},
    {'id': 2, 'name': 'Projects'}, 
    {'id': 3, 'name': 'Setup'},
    {'id': 4, 'name': 'Links'}
  ]

  return (
    <div class="md:flex bg-sasskyblue w-full justify-between items-center h-20 mx-auto px-4">
      <div>
        <AiOutlineMenu size={50}></AiOutlineMenu>
      </div>

      <div class="hidden">
        <ul class="md:flex">
          {
            links.map((link) => 
              <li key={link.id}>
                <a href='#About' class="text-3xl text-white px-5 hover:bg-sasnavyblue hover:font-bold duration-300 uppercase font-navheader">{link.name}</a>
              </li>
            )
          }
        </ul>
        <Button> Email Me </Button>
      </div>

      <div class="fixed left-0 top-0 w-[30%] h-full border-r border-r-gray-600 bg-sasnavyblue">
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
    </div>
  );
};

export default NavBar;