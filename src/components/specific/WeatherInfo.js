import React from 'react';

const WeatherInfo = ({ data }) => {
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'sunny':
        return '🌞';
      case 'cloudy':
        return '☁️';
      case 'rainy':
        return '🌧️';
      default:
        return '❓';
    }
  };

  return (
    <div className="weather-info">
      <div>{getWeatherIcon(data.weather)}</div>
      <div>{data.temperature}°C</div>
      <div>{data.description}</div>
    </div>
  );
};

export default WeatherInfo;
