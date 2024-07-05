import React, { useState, useEffect } from 'react';
import Day from './Day';
import '../../assets/styles/Weather.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeatherData();
  }, [currentDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => new Date(year, month, i + 1));
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div>
      <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>Previous</button>
      <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>Next</button>
      <div className="calendar-grid">
        {days.map(day => (
          <Day key={day} date={day} weatherData={weatherData.find(data => new Date(data.date).getDate() === day.getDate())} />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
