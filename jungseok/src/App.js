import React from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MainPage from '../src/pages/MainPage';
import MainPageMiddle from './components/specific/MainPageMiddle';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <MainPage />
      <MainPageMiddle />
      <Footer />
    </div>
  );
}

export default App;
