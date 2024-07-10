import React from 'react';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer.js'; // Footer 경로에 맞게 수정
import WeatherPage from './WeatherPage.js';
import MainUpper from '../components/specific/MainUpper.js';

function MainPage() {
  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <MainUpper />
        <WeatherPage/>
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;
