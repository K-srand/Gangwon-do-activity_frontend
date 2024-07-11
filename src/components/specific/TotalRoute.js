import React, { useRef, useEffect } from 'react';
import "../../assets/styles/CreateMyCourse.css"
// import axios from "axios"

function TotalRoute() {
    const mapContainer = useRef(null);

    useEffect(() => {
          const { naver } = window;
    
          const initialLocation = new naver.maps.LatLng(38.0431160103, 128.2067618712);
          const options = {
            center: initialLocation,
            zoom: 8, // 적절한 줌 레벨로 조정
          };
          const map = new naver.maps.Map(mapContainer.current, options);
          
    });

    return(
        <div className='CreateMyCourse'>
          <div className="TotalRoute">
            <h2>경로 총정리</h2>
          </div>
          
          <div className='map-container'>
            <div ref={mapContainer} className="map"></div>
          </div>
        </div>
    );
}

export default TotalRoute;