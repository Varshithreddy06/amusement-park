import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, remove } from "firebase/database";

const ViewAllPackages = ({
  user,
  packages,
  setPackages,
  rides,
  loadPackages,
  loadRides,
  addNotification,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const handleDelete = (pkg) => {
    setPackageToDelete(pkg);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (packageToDelete) {
      const dbRef = ref(db, "packages/" + packageToDelete.id);
      await remove(dbRef);
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== packageToDelete.id)
      );

      addNotification(`Package: ${packageToDelete.name} has been removed.`);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPackageToDelete(null);
  };

  useEffect(() => {
    loadPackages();
    loadRides();
  }, []);

  return (
    <Container className="p-5 dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4">View All Packages</h2>
        {user.role === "admin" && (
          <Link to="/add-package">
            <Button className="bg-primary mb-4">
              Add New Package <em className="fa-solid fa-plus ms-2"></em>
            </Button>
          </Link>
        )}
      </div>
      <Row>
        {packages.map((pkg) => (
          <Col key={pkg.id} md={4} className="mb-4">
            <Card className="packages h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={pkg.image || "https://via.placeholder.com/150"}
                alt={`${pkg.name} image`}
              />
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  {pkg.name}
                </Card.Title>
                <Card.Text className="text-muted">{pkg.description}</Card.Text>
                <Card.Text className="d-flex align-items-center">
                  <em
                    className="fa-solid fa-plane-departure me-2 secondary-color"
                    style={{ marginRight: "8px" }}
                  ></em>
                  <strong className="me-1">Rides:</strong>
                  <div>
                    {pkg.rides.map((rideId, index) => {
                      const ride = rides.find((r) => r.id === rideId);
                      return ride ? (
                        <span
                          key={rideId}
                          className={index > 1 ? "d-inline" : ""}
                        >
                          {ride.name}
                          {index !== pkg.rides.length - 1 && (
                            <span className="me-1">,</span>
                          )}
                        </span>
                      ) : null;
                    })}
                  </div>
                </Card.Text>
                <Card.Text className="d-flex align-items-center">
                  <em className="fa-solid fa-dollar-sign me-2 secondary-color"></em>
                  <strong className="me-1">Price:</strong> {pkg.price}
                </Card.Text>
                <Card.Text className="d-flex align-items-center">
                  <em className="fa-solid fa-clock me-2 secondary-color"></em>
                  <strong className="me-1">Duration:</strong> {pkg.duration}
                </Card.Text>
                {user.role === "admin" && (
                  <div className="d-flex justify-content-end">
                    <Button
                      as={Link}
                      to={`/edit-package/${pkg.id}`}
                      className="bg-secondary border-0 me-2"
                    >
                      Edit{" "}
                      <em className="fa-regular fa-pen-to-square color-white"></em>
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(pkg)}>
                      Delete <em className="fa-solid fa-trash color-white"></em>
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
          Are you sure you want to delete the package{" "}
          <strong>{packageToDelete ? packageToDelete.name : ""}</strong>?
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

export default ViewAllPackages;
