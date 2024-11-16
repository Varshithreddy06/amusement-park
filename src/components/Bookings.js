import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, remove, get } from "firebase/database";

const ViewAllBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const dbRef = ref(db, "bookings");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const bookingsData = snapshot.val();
      const tempBookings = Object.keys(bookingsData).map((id) => ({
        ...bookingsData[id],
        id,
        date: new Date(bookingsData[id].timestamp).toISOString().split("T")[0],
      }));
      setBookings(tempBookings);
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  //   rideId: selectedRide.id, rideName
  //   userId: user.id,
  //   userName: user.name,
  //   timestamp: Date.now(),

  return (
    <Container className="p-5 dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4">View All Bookings</h2>
      </div>
      <Row>
        {bookings.map((booking) => (
          <Col key={booking.id} md={4} className="mb-4">
            <Card className="packages h-100 shadow-sm">
              <Card.Body>
                <Card.Img
                  variant="top"
                  src={booking.rideImg}
                  alt={booking.rideName}
                />
                <Card.Title className="d-flex justify-content-start align-items-center mt-2">
                  <em class="fa-solid fa-book-bookmark me-2" />{" "}
                  {booking.rideName}
                </Card.Title>
                <Card.Text className="text-muted">{booking.date}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ViewAllBookings;
