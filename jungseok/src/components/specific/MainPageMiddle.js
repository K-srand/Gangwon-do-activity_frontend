import React from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import '../../assets/styles/MainPage.css';

const MainPage = () => {
  return (
    <Container fluid className="main-content">
      <Row>
        <Col>
          <Card className="bg-dark text-white">
            <Card.Img src="your-image-url.jpg" alt="Card image" />
            <Card.ImgOverlay>
              <Card.Title>강원도로 오세요!</Card.Title>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>강원도에서 추천하는 명소</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_URL"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Recommended Places"
          ></iframe>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>추천 명소</h3>
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src="your-image-url.jpg" alt="First slide" />
              <Carousel.Caption>
                <h3>첫 번째 명소</h3>
                <p>설명...</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="your-image-url.jpg" alt="Second slide" />
              <Carousel.Caption>
                <h3>두 번째 명소</h3>
                <p>설명...</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="your-image-url.jpg" alt="Third slide" />
              <Carousel.Caption>
                <h3>세 번째 명소</h3>
                <p>설명...</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

     

      <Row className="mt-4">
        <Col>
          <h3>사용자 추천 장소</h3>
          <Row>
            <Col xs={12} md={6} lg={3}>
              <Card>
                <Card.Img variant="top" src="your-image-url.jpg" />
                <Card.Body>
                  <Card.Title>장소 1</Card.Title>
                  <Card.Text>설명...</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card>
                <Card.Img variant="top" src="your-image-url.jpg" />
                <Card.Body>
                  <Card.Title>장소 2</Card.Title>
                  <Card.Text>설명...</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card>
                <Card.Img variant="top" src="your-image-url.jpg" />
                <Card.Body>
                  <Card.Title>장소 3</Card.Title>
                  <Card.Text>설명...</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card>
                <Card.Img variant="top" src="your-image-url.jpg" />
                <Card.Body>
                  <Card.Title>장소 4</Card.Title>
                  <Card.Text>설명...</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>일정표 보기</h3>
          <iframe
            src="https://calendar.google.com/calendar/embed?YOUR_CALENDAR_EMBED_URL"
            style={{ border: 0 }}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="Schedule"
          ></iframe>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
