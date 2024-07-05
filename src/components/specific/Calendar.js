import React, { useState, useEffect } from 'react';
import Day from './Day';
import '../../assets/styles/Weather.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('http://localhost:4040/api/v1/weather/data'); // 백엔드 서버 URL과 포트를 명시
        const data = await response.json();
        if (Array.isArray(data)) {
          setWeatherData(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setWeatherData([]);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherData([]); // 에러가 발생한 경우 빈 배열로 초기화
      }
    };
    fetchWeatherData();
  }, []);

  const getMonthName = (date) => {
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    return monthNames[date.getMonth()];
  };

  return (
    <div>
      <div className= "BMProTitle">{getMonthName(currentDate)}</div>
      <div className="calendar-grid">
        {weatherData.map((day, index) => (
          <Day key={index} date={new Date(day.date)} weatherData={day} />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
