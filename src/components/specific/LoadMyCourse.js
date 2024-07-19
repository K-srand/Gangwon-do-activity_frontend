import React, { useState, useEffect } from 'react';
import '../../assets/styles/LoadMycourse.css'; 
import axios from 'axios';

function LoadMyCourse({ closeModal, onCourseSelect }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseInfo, setSelectedCourseInfo] = useState(null);
  const [courseSets, setCourseSets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:4040/api/v1/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(function (res) {
        console.log('User data:', res.data.id);
        setUserId(res.data.id);
      })
      .catch(function (error) {
        console.error("There was an error!", error);
      });
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) return; 
      try {
        const response = await axios.post('http://localhost:4040/api/v1/board/mycourse', {
          userId: userId
        }, {
          params: {
            page: currentPage, 
            size: 2 
          }
        });

        console.log('Response data:', response.data);

        const { content, totalPages } = response.data;
        const sets = [];
        for (let i = 0; i < content.length; i += 4) {
          sets.push(content.slice(i, i + 4));
        }

        setCourseSets(sets);
        setTotalPages(totalPages);
        console.log('Course sets:', sets);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [userId, currentPage]);

  const handleCourseSelect = (index, courseInfo) => {
    setSelectedCourse(index);
    setSelectedCourseInfo(courseInfo);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = currentPage * 2;
  const endIndex = startIndex + 2;
  const currentSets = courseSets.slice(startIndex, endIndex);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>나만의 코스 불러오기</h2>
        <div className="course-selection">
          {currentSets && currentSets.length > 0 ? (
            currentSets.map((set, setIndex) => (
              <div key={setIndex} className="course-set">
                <input 
                  type="radio" 
                  id={`set${setIndex}`} 
                  name="courseSet" 
                  checked={selectedCourse === startIndex + setIndex} 
                  onChange={() => handleCourseSelect(startIndex + setIndex, set)}
                />
                <label htmlFor={`set${setIndex}`}>코스 세트 {startIndex + setIndex + 1}</label>
                <div className="course-options">
                  {set.map((course, index) => (
                    <div key={index} className="course-item">
                      <img src={course.firstImage2} alt={course.placeTitle} className="course-image" />
                      <div>{course.placeTitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>로딩 중이거나 코스가 없습니다.</p>
          )}
        </div>
        <div className="pagination">
          {currentPage > 0 && (
            <button onClick={handlePrevPage} className="pagination-btn">이전</button>
          )}
          {currentPage < totalPages - 1 && (
            <button onClick={handleNextPage} className="pagination-btn">다음</button>
          )}
        </div>
        <div className="modal-actions">
          <button onClick={closeModal}>취소</button>
          <button onClick={() => {
            if (selectedCourseInfo !== null) {
              onCourseSelect(selectedCourseInfo);
            }
            closeModal();
          }}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default LoadMyCourse;
