import React from 'react';
import Toggle from './Toggle';
import NumericInput from './NumericInput';

const MapConfig = (props) => {
  const {
    coordinates,
    onChange,
    toggleVal,
    onToggle,
    formCallback
  } = props;

  return (
    <div className="map-config map-overlay-container">
      <hr />
      <Toggle name="terrain countour" value={toggleVal} onChange={onToggle}/>
      <form onSubmit={(e) => formCallback(e)}>
        <NumericInput
          name="latitude"
          value={coordinates['latitude']}
          onChange={onChange}
        />
        <NumericInput
          name="longitude"
          value={coordinates['longitude']}
          onChange={onChange}
        />
        <hr />
        <button type="submit" className="map-config-submit bold">Lets Go!</button>
      </form>
    </div>
  );
}

export default React.memo(MapConfig);

