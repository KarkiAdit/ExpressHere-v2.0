import React from "react";
import "../styles/FormInput.css";

const SelectInput = (props) => {
  const { label, errorMessage, onChange, id, ...inputProps } = props;
  return (
    <div className="formInput">
      <select id={`input${props.id}`} name={inputProps.name} defaultValue={inputProps.defaultValue} onChange={onChange}>
            {inputProps.options.map((opt) => {
                return (<option value={opt.value} className="options">{opt.emo}</option>)
            })}
      </select>
    </div>
  );
};

export default SelectInput;