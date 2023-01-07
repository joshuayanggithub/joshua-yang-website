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
    <div class="bg-blue-400">
      <div>
        <AiOutlineMenu size={30}></AiOutlineMenu>
      </div>
      <ul class="inline">
        {
          links.map((links) => 
            <li>
              <a href='#About' class="flex inline text-white">{links.name}</a>
            </li>
          )
        }
      </ul>
    </div>
  );
};

export default NavBar;