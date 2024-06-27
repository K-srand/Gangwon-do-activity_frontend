import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <Container fluid className="footer bg-light mt-4">
      <Row>
        <Col md={12} className="text-center">
          <p>
            서울특별시 강남구 테헤란로 322 강남역 000층 | 대표전화 : 02-0000-0000 | 팩스 : 02-0000-0000
          </p>
          <p>
            대표이사 : 000 | 개인정보책임자 : 000 | 사업자등록번호 : 000-00-00000 | 대표메일 : info@example.com
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
