import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, remove } from "firebase/database";

const ViewAllRides = ({ user, rides, setRides, loadRides }) => {
  const [showModal, setShowModal] = useState(false);
  const [rideToDelete, setRideToDelete] = useState(null);

  const handleDelete = (ride) => {
    setRideToDelete(ride);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (rideToDelete) {
      const dbRef = ref(db, "rides/" + rideToDelete.id);
      await remove(dbRef);

      setRides((prevRides) =>
        prevRides.filter((ride) => ride.id !== rideToDelete.id)
      );
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setRideToDelete(null);
  };

  useEffect(() => {
    loadRides();
  }, []);

  return (
    <Container className="p-5 dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4">View All Rides</h2>
        {user.role === "admin" && (
          <Link to="/add-ride">
            <Button className="bg-primary mb-4">
              Add New Ride<i className="fa-solid fa-plus ms-2"></i>
            </Button>
          </Link>
        )}
      </div>
      <Row>
        {rides.map((ride) => (
          <Col key={ride.id} md={4} className="mb-3">
            <Card className="rides">
              <Card.Img variant="top" src={ride.image} />
              <Card.Body>
                <Card.Title>{ride.name}</Card.Title>
                <Card.Text>{ride.description}</Card.Text>
                {ride.latitude && ride.longitude && (
                  <Card.Text>
                    <strong>Location:</strong> Lat {ride.latitude}, Lng{" "}
                    {ride.longitude}
                  </Card.Text>
                )}
                {user.role === "admin" && (
                  <div className="d-flex justify-content-end">
                    <Button
                      as={Link}
                      to={`/edit-ride/${ride.id}`}
                      className="bg-secondary border-0 me-2"
                    >
                      Edit Ride <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(ride)}>
                      Delete Ride <i className="fa-solid fa-trash"></i>
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the ride{" "}
          <strong>{rideToDelete ? rideToDelete.name : ""}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewAllRides;
