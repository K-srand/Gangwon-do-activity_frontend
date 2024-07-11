import React from 'react';
import '../../assets/styles/Footer.css';  // 상대 경로로 CSS 파일 import

const Footer = () => {
  return (
    <footer className="footer">
      <hr className="footer-divider" />  {/* 구분선 추가 */}
      <div className="footer-header">
        <h2>멀캠 2조 낌씸박이</h2>
      </div>
      <div className="footer-content">
        <p>
          서울특별시 강남구 테헤란로 212 17층<br />
          사업자 등록번호 0000 | 직업정보제공사업 0000~ | 통신판매업 0000~<br />
          대표 김수지 | 김예원 | 심재혁 | 심규진 | 박민호 | 이정석<br />
          대표번호 010-1111-1111 | 교육 등록 문의 010-2222-2222 | 광고제휴
        </p>
      </div>
    </footer>
  );
};

export default Footer;
