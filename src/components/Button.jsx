import React from "react";

const Button = (props) => {
  return (
    <button class="bg-sasgrey text-white font-button py-3  px-4 mx-3 rounded">
      {props.children}
    </button>
  );
}

export default Button