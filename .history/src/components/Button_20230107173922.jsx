import React from "react";

const Button = (props) => {
  return (
    <button class="bg-sasgrey text-white font-button py-2  px-5 rounded">
      {props.children}
    </button>
  );
}

export default Button