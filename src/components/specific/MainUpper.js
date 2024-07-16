import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from "axios";
import '../../assets/styles/MainPage.css';
import leftArrow from '../../assets/images/MainLeftArrow.png';
import rightArrow from '../../assets/images/MainRightArrow.png';
import favorite from '../../assets/images/Favorite.png';
import defaultImage from '../../assets/images/Icon_No_Image.png';
import welcome from '../../assets/images/Welcome.png';

function MainUpper({token}) {
  const mapContainer = useRef(null);
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const mapData = useRef(null);
  const [userId, setUserId] = useState(null);

  useEffect (() => {
    axios.get('http://localhost:4040/api/v1/user', {
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

  useEffect(() => {
    // 네이버 맵 스크립트를 동적으로 추가
    axios.get('http://localhost:4040/api/v1/getmap')
      .then(response => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = response.data;
        script.onload = initializeMap; // 스크립트 로드가 완료되면 맵 초기화
        document.head.appendChild(script);
      })
      .catch(error => console.error('Error fetching map script:', error));

    // 백엔드에서 데이터 가져오기
    axios.get('http://localhost:4040/api/v1/getjson/getplace')
      .then(response => {
        console.log('Fetched Data:', response.data);  
        setLocations(response.data);
        const fetchedItems = response.data.map(place => ({
          id: place.placeNo,
          img: place.firstImage,
          title: place.placeTitle,
        }));
        setItems(fetchedItems);
      })
      .catch(error => console.error('Error fetching locations:', error));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeMap = useCallback(() => {
    if (locations.length > 0 && window.naver && mapData.current) {
      const { naver } = window;

      const initialLocation = new naver.maps.LatLng(38.0431160103, 128.2067618712);
      const options = {
        center: initialLocation,
        zoom: 8, 
      };
      const map = new naver.maps.Map(mapContainer.current, options);

      locations.forEach(location => {
        const markerPosition = new naver.maps.LatLng(location.mapy, location.mapx);
        const marker = new naver.maps.Marker({
          position: markerPosition,
          map,
          title: location.placeTitle,
        });

        // 마커 클릭 이벤트 추가(위치 선택)
        naver.maps.Event.addListener(marker, 'click', () => {
          axios.post('http://localhost:4040/api/v1/getjson/getplacetitle', {
            placeTitle: location.placeTitle,
            placeMapx: location.mapx,
            placeMapy: location.mapy
          })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
        });
      });
    }
  }, [locations]);

  useEffect(() => {
    // 맵 데이터를 가져오기
    axios.get('http://localhost:4040/api/v1/getmap')
      .then(response => {
        mapData.current = response.data;
        initializeMap();
      })
      .catch(error => console.error('Error fetching map data:', error));
  }, [initializeMap]);

  // 선택한 위치 중심으로 카테고리별 추천 장소 출력
  const category = (value) => {
    axios.post('http://localhost:4040/api/v1/getjson/getplacecat', {
      placeCat: value
    })
    .then(response => {
      console.log('Category Data:', response.data);
      const fetchedItems = response.data.map(place => ({
        id: place.placeNo,
        img: place.firstImage,
        title: place.placeTitle,
      }));
      setItems(fetchedItems);  
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  // 장소 리스트 슬라이드
  const nextItems = () => {
    if (currentIndex + 4 < items.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  const prevItems = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  //찜 버튼
  const favoriteplace = (item) => {
    if(userId) {
      axios.post('http://localhost:4040/api/v1/getmyfavorite', {
      placeNo: item.id,
      userId: userId
    })
    .then(response => {
      if(response.data === "already favorited") {
          alert("이미 찜한 장소입니다!");
      } else if(response.data === "success favorite") {
          alert("성공적으로 찜하였습니다!");
      }
    })
    .catch(error => {
      console.error("찜 처리 중 오류가 발생했습니다:", error);
    });
    } else {
      alert("로그인 후 이용가능합니다!");
    }
    
  };

  return (
    <div className='mainupper'>
      <img className='welcome' src={welcome} />
      <div className='recommendplace'>
        <h2>강추에서 추천하는 장소!</h2>
      </div>
      {/* 맵 api */}
      <div className="map-containers">
        <div ref={mapContainer} className="map"></div>
        <div className="button-container">
          <button onClick={() => category('activity')} className="button">액티비티</button>
          <button onClick={() => category('restaurant')} className="button">식당</button>
          <button onClick={() => category('cafe')} className="button">카페</button>
          <button onClick={() => category('tour')} className="button">관광지</button>
          <button onClick={() => category('accommodation')} className="button">숙박</button>
        </div>
      </div>

      {/* 장소 리스트 */}
      <div className="main-cards-container">
        <div className="carousel-container">
          <button className={`prev-button ${currentIndex === 0 ? 'hidden' : ''}`} onClick={prevItems}>
            <img src={leftArrow} alt="Previous" />
          </button>

          <div className="carousel">
            {items.slice(currentIndex, currentIndex + 4).map((item) => (
              <div key={item.id} className="carousel-item">
                <div className="image-container">
                  <img className="place" src={item.img || defaultImage} alt={item.title} onError={(e) => e.target.style.display='none'} />
                  <img className="favoriteplace" src={favorite} alt="favorite" onClick={() => favoriteplace(item)} />
                </div>
                <p>{item.title}</p>
              </div>
              
            ))}
          </div>
          <button className={`next-button ${currentIndex + 4 >= items.length ? 'hidden' : ''}`} onClick={nextItems}>
            <img src={rightArrow} alt="Next" />
          </button>
        </div>
      </div>

      <div className='Weather'>
                <h2>날씨 전망</h2>
            </div>
    </div>
  );
}

export default MainUpper;
