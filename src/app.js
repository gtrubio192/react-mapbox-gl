import React, { useState, useCallback, useEffect, useRef } from 'react';
import {render} from 'react-dom';
import axios from 'axios'
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup,
  Layer,
  Source
} from 'react-map-gl';
import ControlPanel from './control-panel';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/styles.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3RydWJpbzE5MiIsImEiOiJjbDNjMzk3dHEwNWhyM2NzOHljMHR1cGswIn0.KQJ9ZsJTHI567vHyrmOStg';

const initialViewState = {
  latitude: 38.8409,
  longitude: -105.0423,
  zoom: 10
};

const camelPattern = /(^|[A-Z])[a-z]*/g;
function formatSettingName(name) {
  return name.match(camelPattern).join(' ');
}

export default function App() {

  const mapRef = useRef();

  const [viewState, setViewState] = useState({
    latitude: initialViewState.latitude,
    longitude: initialViewState.longitude,
    zoom: initialViewState.zoom
  });

  const [markerCoordinates, setMarkerCoordinates] = useState();
  // {
  //   latitude: initialViewState.latitude,
  //   longitude: initialViewState.longitude
  //  }
  const [weatherData, setWeatherData] = useState();
  const [layerToggle, setLayerToggle] = useState(false);

  useEffect(() => {
    if (markerCoordinates) {
      getWeather();
    }
  }, [markerCoordinates])

  useEffect(() => {
    if (layerToggle) {
      // do something
    }
  }, [layerToggle])

  const updateSettings = useCallback(
    (name, value) =>
    setMarkerCoordinates(s => ({
        ...s,
        [name]: value
      })),
    []
  );

  const updateToggle = useCallback((val) => {
    setLayerToggle(val)
  })

  const getWeather = async () => {
    const WEATHER_API_KEY = '8eb6eece1d732e462a3657e77a8623ef';
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${markerCoordinates.latitude}&lon=${markerCoordinates.longitude}&appid=${WEATHER_API_KEY}&units=imperial`;

    try {
      let { data } = await axios.get(URL);
      
      console.log(data)
      const { icon, description } = data.weather[0];
      const { feels_like, humidity, temp, temp_max, temp_min  } = data.main;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
      const newWeather = {
        iconUrl,
        description,
        feelsLike: feels_like,
        humidity,
        temp,
        tempMax: temp_max,
        tempMin: temp_min,
      }
      setWeatherData(newWeather);
    }

    catch (e) {
      console.log('weather error: ', e)
    }
  }

  const renderWeather = (name, value) => {
    return (
      <div key={name} className="weather-popup-data">
        <span className="bold">{formatSettingName(name)}: </span>
        {value}º F
      </div>
    );
  }

  const contourLayer = {
    'id': 'terrain-data',
    'type': 'line',
    'source': 'mapbox-terrain',
    'source-layer': 'contour',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#ff69b4',
      'line-width': 1
    },
    filter: ['>=',["number", ["get", "ele"]], 3048]
  };

  const countourData = {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-terrain-v2'
  }

  return (
    <>
      <section className="map">
        <Map
          {...viewState}
          ref={mapRef}
          onMove={evt => setViewState(evt.viewState)}
          // mapStyle="mapbox://styles/gtrubio192/cl3d91f4k000615n3yvaary94"
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

          <Source id="countour" {...countourData}>
            <Layer {...contourLayer} />
          </Source>
          
          {
            (markerCoordinates && markerCoordinates.longitude && markerCoordinates.latitude) ?
            <Marker longitude={markerCoordinates.longitude} latitude={markerCoordinates.latitude} color="red" /> :
            null
          }
          {
            weatherData &&
            <Popup
              longitude={markerCoordinates.longitude}
              latitude={markerCoordinates.latitude}
              anchor="top"
              onClose={() => setWeatherData(null)}
              className="weather-popup"
            >
              <div>
                <img className="weather-icon" src={weatherData.iconUrl} alt="weather-icon" />
                <div className="bold text-center">
                  {weatherData.description}
                </div>
                <hr />
                <div>
                  {
                    Object.keys(weatherData).map(key => {
                      if (key !== 'description' && key !== 'iconUrl') {
                        return renderWeather(key, weatherData[key])
                      }
                    })
                  }                  
                </div>
              </div>
            </Popup>
          }
        </Map>        
      </section>

      <ControlPanel
        settings={markerCoordinates ? markerCoordinates : { longitude: initialViewState.longitude, latitude: initialViewState.latitude}}
        onChange={updateSettings}
        toggleVal={layerToggle}
        onToggle={updateToggle}
      />
    </>
  );
}

render(<App />, document.body.appendChild(document.createElement('div')));