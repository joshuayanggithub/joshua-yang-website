import React from "react";

const Button = (props) => {
  return (
    <button class="bg-sasgrey text-white font-navheader p-5mx-3 rounded-lg">
      {props.children}
    </button>
  );
}

export default Button