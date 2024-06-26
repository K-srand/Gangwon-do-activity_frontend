import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function MyNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/community">
            <Nav.Link>커뮤니티</Nav.Link>
          </LinkContainer>
          <Nav.Link href="#reviews">이용후기보기</Nav.Link>
          <Nav.Link href="#about">페이지소개</Nav.Link>
          <Nav.Link href="#custom-course">나만의 코스 만들기</Nav.Link>
          <Nav.Link href="#help">도움말/지원</Nav.Link>
        </Nav>
        <Nav>
          <LinkContainer to="/login">
            <Nav.Link>로그인/회원가입</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MyNavbar;
