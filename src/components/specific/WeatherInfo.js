import React from 'react';
import Cloudy from '../../assets/images/Cloudy.png';
import CloudyRainy from '../../assets/images/CloudyRainny.png';
import Rainny from '../../assets/images/Rainny.png';
import Sunny from '../../assets/images/Sunny.png';
import  '../../assets/styles/Weather.css';


const WeatherInfo = ({ data }) => {

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case '맑음':
        return Sunny;
      case '구름많음':
        return Cloudy;
      case '흐림':
        return CloudyRainy;
      default:
        return Rainny;
    }
  };

  return (
    <div className="weather-info">
      <img src={getWeatherIcon(data.weather)} alt={data.weather} className="weather-icon" />
      <div className='BMAir'>최고 기온: {data.taMax}°C</div>
      <div className='BMAir'>최저 기온: {data.taMin}°C</div>
      <div className='BMAir'>강수 확률: {data.rnSt}%</div>
    </div>
  );
};

export default WeatherInfo;
