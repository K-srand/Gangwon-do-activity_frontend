import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';


function MainPage() {

  return (
    <div>
      <Container fluid className="p-0">
        <Row>
          <Col>
            <Image src="" fluid />
            <div className="header-text">
              <h1>강원도로 오세요!</h1>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <h2 className="mt-4">강추에서 추천하는 장소!</h2>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="image1.jpg" />
              <Card.Body>
                <Card.Title>박소리리캠핑장</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="image2.jpg" />
              <Card.Body>
                <Card.Title>정라이트아트페크</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="image3.jpg" />
              <Card.Body>
                <Card.Title>발발해회캠핑장</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container className="my-course">
        <h2>나만의 코스 시작해보기</h2>
        <Row>
          <Col md={6}>
            <Button variant="primary" block>액티비티</Button>
          </Col>
          <Col md={6}>
            <Button variant="primary" block>카페 / 찻집</Button>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}>
            <Button variant="primary" block>숙소 예약</Button>
          </Col>
          <Col md={6}>
            <Button variant="primary" block>카페 / 찻집</Button>
          </Col>
        </Row>
      </Container>

      <Container className="weather mt-4">
        <h2>오늘의 날씨는?</h2>
        <Row>
          <Col md={12}>
            <div className="weather-info">
              <h3>24°C</h3>
              <p>맑음 (금요일) 오전 11:00 구름 조금</p>
            </div>
            <div className="weather-forecast">
              <p>기온 | 강수확률 | 바람</p>
              <div className="forecast-chart">
                {/* Include your weather chart here */}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MainPage;
