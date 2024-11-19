import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, remove, get } from "firebase/database";

const ViewAllBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);

  const loadBookings = async () => {
    const dbRef = ref(db, "bookings");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const bookingsData = snapshot.val();
      const tempBookings = Object.keys(bookingsData)
        .map((id) => ({
          ...bookingsData[id],
          id,
          date: new Date(bookingsData[id].timestamp)
            .toISOString()
            .split("T")[0],
        }))
        .filter((booking) => booking.userId === user.id);
      setBookings(tempBookings);

      const dbRef1 = ref(db, "package_bookings");
      const snapshot1 = await get(dbRef1);
      if (snapshot1.exists()) {
        const packageBookingsData = snapshot1.val();
        const tempPackageBookings = Object.keys(packageBookingsData)
          .map((id) => ({
            ...packageBookingsData[id],
            id,
            date: new Date(packageBookingsData[id].timestamp)
              .toISOString()
              .split("T")[0],
          }))
          .filter((booking) => booking.userId === user.id);  
        setPackageBookings(tempPackageBookings);
      }
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <Container className="p-5 dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4">View Ride Bookings</h2>
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
        {bookings?.length === 0 && (
          <span className="ms-2">No bookings available</span>
        )}
      </Row>

      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4 mt-5">View Package Bookings</h2>
      </div>
      <Row>
        {packageBookings.map((booking) => (
          <Col key={booking.id} md={4} className="mb-4">
            <Card className="packages h-100 shadow-sm">
              <Card.Body>
                <Card.Img
                  variant="top"
                  src={booking.img}
                  alt={booking.packageName}
                />
                <Card.Title className="d-flex justify-content-start align-items-center mt-2">
                  <em class="fa-solid fa-book-bookmark me-2" />{" "}
                  {booking.packageName}
                </Card.Title>
                <Card.Text className="text-muted">{booking.date}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {packageBookings?.length === 0 && (
          <span className="ms-2">No bookings available</span>
        )}
      </Row>
    </Container>
  );
};

export default ViewAllBookings;
