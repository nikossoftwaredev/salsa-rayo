import React, { FC, ButtonHTMLAttributes } from "react";

// Define the component with ButtonHTMLAttributes
const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      className={`btn bg-gradient-to-r from-purple to-yellow-300 text-white ${props.className} hover:scale-105 ease-in-out duration-300`}
    >
      {props.children || "Button"}
    </button>
  );
};

export default Button;
