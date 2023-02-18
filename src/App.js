//import {Parallax, ParallaxLayer} from "@react-spring/parallax"}
import { useEffect, useState } from "react";
import About from "./components/About";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LoadingScreen from "./components/LoadingScreen";
import NavBar from "./components/NavBar";

function App() {
  const [LoadingScreenDone, setLoadingScreenDone] = useState(false);

  useEffect ( () => {
    setTimeout( () => setLoadingScreenDone(true), 3000);
  }
    , []
  );

  return (
    <>
      {!LoadingScreenDone ? <LoadingScreen isDone={!LoadingScreenDone}/> : 
        <>
          <NavBar />
          <Home />
          <About />
          <Footer />
        </>
      }
    </>
)
}

export default App;
