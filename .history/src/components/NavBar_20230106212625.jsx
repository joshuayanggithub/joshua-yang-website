import React from "react";

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
    <ul>
      {
        links.map(item = () => 
          <li>
            <a href='#' class="text-white text-center"></a>
          </li>
        )
        }
    </ul>
  </nav>
  </>
);
};

export default NavBar;