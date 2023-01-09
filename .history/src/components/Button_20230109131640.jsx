import React from "react";

const Button = (props) => {
  return (
    <button class="bg-gray-700 text-black font-navheader p-3 rounded-lg">
      {props.children}
    </button>
  );
}

export default Button