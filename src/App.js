import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/MyNavbar';
import MainPage from './components/common/MainPage';
import Footer from './components/common/Footer';
import Login from './components/specific/Login';
import Community from './components/specific/Community';
import Post from './components/specific/Post';
import Signup from './components/specific/SignUp';
import './App.css';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/Post" element={<Post />} />
          <Route path="/SignUp" element={<Signup />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
