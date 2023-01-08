import React from "react";

const Button = (props) => {
  return (
    <button class="bg-sasgray text-white font-body py-2  px-5 rounded">
      {props.text}
    </button>
  );
}

export default Button