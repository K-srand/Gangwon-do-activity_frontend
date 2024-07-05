import React from 'react';
import WeatherInfo from './WeatherInfo';
import '../../assets/styles/Weather.css';
const Day = ({ date, weatherData }) => {
  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <div className="day">
      <div className='BMPro'>{formatDate(date)}</div>
      {weatherData ? <WeatherInfo data={weatherData} /> : <div>Loading...</div>}
    </div>
  );
};

export default Day;
