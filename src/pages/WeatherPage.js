import React from 'react';
import Calendar from '../components/specific/Calendar';
import '../App.css';

const WeatherPage = () => {
  return (
    <div className="WeatherPage">
      <h1>Weather Calendar</h1>
      <Calendar />
    </div>
  );
};

export default WeatherPage;
