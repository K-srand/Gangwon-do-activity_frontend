import React from 'react';
import Calendar from '../components/specific/Calendar.js';

const WeatherPage = () => {
  return (
    <div className="weather-page">
      <h1>열흘의 날씨!</h1>
      <Calendar />
    </div>
  );
};

export default WeatherPage;
