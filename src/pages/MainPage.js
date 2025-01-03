import {React, useState, useEffect} from 'react';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer.js'; // Footer 경로에 맞게 수정
import WeatherPage from './WeatherPage.js';
import MainUpper from '../components/specific/MainUpper.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MainPage() {

  const token = localStorage.getItem('token');

  const [userId, setUserId] = useState(null);

  const DOMAIN = 'https://gangwonactivity.site';
  const API_DOMAIN = DOMAIN + '/api/v1';

  useEffect (() => {
      axios.get(API_DOMAIN + '/user', {
          headers: {
              'Authorization': `Bearer ${token}` // 요청 헤더에 토큰 추가
          }
      })
      .then(function(res){
          console.log('User data:', res.data.id);
          setUserId(res.data.id);
      })
      .catch(function(error) {
          console.error("There was an error!", error);
      });
  }, [token]);


  return (
    <div>
      <main>
        <MainUpper token={token} />
        <WeatherPage/>
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;
