import React, { useState } from 'react';
import '../../assets/styles/Main.css';
import logo from '../../assets/images/MainLogo.png';
import leftArrow from '../../assets/images/MainLeftArrow.png';
import rightArrow from '../../assets/images/MainRightArrow.png';

const items = [
  { id: 1, img: logo, title: '강촌 레일 파크' },
  { id: 2, img: logo, title: '비발디파크 오션월드' },
  { id: 3, img: logo, title: '원주 한지테마파크' },
  { id: 4, img: logo, title: '간현관광지' },
  { id: 5, img: logo, title: 'Item 5' },
  { id: 6, img: logo, title: 'Item 6' },
  { id: 7, img: logo, title: 'Item 7' },
  { id: 8, img: logo, title: 'Item 8' },
  { id: 9, img: logo, title: 'Item 9' },
  { id: 10, img: logo, title: 'Item 10' },
];

const Main = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className='main-cards-container'>
      <div className="carousel-container">
        <button className="prev-button" onClick={prevItems} disabled={currentIndex === 0}>  
          <img src={leftArrow} alt="Previous" />
        </button>
        <div className="carousel">
          {items.slice(currentIndex, currentIndex + 4).map((item) => (
            <div key={item.id} className="carousel-item">
              <img src={item.img} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))}
        </div>
        <button className="next-button" onClick={nextItems} disabled={currentIndex + 4 >= items.length}>
          <img src={rightArrow} alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default Main;
