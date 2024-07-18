import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/MyPage.css';
import leftArrow from '../../assets/images/MainLeftArrow.png';
import rightArrow from '../../assets/images/MainRightArrow.png';
import deleteIcon from '../../assets/images/delete-icon.png'; // 삭제 아이콘 추가

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
      const response = await axios.get(`${fetchUrl}?page=${page - 1}&size=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
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

const MyPage = () => {
  const handleDelete = async (placeNo) => {
    const token = localStorage.getItem('token');
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

  return (
    <div className="mypage">
      <PaginatedList 
        title="내가 쓴 글"
        fetchUrl="http://localhost:4040/api/v1/mypage/getmyboardlist"
        renderItem={renderMyPostItem}
        itemsPerPage={5}
      />
      <PaginatedList 
        title="내가 찜한 곳"
        fetchUrl="http://localhost:4040/api/v1/mypage/getmyfavoritelist"
        renderItem={renderFavoriteItem}
        itemsPerPage={5}
      />
    </div>
  );
};

export default MyPage;
