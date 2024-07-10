import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";
import '../../assets/styles/MainPage.css';
import leftArrow from '../../assets/images/MainLeftArrow.png';
import rightArrow from '../../assets/images/MainRightArrow.png';

function MainUpper() {
  const mapContainer = useRef(null);
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    axios.get('http://localhost:4040/api/v1/getjson/getplace')
      .then(response => {
        console.log('Fetched Data:', response.data);  
        setLocations(response.data);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  //액티비티 10개 추천
  useEffect(() => {
    if (locations.length > 0 && window.naver) {
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

  //선택한 위치 중심으로 카테고리별 추천 장소 출력
  function category(value) {
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
      setItems(fetchedItems);  // 응답 데이터를 items로 설정
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }

  //장소 리스트 슬라이드
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

  return (
    <div>
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
          <button className="prev-button" onClick={prevItems} disabled={currentIndex === 0}>
            <img src={leftArrow} alt="Previous" />
          </button>
          <div className="carousel">
            {items.slice(currentIndex, currentIndex + 4).map((item) => (
              <div key={item.id} className="carousel-item">
                <img src={item.img} alt={item.title} onError={(e) => e.target.style.display='none'} />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
          <button className="next-button" onClick={nextItems} disabled={currentIndex + 4 >= items.length}>
            <img src={rightArrow} alt="Next" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainUpper;
