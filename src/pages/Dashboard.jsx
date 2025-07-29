import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useAdmin } from "../context/AdminContext";

export default function Dashboard() {
  const [stats, setStats] = useState({ cars: 0, users: 0, rentals: 0 });
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!isAdmin) {
    return <div className="text-center mt-5">Access denied. Admin privileges required.</div>;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
          <p className="text-muted">Overview of your platform statistics</p>
        </Col>
      </Row>
      
      <Row>
        <Col md={4} className="mb-3">
          <StatCard title="Total Cars" value={stats.cars} icon="🚗" color="success" />
        </Col>
        <Col md={4} className="mb-3">
          <StatCard title="Total Users" value={stats.users} icon="👥" color="info" />
        </Col>
        <Col md={4} className="mb-3">
          <StatCard title="Total Rentals" value={stats.rentals} icon="📝" color="warning" />
        </Col>
      </Row>
    </Container>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card className={`bg-${color} text-white`}>
      <Card.Body className="d-flex justify-content-between">
        <div>
          <h5>{title}</h5>
          <h2 className="mb-0">{value}</h2>
        </div>
        <span className="display-4">{icon}</span>
      </Card.Body>
    </Card>
  );
}