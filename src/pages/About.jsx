import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';

export default function About() {
  return (
    <div className="about-page" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #0a192f 0%, #1e293b 100%)', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <style>{`
        .about-hero {
          background: linear-gradient(90deg, #2563eb 0%, #1e293b 100%);
          color: #fff;
          padding: 60px 0 40px 0;
          text-align: center;
        }
        .about-section {
          background: rgba(30, 41, 59, 0.85);
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(30,64,175,0.12);
          padding: 40px 30px;
          margin-top: -40px;
        }
        .about-title {
          font-size: 2.5rem;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .about-mission {
          color: #60a5fa;
          font-size: 1.2rem;
          font-weight: 500;
        }
        .about-team-card {
          background: rgba(59, 130, 246, 0.08);
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(30,64,175,0.10);
          border: none;
        }
      `}</style>
      <div className="about-hero">
        <h1 className="about-title mb-3">About AutoVortex</h1>
        <p className="about-mission mb-0">Premium Car Rentals. Exceptional Service. Unforgettable Journeys.</p>
      </div>
      <Container className="about-section mt-5">
        <Row className="mb-4">
          <Col md={7} className="mb-4 mb-md-0">
            <h2 className="text-white mb-3">Our Story</h2>
            <p className="text-light fs-5">
              AutoVortex was founded with a passion for driving and a commitment to delivering the best car rental experience. We believe that every journey should be memorable, whether it's a business trip, a family vacation, or a weekend getaway. Our fleet features a wide range of premium vehicles, all meticulously maintained and ready for your next adventure.
            </p>
            <p className="text-light fs-5">
              Our mission is to make luxury and comfort accessible to everyone, with transparent pricing, flexible options, and outstanding customer support. We are dedicated to innovation, safety, and exceeding your expectations at every turn.
            </p>
          </Col>
          <Col md={5} className="d-flex align-items-center justify-content-center">
            <Image src="https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=600&q=80" rounded fluid style={{ maxHeight: 260, boxShadow: '0 4px 24px rgba(30,64,175,0.18)' }} />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 className="text-white mb-4 text-center">Meet Our Team</h2>
            <Row className="justify-content-center">
              <Col md={4} className="mb-4">
                <Card className="about-team-card text-center p-3">
                  <Image src="https://randomuser.me/api/portraits/men/32.jpg" roundedCircle width={90} className="mx-auto mb-3" />
                  <Card.Title className="fw-bold">Ahmed Hassan</Card.Title>
                  <Card.Text className="text-light">Founder & CEO</Card.Text>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="about-team-card text-center p-3">
                  <Image src="https://randomuser.me/api/portraits/women/44.jpg" roundedCircle width={90} className="mx-auto mb-3" />
                  <Card.Title className="fw-bold">Sara Mohammed</Card.Title>
                  <Card.Text className="text-light">Operations Manager</Card.Text>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="about-team-card text-center p-3">
                  <Image src="https://randomuser.me/api/portraits/men/54.jpg" roundedCircle width={90} className="mx-auto mb-3" />
                  <Card.Title className="fw-bold">Khalid Abdullah</Card.Title>
                  <Card.Text className="text-light">Customer Success Lead</Card.Text>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}