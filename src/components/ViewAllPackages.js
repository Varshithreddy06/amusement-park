import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, remove } from "firebase/database";

const ViewAllPackages = ({ user, packages, setPackages }) => {
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
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPackageToDelete(null);
  };

  return (
    <Container className="p-5 dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4">View All Packages</h2>
        {user.role === "admin" && (
          <Link to="/add-package">
            <Button className="bg-primary mb-4">
              Add New Package <i className="fa-solid fa-plus ms-2"></i>
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
                <Card.Text className="text-muted">
                  {pkg.description}
                  {pkg.name === "Group Package" && (
                    <span className="text-muted d-block mt-2">
                      <i className="fa-solid fa-users secondary-color"></i>{" "}
                      Limit: 10 people
                    </span>
                  )}
                </Card.Text>
                <Card.Text className="d-flex align-items-center">
                  <i className="fa-solid fa-dollar-sign me-2 secondary-color"></i>{" "}
                  <strong className="me-1">Price:</strong> {pkg.price}
                </Card.Text>
                <Card.Text className="d-flex align-items-center">
                  <i className="fa-solid fa-clock me-2 secondary-color"></i>{" "}
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
                      <i className="fa-regular fa-pen-to-square color-white"></i>
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(pkg)}>
                      Delete <i className="fa-solid fa-trash color-white"></i>
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
