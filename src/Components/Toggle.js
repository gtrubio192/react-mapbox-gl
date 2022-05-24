import React from 'react';

const Toggle = ({name, value, onChange}) => {
  return (
    <div className="map-config-row flex">
      <label className="bold">{name}</label>
      <div className="switch-container">
        <input type="checkbox" id="switch" checked={value} onChange={e => onChange(e.target.checked)}/>
        <div className="switch-color"></div>
        <label for="switch">
        </label>
      </div>
    </div>
  );
}

export default Toggle;