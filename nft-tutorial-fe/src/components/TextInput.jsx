import React, { useState } from "react";

import "./TextInput.css";

const TextInput = ({ labelText, value, setValue, placeholder }) => {
  const onChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="input-container">
      <div className="input-box-container">
        <label className="input-label">{labelText}</label>
        <input
          className="input-box"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextInput;
