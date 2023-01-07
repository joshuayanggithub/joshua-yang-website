import React from "react";
import {AiOutlineMenu} from 'react-icons/ai'

const NavBar = () => {
  const links = [
    {'id': 1, 'name': 'About Me'},
    {'id': 2, 'name': 'Projects'}, 
    {'id': 3, 'name': 'My Setup'},
    {'id': 4, 'name': 'Contacts'}
  ]

  return (
    <>
    <nav class="bg-blue-400">
      <ul class="">
        {
          links.map((links) => 
            <li>
              <a href='#About' class="flex text-white">{links.name}</a>
            </li>
          )
          }
      </ul>
    </nav>
    </>
  );
};

export default NavBar;