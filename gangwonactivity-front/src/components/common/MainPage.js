import React, { useRef, useEffect, useState } from 'react';
import axios from "axios"
import "../../assets/styles/MainPage.css"


function MainPage() {
  const mapContainer = useRef(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    axios.get('http://localhost:4040/api/v1/getjson/getplace')
      .then(response => {
        console.log('Fetched Data:', response.data);  // 데이터 확인
        setLocations(response.data);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    if (locations.length > 0 && window.naver) {
      const { naver } = window;

      const initialLocation = new naver.maps.LatLng(38.0431160103, 128.2067618712);
      const options = {
        center: initialLocation,
        zoom: 8, // 적절한 줌 레벨로 조정
      };
      const map = new naver.maps.Map(mapContainer.current, options);


      locations.forEach(location => {
        const markerPosition = new naver.maps.LatLng(location.mapy, location.mapx);
        const marker = new naver.maps.Marker({
          position: markerPosition,
          map,
          title: location.placeTitle,
        });
        // 마커 클릭 이벤트 추가
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

  function category(value) {
    axios.post('http://localhost:4040/api/v1/getjson/getplacecat', {
          placeCat: value
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
  }


  return (
    <div className="map-container">
      <div ref={mapContainer} className="map"></div>
      <div className="button-container">
        <button onClick={() => category('activity')} className="button">액티비티</button>
        <button onClick={() => category('restaurant')} className="button">식당</button>
        <button onClick={() => category('cafe')} className="button" >카페</button>
        <button onClick={() => category('tour')} className="button">관광지</button>
        <button onClick={() => category('accommodation')} className="button">숙박</button>
      </div>
    </div>
  );
}

export default MainPage;
