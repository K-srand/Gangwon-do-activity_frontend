import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../assets/styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={6}>
            <p>연락처 정보와 기타 내용...</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>추가 정보 또는 링크...</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
