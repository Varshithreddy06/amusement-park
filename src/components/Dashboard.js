import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { db } from "../firebase/config";
import { get, ref } from "firebase/database";

function Dashboard({ user, rides, setRides, loadRides, loadPackages }) {
  const [show, setShow] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  const handleClose = () => setShow(false);
  const handleAcceptRide = () => setShow(false);
  const handleShow = (ride) => {
    setSelectedRide(ride);
    setShow(true);
  };

  useEffect(() => {
    loadRides();
    loadPackages();
  }, []);

  return (
    <Container fluid className="dashboard p-0 m-0">
      <div className="p-3 d-flex justify-content-center align-items-center">
        <h2 className="primary-color">AMUSEMENT PARK</h2>
      </div>

      <section id="rides" className="p-5">
        <Row>
          {rides.slice(0, 3).map((ride) => (
            <Col key={ride.id} md={4}>
              <Card className="mb-3 rides">
                <Card.Img variant="top" src={ride.image} />
                <Card.Body>
                  <Card.Title>{ride.name}</Card.Title>
                  <Card.Text>{ride.description}</Card.Text>
                  {user.role === "user" && (
                    <Button
                      variant="primary"
                      className="bg-primary w-50"
                      onClick={() => handleShow(ride)}
                    >
                      View Ride
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}

          {rides.length === 0 && (
            <div className="fw-bold text-center">
              There are no rides currently
            </div>
          )}
        </Row>
      </section>

      {selectedRide && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRide.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedRide.image}
              alt={selectedRide.name}
              style={{ width: "100%", height: "auto" }}
            />
            <p className="mt-3">{selectedRide.description}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} className="bg-secondary border-0">
              Close
            </Button>
            <Button onClick={handleAcceptRide} className="bg-primary border-0">
              Book Ride
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <section id="package" className="w-100 p-0 m-0 my-5 p-3">
        <Row className="flex-row justify-content-center">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLnU_VzbtCmObeLBIlot8VXo8u9aHbgFTcjw&s"
                  alt="Family package"
                />
                <Card.Title>Family Package</Card.Title>
                <Card.Text>
                  Enjoy a fun-filled day with the whole family! This package
                  includes admission for 2 adults and 2 children, meal vouchers,
                  and fast pass access to select rides.
                </Card.Text>
                <Card.Text>
                  <strong>Price:</strong> $199.99
                </Card.Text>
                <Button className="bg-primary">Book Now</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFOQlx51CrzlSN_D6WgVkk98LiI9z3QX1NPw&s"
                  alt="Group Package"
                />
                <Card.Title>Group Package</Card.Title>
                <Card.Text>
                  Perfect for groups of 10 or more! This package includes
                  discounted admission, complimentary parking, and a group photo
                  pass to capture your memories.
                </Card.Text>
                <Card.Text>
                  <strong>Price:</strong> $599.99 (for 10 people)
                </Card.Text>
                <Button className="bg-primary">Book Now</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section id="contact" className="vw-100 bg-white p-0 m-0 p-5">
        <h2 className="text-center mb-4">Contact Us</h2>

        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <h4>Send Us a Message</h4>
                <Form>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" />
                  </Form.Group>

                  <Form.Group controlId="formSubject" className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Subject of your message"
                    />
                  </Form.Group>

                  <Form.Group controlId="formMessage" className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Write your message here..."
                    />
                  </Form.Group>

                  <Button className="bg-primary" type="submit">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <h4>Get in Touch</h4>
                <p>
                  We'd love to hear from you! Whether you have questions about
                  our park, need help with bookings, or want to share feedback,
                  feel free to reach out.
                </p>

                <h5>Contact Information</h5>
                <p>
                  <strong>Email:</strong> info@amusementpark.com
                </p>
                <p>
                  <strong>Phone:</strong> +123 456 7890
                </p>
                <p>
                  <strong>Address:</strong> 123 Park Avenue, Fun City, Amusement
                  Park
                </p>

                <h5>Follow Us</h5>
                <p>
                  <a href="#!" className="text-primary">
                    Facebook
                  </a>{" "}
                  |
                  <a href="#!" className="text-primary">
                    {" "}
                    Instagram
                  </a>{" "}
                  |
                  <a href="#!" className="text-primary">
                    {" "}
                    Twitter
                  </a>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          {/* Map Placeholder */}
          <Col>
            <Card>
              <Card.Body className="p-0">
                <iframe
                  title="Google Maps"
                  width="100%"
                  height="400"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093755!2d144.95373631568118!3d-37.817209742489825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e33!2sAmusement%20Park!5e0!3m2!1sen!2sus!4v1634742784619!5m2!1sen!2sus"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                ></iframe>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default Dashboard;
