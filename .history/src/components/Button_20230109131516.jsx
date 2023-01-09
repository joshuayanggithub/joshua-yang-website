import React from "react";

const Button = (props) => {
  return (
    <button class="bg-sasgrey text-white font-navheader rounded-lg">
      {props.children}
    </button>
  );
}

export default Button