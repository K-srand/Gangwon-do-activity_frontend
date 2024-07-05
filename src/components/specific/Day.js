import React from 'react';
import WeatherInfo from './WeatherInfo';

const Day = ({ date, weatherData }) => {
  return (
    <div className="day">
      <div>{date.getDate()}</div>
      {weatherData ? <WeatherInfo data={weatherData} /> : <div>Loading...</div>}
    </div>
  );
};

export default Day;
