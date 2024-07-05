import React from 'react';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer.js'; // Footer 경로에 맞게 수정
import Main from '../components/specific/Main.js';
import WeatherPage from './WeatherPage.js';

function MainPage() {
  return (
    <div>
      <Navbar />
      <main>
        <Main />
        <WeatherPage/>
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;
