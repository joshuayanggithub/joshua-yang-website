import React from 'react'
import {AiFillGithub} from 'react-icons/ai'
import {SiCodeforces, SiSpotify} from 'react-icons/si'

const Contacts = () => {
  return (
    <div class="mx-5 px-4">
      <h1 class="text-3xl font-pageheader ">Contact Me</h1>
      <div class="flex items-center justify-between">
        <img src="/imgs/soccer_fallon.jpg" class=" h-1/3 w-1/2"/>
        <a class="hover:text-gray-500" href="https://github.com/joshuayanggithub">Github
          <AiFillGithub size={80}/>
        </a>
        <a class="hover:text-gray-500" href="https://codeforces.com/profile/JoshuaYang">CF
          <SiCodeforces size={80} />
        </a>

        <a class="hover:text-gray-500" href="https://open.spotify.com/user/jjz133?si=cbdf4b34ebd14042">Spotify
          <SiSpotify size={80} />
        </a>
      </div>
    </div>
  );
}

export default Contacts