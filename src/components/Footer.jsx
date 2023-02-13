import React from "react";
import {AiFillGithub} from 'react-icons/ai'
import {SiCodeforces, SiSpotify} from 'react-icons/si'

const Footer = () => {
  const iconSize = 25;

  return (<>
    <div id="Footer" class="bg-gray-100 pt-20 pb-5 grid place-items-center">
      <div class="w-11/12 flex flex-row justify-between items-center">
        <div class="text-xs m-[1/12] inline-block">©2022-2023 Licensed By Joshua Yang</div>
        <div class="flex flex-row gap-10 ">
          <a class="hover:text-gray-500" href="https://github.com/joshuayanggithub">
              <AiFillGithub size={iconSize}/>
          </a>
          <a class="hover:text-gray-500" href="https://codeforces.com/profile/JoshuaYang">
            <SiCodeforces size={iconSize} />
          </a>

          <a class="hover:text-gray-500" href="https://open.spotify.com/user/jjz133?si=cbdf4b34ebd14042">
            <SiSpotify size={iconSize} />
          </a>
        </div>
      </div>
  </div>
  </>)
}

export default Footer;