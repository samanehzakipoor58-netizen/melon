import React from "react";

type BlueInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  classname?: string;
};

const BlueInput = ({ type = "text", placeholder, classname = "", ...props }: BlueInputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition-all text-black ${classname}`}
      {...props}
    />
  );
};

export default BlueInput;
