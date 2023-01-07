import React from "react";
import {AiOutlineMenu} from 'react-icons/ai'

const NavBar = () => {
  const links = [
    {'id': 1, 'name': 'About'},
    {'id': 2, 'name': 'Projects'}, 
    {'id': 3, 'name': 'Setup'},
    {'id': 4, 'name': 'Contacts'}
  ]

  return (
    <div class="flex bg-blue-300 items-center">
      <div>
        <AiOutlineMenu size={30}></AiOutlineMenu>
      </div>

      <ul class="flex">
        {
          links.map((links) => 
            <li>
              <a href='#About' class="text-3xl flex text-white px-5">{links.name}</a>
            </li>
          )
        }
      </ul>

      <div class="left-0 bg-blue-800 h-screen">

      </div>
    </div>
  );
};

export default NavBar;