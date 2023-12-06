import React from "react";
import { useState } from "react";
import "../styles/FormInput.css";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, ...inputProps } = props;

  // display error messages
  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    // structure the comment elements
    <div className={props.type == "comment" ? "text-area" : "formInput"}>
      <input className={props.type == "comment" ? "text-area" : "formInput"}
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === "confirmPassword" && setFocused(true)
        }
        focused={focused.toString()}
      />
      <span>{errorMessage}</span>
    </div>
  );
};

export default FormInput;