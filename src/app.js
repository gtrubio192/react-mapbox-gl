import React, { useState, useCallback, useEffect } from 'react';
import {render} from 'react-dom';
import axios from 'axios'
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup
} from 'react-map-gl';
import ControlPanel from './control-panel';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/styles.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3RydWJpbzE5MiIsImEiOiJjbDNjMzk3dHEwNWhyM2NzOHljMHR1cGswIn0.KQJ9ZsJTHI567vHyrmOStg';

const initialViewState = {
  latitude: 37.729,
  longitude: -122.36,
  zoom: 11
};

const camelPattern = /(^|[A-Z])[a-z]*/g;
function formatSettingName(name) {
  return name.match(camelPattern).join(' ');
}

export default function App() {

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
  const [weatherData, setWeatherData] = useState()
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (markerCoordinates) {
      getWeather();
    }
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

  return (
    <>
      <section className="map">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/gtrubio192/cl3d91f4k000615n3yvaary94" // "mapbox://styles/mapbox/streets-v9"
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
                <div className="bold">
                  {weatherData.description}
                </div>
                <hr />
                {/* TODO: style all items in renderWeather so that label and values are more separated/table like */}
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

      <ControlPanel settings={markerCoordinates ? markerCoordinates : { longitude: initialViewState.longitude, latitude: initialViewState.latitude}} onChange={updateSettings} />
    </>
  );
}

render(<App />, document.body.appendChild(document.createElement('div')));