import React, { useState, useCallback, useEffect } from 'react';
import {render} from 'react-dom';
import axios from 'axios'
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl';
import ControlPanel from './control-panel';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/styles.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3RydWJpbzE5MiIsImEiOiJjbDNjMzk3dHEwNWhyM2NzOHljMHR1cGswIn0.KQJ9ZsJTHI567vHyrmOStg';

const initialViewState = {
  latitude: 37.729,
  longitude: -122.36,
  zoom: 11,
  bearing: 0,
  pitch: 50
};

export default function App() {

  const [viewState, setViewState] = useState({
    latitude: 37.8,
    longitude: -122.4,
    zoom: 14
  });

  const [markerCoordinates, setMarkerCoordinates] = useState({
    latitude: 37.8,
    longitude: -122.4
   });

  useEffect(() => {
    getWeather();
  }, [markerCoordinates])

  const updateSettings = useCallback(
    (name, value) =>
    setMarkerCoordinates(s => ({
        ...s,
        [name]: value
      })),
    []
  );

  const getWeather = async () => {
    const WEATHER_API_KEY = '2f41c069e03efa03cfee1d0454bed4ce';
    const URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${markerCoordinates.latitude}&lon=${markerCoordinates.longitude}&appid=${WEATHER_API_KEY}`;

    try {
      let newWeather = await axios.get(URL)
      console.log(newWeather)
    }

    catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <section className="map">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
          onClick={(evt) => {
            setMarkerCoordinates({ latitude: evt.lngLat.lat, longitude: evt.lngLat.lng })
          }}
        >
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          <ScaleControl />
          {
            (markerCoordinates && markerCoordinates.longitude && markerCoordinates.latitude) ?
            <Marker longitude={markerCoordinates.longitude} latitude={markerCoordinates.latitude} color="red" /> :
            null
          }
          
        </Map>        
      </section>

      <ControlPanel settings={markerCoordinates ? markerCoordinates : { longitude: '', latitude: ''}} onChange={updateSettings} />
    </>
  );
}

render(<App />, document.body.appendChild(document.createElement('div')));