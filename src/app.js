import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useEffect, useState } from 'react';
import Map, {
  FullscreenControl,
  Layer, Marker,
  NavigationControl,
  Popup, ScaleControl,
  Source
} from 'react-map-gl';
import MapConfig from './Components/mapConfig';

const MAPBOX_KEY = process.env.MAPBOX_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;


const initialViewState = {
  latitude: 38.8409,
  longitude: -105.0423,
  zoom: 14.104
};

const App = () => {

  const [viewState, setViewState] = useState({
    latitude: initialViewState.latitude,
    longitude: initialViewState.longitude,
    zoom: initialViewState.zoom
  });

  const [markerCoordinates, setMarkerCoordinates] = useState({
    latitude: initialViewState.latitude,
    longitude: initialViewState.longitude
  });

  const [isMapClicked, setIsMapClicked] = useState(false);
  const [weatherData, setWeatherData] = useState();
  const [layerToggle, setLayerToggle] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    setWeatherData(null);
    if (markerCoordinates && isMapClicked) {
      getWeather();
    }
  }, [markerCoordinates])

  useEffect(() => {
    if (isFormSubmitted) {
      setViewState(v => ({
        ...v,
        longitude: markerCoordinates.longitude,
        latitude: markerCoordinates.latitude
      }));
      getWeather();
    }
  }, [isFormSubmitted])

  const updateSettings = useCallback((name, value) => {
      setMarkerCoordinates(s => ({
        ...s,
        [name]: value
      }));
    }, [])

  const updateToggle = useCallback((val) => {
    setLayerToggle(val)
  }, [])

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true)
  }

  const getWeather = async () => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${markerCoordinates.latitude}&lon=${markerCoordinates.longitude}&appid=${WEATHER_API_KEY}&units=imperial`;

    try {
      let { data } = await axios.get(URL);
      
      const { icon, description } = data.weather[0];
      const { feels_like, humidity, temp, temp_max, temp_min  } = data.main;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
      const newWeather = {
        iconUrl,
        description,
        feels_like: Math.round(feels_like),
        humidity,
        temp: Math.round(temp),
        temp_max: Math.round(temp_max),
        temp_min: Math.round(temp_min),
        name: data.name
      }
      setWeatherData(newWeather);
      if (isFormSubmitted) {
        setIsFormSubmitted(false);
      }
      if (isMapClicked) {
        setIsMapClicked(false);
      }
    }

    catch (e) {
      // TODO: Build nice popup to display errors
      console.log('weather error: ', e)
    }
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
  };

  const WeatherDisplay = () => (
    <div className="weather-popup-data flex">
      {
        weatherData.name !== '' &&
        <p className="weather-popup-data--location text-center">{weatherData.name}</p>
      }
      <img className="weather-icon" src={weatherData.iconUrl} alt="weather-icon" />
      <div className="weather-popup-data--temp">
        {weatherData.temp}º
      </div>
      <div className="weather-popup-data--low-high">
        <span className="bold">{weatherData.temp_max}º</span> | {weatherData.temp_min}º
      </div>
      <div className="bold">
        {weatherData.description}
      </div>
      <hr />
      <div>
        <span className="bold">Feels like: </span>
        {weatherData.feels_like}º
      </div>
      <div>
        <span className="bold">Humidity: </span>
        {weatherData.humidity}     
      </div>
    </div>
  )

  return (
    <>
      <section className="map">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_KEY}
          onClick={(evt) => {
            setIsMapClicked(true)
            setMarkerCoordinates({ latitude: evt.lngLat.lat, longitude: evt.lngLat.lng })
          }}
        >
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          <ScaleControl />
          <Marker longitude={markerCoordinates.longitude} latitude={markerCoordinates.latitude} color="red" />
          {
            layerToggle &&
            <Source id="countour" {...countourData}>
              <Layer {...contourLayer} />
            </Source>
          }
          {
            weatherData &&
            <Popup
              longitude={markerCoordinates.longitude}
              latitude={markerCoordinates.latitude}
              // TODO: Detect where on screen user clicks, and dynamically position so that popup is always visible
              anchor="top"
              onClose={() => setWeatherData(null)}
              className="weather-popup map-overlay-container"
            >
              <WeatherDisplay />
            </Popup>
          }
        </Map>
      </section>

      <MapConfig
        coordinates={markerCoordinates ? markerCoordinates : { longitude: initialViewState.longitude, latitude: initialViewState.latitude}}
        onChange={updateSettings}
        toggleVal={layerToggle}
        onToggle={updateToggle}
        formCallback={handleFormSubmit}
      />
    </>
  );
}

export default App;