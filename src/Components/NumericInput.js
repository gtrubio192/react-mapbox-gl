import React from 'react';

const NumericInput = ({name, value, onChange}) => {
  return (
    <div className="map-config-row flex">
      <label className="bold">{name}</label>
      <input
        type="number"
        value={value}
        step={.0001}
        onChange={e => onChange(name, Number(e.target.value))}
      />
    </div>
  );
}

export default NumericInput;
