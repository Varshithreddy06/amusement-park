import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, remove, onValue, push, get } from "firebase/database";

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

  const joinQueue = async (rideId) => {
    try {
      const queueRef = ref(db, `rides/${rideId}/queue`);
      const queueSnapshot = await get(queueRef);

      if (queueSnapshot.exists()) {
        const queueData = queueSnapshot.val();
        const isUserInQueue = Object.values(queueData).some(
          (userInQueue) => userInQueue.userId === user.id
        );

        if (!isUserInQueue) {
          await push(queueRef, {
            userId: user.id,
            userName: user.name,
            timestamp: Date.now(),
          });
          alert("You have successfully joined the queue.");
        } else {
          alert("You are already in the queue.");
        }
      } else {
        // If queue doesn't exist, add the user as the first entry
        await push(queueRef, {
          userId: user.id,
          userName: user.name,
          timestamp: Date.now(),
        });
        alert("You have successfully joined the queue.");
      }
    } catch (error) {
      console.error("Error joining queue:", error);
      alert("Failed to join the queue. Please try again later.");
    }
  };

  const leaveQueue = async (rideId) => {
    try {
      const queueRef = ref(db, `rides/${rideId}/queue`);
      const queueSnapshot = await get(queueRef);

      if (queueSnapshot.exists()) {
        const queueData = queueSnapshot.val();
        const userEntryKey = Object.keys(queueData).find(
          (key) => queueData[key].userId === user.id
        );

        if (userEntryKey) {
          await remove(ref(db, `rides/${rideId}/queue/${userEntryKey}`));
          alert("You have successfully left the queue.");
        } else {
          alert("You are not in the queue.");
        }
      }
    } catch (error) {
      console.error("Error leaving queue:", error);
      alert("Failed to leave the queue. Please try again later.");
    }
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
          <Col key={ride.id} md={6} className="mb-3">
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
                {/* Display Queue Length */}
                <Card.Text>
                  <strong>Queue Length:</strong>{" "}
                  {ride.queue ? Object.keys(ride.queue).length : 0}
                </Card.Text>
                {/* Join Queue Button */}
                <div className="d-flex justify-content-end">
                  <Button
                    onClick={() => joinQueue(ride.id)}
                    className="bg-success border-0 me-2"
                  >
                    Join Queue <i className="fa-solid fa-ticket"></i>
                  </Button>
                  <Button
                    onClick={() => leaveQueue(ride.id)}
                    className="bg-danger border-0 me-2"
                  >
                    Leave Queue <i className="fa-solid fa-times"></i>
                  </Button>
                  {user.role === "admin" && (
                    <>
                      <Button
                        as={Link}
                        to={`/edit-ride/${ride.id}`}
                        className="bg-secondary border-0 me-2"
                      >
                        Edit Ride{" "}
                        <i className="fa-regular fa-pen-to-square"></i>
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(ride)}
                      >
                        Delete Ride <i className="fa-solid fa-trash"></i>
                      </Button>
                    </>
                  )}
                </div>
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
