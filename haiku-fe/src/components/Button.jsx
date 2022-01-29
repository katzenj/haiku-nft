import React from "react";

import "./Button.css";

const Button = ({ disabled, onClick, children }) => {
  return (
    <button disabled={disabled} className="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
