import React from 'react';
/**
 * 
 * @todo: Wrap component in memo
 */
const WeatherDisplay = ({weatherData}) => (
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

export default WeatherDisplay;

