import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/MyPage.css';
import leftArrow from '../../assets/images/MainLeftArrow.png';
import rightArrow from '../../assets/images/MainRightArrow.png';
import deleteIcon from '../../assets/images/delete-icon.png';
import rank1 from '../../assets/images/Rank1.png';
import rank2 from '../../assets/images/Rank2.png';
import rank3 from '../../assets/images/Rank3.png';
import rank4 from '../../assets/images/Rank4.png';
import rank5 from '../../assets/images/Rank5.png';


const PaginatedList = ({ title, fetchUrl, renderItem, itemsPerPage }) => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${fetchUrl}?page=${page-1}&size=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
      console.log("Fetched data:", response.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="paginated-list">
      <h2>{title}</h2>
      <div className="carousel-container">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage <= 1}
          className="carousel-button left"
        >
          <img src={leftArrow} alt="Previous" />
        </button>
        <div className="list-container">
          {data.map(renderItem)}
        </div>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage >= totalPages}
          className="carousel-button right"
        >
          <img src={rightArrow} alt="Next" />
        </button>
      </div>
      <div className="pagination-controls">
        <span>{currentPage} / {totalPages}</span>
      </div>
    </div>
  );
};

const PaginatedList2 = ({ title, fetchUrl, renderItem, itemsPerPage }) => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [courseSet, setCourseSets] = useState([]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${fetchUrl}?page=${page-1}&size=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const content = response.data.content;
      const sets = [];
      for (let i = 0; i < content.length; i += 4) {
        sets.push(content.slice(i, i + 4));
      }
      setCourseSets(sets);
      setTotalPages(sets.length);
      console.log("Fetched sets:", sets);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="paginated-list">
      <h2>{title}</h2>
      <div className="carousel-container">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage <= 1}
          className="carousel-button left"
        >
          <img src={leftArrow} alt="Previous" />
        </button>
        <div className="list-container">
          {courseSet && courseSet.length > 0 ? (
            <div className="course-set">
              {renderItem(courseSet[currentPage - 1])}
            </div>
          ) : (
            <p>로딩 중이거나 코스가 없습니다.</p>
          )}
        </div>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage >= totalPages}
          className="carousel-button right"
        >
          <img src={rightArrow} alt="Next" />
        </button>
      </div>
      <div className="pagination-controls">
        <span>{currentPage} / {totalPages}</span>
      </div>
    </div>
  );
};

const MyPage = () => {
  const [userExp, setUserExp] = useState("");
  const [rankImg, setRankImg] = useState("");
  const [rankName, setRankName] = useState("");
  const token = localStorage.getItem('token');

  const handleDelete = async (placeNo) => {
    try {
      const response = await axios.delete(`http://localhost:4040/api/v1/mypage/delete/${placeNo}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.code === 'SU' && response.data.message === 'Success.') {
        alert("내가 찜한 플레이스가 삭제되었습니다");
      }

      // 삭제 후 데이터 갱신
      window.location.reload();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderMyPostItem = (item) => (
    <div className="post-item-mypage" key={item.boardNo}>
      <p>{item.boardTitle}</p>
      <span className="post-date">{new Date(item.writtenTime).toLocaleDateString()}</span>
      <hr />
    </div>
  );

  const renderFavoriteItem = (item) => (
    <div className="carousel-item" key={item.placeNo}>
      <img src={item.firstImage} alt={item.placeTitle} />
      <p>{item.placeTitle}</p>
      <button 
        className="delete-button"
        onClick={() => handleDelete(item.placeNo)}
      >
        <img src={deleteIcon} alt="Delete" />
      </button>
    </div>
  );

  const renderMyCourseItem = (items) => (
    <div className="course-options">
      {items.map((course, index) => (
        <div key={index} className="course-item">
          <img src={course.firstImage2} alt={course.placeTitle} className="course-image" />
          <div>{course.placeTitle}</div>
        </div>
      ))}
    </div>
  );

  const getRank = async () => {
    try {
      const response = await axios.get(`http://localhost:4040/api/v1/mypage/exp`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const expUser = response.data;
      setUserExp(expUser);
      if(expUser < 10){
        setRankImg(rank1);
        setRankName("씨앗");
      }else if(expUser < 50){
        setRankImg(rank2);
        setRankName("새싹");
      }else if(expUser < 100){
        setRankImg(rank3);
        setRankName("감자");
      }else if(expUser < 150){
        setRankImg(rank4);
        setRankName("돼지감자");
      }else {
        setRankImg(rank5);
        setRankName("왕감자");
      }
      
    } catch (error) {
      console.error('Error :', error);
    }
  };

  useEffect(() => {
    getRank();
    console.log('????????????',rankImg);
  }, []);

  return (
    <div className="mypage">

      <div className="profile-card">
            <div className="profile-image-container">
              <img src={rankImg} alt="Profile" className="profile-image" />
            </div>
            <div className="profile-info">
              <div className="profile-rank">등급 : {rankName}</div>
              <div className="profile-name">경험치 : {userExp}</div>
            </div>
      </div>
      <PaginatedList 
        title="내가 쓴 글"
        fetchUrl="http://localhost:4040/api/v1/mypage/getmyboardlist"
        renderItem={renderMyPostItem}
        itemsPerPage={3}
      />
      <PaginatedList 
        title="내가 찜한 곳"
        fetchUrl="http://localhost:4040/api/v1/mypage/getmyfavoritelist"
        renderItem={renderFavoriteItem}
        itemsPerPage={5}
      />
      <PaginatedList2 
        title="마이 코스"
        fetchUrl="http://localhost:4040/api/v1/mypage/mycourse"
        renderItem={renderMyCourseItem}
        itemsPerPage={1}
      />
    </div> 
  );
};

export default MyPage;
