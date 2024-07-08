import CreateMyCoursePage from './pages/CreateMyCoursePage';
import { React } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Test상태인 녀석들 -> 아직 components에서 바로 가져다 쓰는녀석들
import LoginDetail from './components/specific/LoginDetail';
import Register from './components/specific/Register';

//Page 단위 구성까지 끝난 녀석들 -> pages에서 끌어오기.
import MainPage from './pages/MainPage';
import CommunityListPage from './pages/CommunityListPage'; 
import './App.css';

function App() {

  return (
    <div className="App">
      <Router>
  
          <Routes>
            <Route path= "logindetail" element={<LoginDetail />}/>
            <Route path="/" element={<MainPage />} />
            <Route path="/community" element={<CommunityListPage/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path= "/createmycoursepage" element={<CreateMyCoursePage />}/>
          </Routes>
          
        </Router>
    </div>

  );
}

export default App;
