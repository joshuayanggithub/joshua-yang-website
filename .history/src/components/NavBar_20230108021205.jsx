import React from "react";
import {AiOutlineMenu,AiOutlineClose} from 'react-icons/ai'
import Button from './Button'

const NavBar = () => {
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

      <div class="fixed left-0 top-0 w-[40%] h-full border-r border-r-gray-600">
        <ul class="pt-20">
            {
              links.map((link) => 
                <li key={link.id} class="p-4">
                  <a href='#About' class="text-3xl text-white p-5 hover:bg-sasnavyblue hover:font-bold duration-300 uppercase font-navheader">{link.name}</a>
                </li>
              )
            }
          </ul>
        </div>
    </div>
  );
};

export default NavBar;