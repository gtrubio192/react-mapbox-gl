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
import WeatherDisplay from './Components/WeatherDisplay';

const MAPBOX_KEY = process.env.MAPBOX_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const initialViewState = {
  latitude: 38.8409,
  longitude: -105.0423,
  zoom: 11
};

const LAT_RANGE = 90;
const LONG_RANGE = 180;

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

  /**
   * @todo: 
   * 1) Adjust outlier marker coordinates when map is fully zoomed out and multiple worlds displaying
   *    Ref: https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/
   * 2) Adjust position of marker when latitudes are too close to north/south edge of map
   */
  useEffect(() => {
    setWeatherData(null);
    if (isMapClicked) {
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
    const range = name === 'latitude' ? LAT_RANGE : LONG_RANGE;

    value = Math.max(-range, Math.min(range, Number(value)));

    setMarkerCoordinates(s => ({
        ...s,
        [name]: value
      }));
    }, [])

  const updateToggle = useCallback((value) => {
    setLayerToggle(value)
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
      /**
       * @todo: Build nice popup to display weather errors (see todo about adjusting marker coordinates)
       */
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
      'line-color': '#00e676',
      'line-width': 1.5
    },
    filter: ['>=',["number", ["get", "ele"]], 3048]
  };

  const countourData = {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-terrain-v2'
  };

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
            /**
             * @todo: 
             * 1) Detect where on screen user clicks, and dynamically set anchor prop so that popup is always visible
             * 2) Provide skeleton/loader while weather data is loading
             */
            weatherData &&
            <Popup
              longitude={markerCoordinates.longitude}
              latitude={markerCoordinates.latitude}
              anchor="top"
              onClose={() => setWeatherData(null)}
              className="weather-popup map-overlay-container"
            >
              <WeatherDisplay weatherData={weatherData} />
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

/**
 * @todo: Add prop validation to all child components
 */
export default App;