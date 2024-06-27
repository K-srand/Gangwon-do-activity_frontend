import React from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import '../../assets/styles/Header.css';
import logo from '../../assets/images/MainLogo.png';

const Header = () => {
  return (
    <header>
      <Container className="gnb-container">
        <Row className="align-items-center">
          <Col xs={6} md={4} className="d-flex align-items-center">
            <Navbar.Brand href="#home" className="gnb-brand">
              <img src={logo} alt="Logo" className="gnb-logo" />
              <span className="gnb-title">액티비티 강추</span>
            </Navbar.Brand>
          </Col>
          <Col xs={6} md={8} className="text-end">
            <Nav className="gnb-auth-links">
              <Nav.Link href="#login" className="gnb-link">00님 / 로그인</Nav.Link>
              <span className="gnb-divider">|</span>
              <Nav.Link href="#mypage" className="gnb-link">마이페이지</Nav.Link>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col>
            <Nav className="justify-content-center gnb-links">
              <Nav.Link href="#intro" className="gnb-link">사이트 소개</Nav.Link>
              <span className="gnb-divider">|</span>
              <Nav.Link href="#community" className="gnb-link">커뮤니티</Nav.Link>
              <span className="gnb-divider">|</span>
              <Nav.Link href="#recommended-courses" className="gnb-link">사용자 추천 코스</Nav.Link>
              <span className="gnb-divider">|</span>
              <Nav.Link href="#create-course" className="gnb-link">나만의 코스 만들기</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
