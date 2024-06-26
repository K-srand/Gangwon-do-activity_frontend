import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/MyNavbar';
import MainPage from './components/common/MainPage';
import Footer from './components/common/Footer';
import Login from './components/specific/login';
import Community from './components/specific/community';
import Post from './components/specific/post';
import './App.css';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/post" element={<Post />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
