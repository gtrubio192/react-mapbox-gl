import React, { useState } from 'react';

const camelPattern = /(^|[A-Z])[a-z]*/g;
function formatSettingName(name) {
  return name.match(camelPattern).join(' ');
}

function Checkbox({name, value, onChange}) {
  return (
    <div className="input">
      <label>{formatSettingName(name)}</label>
      <input type="checkbox" checked={value} onChange={evt => onChange(evt.target.checked)} />
    </div>
  );
}

function NumericInput({name, value, onChange}) {
  return (
    <div className="input">
      <label>{formatSettingName(name)}</label>
      <input
        type="number"
        value={value}
        onChange={evt => onChange(name, Number(evt.target.value))}
      />
    </div>
  );
}

function ControlPanel(props) {
  const { coordinates, onChange, toggleVal, onToggle, formCallback } = props;

  return (
    <div className="control-panel">
      <hr />
      <Checkbox name="layerToggle" value={toggleVal} onChange={onToggle}/>
      {
        Object.keys(coordinates).map(name => 
          <NumericInput key={name} name={name} value={coordinates[name]} onChange={onChange} />
        )
      }
      {/* TODO: make this button change location of map with weather readings */}
      <button onClick={() => formCallback(true)}>I want to go to there</button>
      <hr />
    </div>
  );
}

export default React.memo(ControlPanel);