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
import { get, ref, set } from "firebase/database";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import VirtualQueueList from "./VirtualQueueList";

// Custom marker icon setup
const customMarker = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

function Dashboard({
  user,
  rides,
  setRides,
  loadRides,
  packages,
  loadPackages,
}) {
  const [show, setShow] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: user.name,
    message: "",
    userid: user.id,
  });
  const [bookingShow, setBookingShow] = useState(false); // New state for booking confirmation
  const [packageBookingShow, setPackageBookingShow] = useState(false); // New state for package booking confirmation
  const [messageSent, setMessageSent] = useState(false); // State to track message submission
  const [reviewShow, setReviewShow] = useState(false);
  const [review, setReview] = useState({ rideId: "", rating: 0, comment: "" });
  const [reviews, setReviews] = useState([]); // To hold reviews fetched from Firebase

  const handleClose = () => setShow(false);
  const handleAcceptRide = async () => {
    try {
      const bookingRef = ref(db, "bookings/" + Date.now()); // Unique key for booking
      await set(bookingRef, {
        rideId: selectedRide.id,
        rideName: selectedRide.name,
        rideImg: selectedRide.image,
        userId: user.id,
        userName: user.name,
        timestamp: Date.now(),
      });
      setBookingShow(true); // Show booking confirmation dialog
      setShow(false); // Close ride details modal
    } catch (error) {
      console.error("Error booking ride: ", error);
    }
  };
  const handleShow = (ride) => {
    setSelectedRide(ride);
    setShow(true);
  };
  const handleBookingClose = () => setBookingShow(false); // Close booking confirmation

  const handleBookPackage = async (pkg) => {
    try {
      const packageBookingRef = ref(db, "package_bookings/" + Date.now());
      await set(packageBookingRef, {
        packageId: pkg.id,
        userId: user.id,
        userName: user.name,
        timestamp: Date.now(),
      });
      setPackageBookingShow(true); // Show package booking confirmation dialog
    } catch (error) {
      console.error("Error booking package: ", error);
    }
  };
  const handlePackageBookingClose = () => setPackageBookingShow(false); // Close package booking modal

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save the message to Firebase
      const messageRef = ref(db, "messages/" + Date.now()); // Unique key based on timestamp
      await set(messageRef, contactForm);
      setMessageSent(true); // Set message sent state to true
      // Clear the form after submission
      setContactForm({
        name: user.name, // Reset to user's name
        message: "",
        userid: user.id,
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      // Optionally, you can handle error notifications here
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const rideRef = ref(db, `rides/${selectedRide.id}`); // Unique key for each review
      const updatedReviews = selectedRide?.reviews
        ? [...selectedRide.reviews, review]
        : [review];
      await set(rideRef, {
        ...selectedRide,
        reviews: updatedReviews,
      });
      setReview({ rideId: "", rating: 0, comment: "" }); // Reset review state
      setReviewShow(false); // Close modal
    } catch (error) {
      console.error("Error submitting review: ", error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsRef = ref(db, `reviews/${selectedRide.id}`);
      const snapshot = await get(reviewsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setReviews(Object.values(data)); // Convert to array
      } else {
        setReviews([]);
      }
    };

    if (selectedRide) {
      fetchReviews();
    }
  }, [selectedRide]);

  useEffect(() => {
    loadRides();
    loadPackages();
  }, []);

  return (
    <Container fluid className="dashboard p-0 m-0">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title text-dark">
          Welcome to <span className="primary-color">AMUSEMENT PARK</span>
        </h1>
        <p className="hero-description text-dark">
          Experience the thrill of our rides and the joy of our packages.
          Unforgettable memories await you!
        </p>
        <Button className="hero-button bg-primary" href="#rides">
          Explore Rides
        </Button>
      </section>

      <section className="map-section p-5">
        <h3 className="text-center mb-4">Explore Ride Locations</h3>
        <MapContainer
          center={[32.75154366516178, -97.07096235517302]} // Set initial center based on your park's location
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {rides.map((ride) => (
            <Marker
              key={ride.id}
              position={[ride.latitude, ride.longitude]}
              icon={customMarker}
            >
              <Popup>
                <strong>{ride.name}</strong>
                <p>{ride.description}</p>
                {user.role === "user" && (
                  <Button
                    variant="primary"
                    className="bg-primary mt-2"
                    onClick={() => handleShow(ride)}
                  >
                    View Ride
                  </Button>
                )}
                <VirtualQueueList rideId={ride.id} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      <section id="rides" className="p-5">
        <h3 className="text-center text-dark mb-2">RIDES</h3>{" "}
        {/* Rides Heading */}
        <Row>
          {rides.slice(0, 3).map((ride) => (
            <Col key={ride.id} md={4}>
              <Card className="mb-3 rides">
                <Card.Img variant="top" src={ride.image} alt={ride.name} />
                <Card.Body>
                  <Card.Title>{ride.name}</Card.Title>
                  <Card.Text>{ride.description}</Card.Text>

                  {ride?.reviews && (
                    <>
                      <h6>Reviews:</h6>
                      {ride.reviews.map((rev, index) => (
                        <div key={index} className="review">
                          <p>
                            {rev.comment}{" "}
                            <span className="ms-2">
                              {rev.rating}{" "}
                              <em class="fa-solid fa-star text-warning" />
                            </span>
                          </p>
                        </div>
                      ))}
                    </>
                  )}

                  {user.role === "user" && (
                    <Button
                      variant="primary"
                      className="bg-primary w-50"
                      onClick={() => handleShow(ride)}
                    >
                      View Ride
                    </Button>
                  )}

                  <Button
                    variant="primary"
                    className="bg-primary w-50"
                    onClick={() => {
                      setReviewShow(true);
                      setSelectedRide(ride);
                      setReview({ rideId: ride.id });
                    }}
                  >
                    Write a Review
                  </Button>
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

      <section id="packages" className="w-100 p-0 m-0 my-5 p-3">
        <h3 className="text-center text-dark mb-2">PACKAGES</h3>{" "}
        <Row className="flex-row justify-content-center">
          {packages.slice(0, 2).map((pkg, index) => (
            <Col key={index} md={4}>
              <Card className="h-100">
                <Card.Body>
                  <img
                    src={pkg.image} // Ensure your package object has an image property
                    alt={pkg.name}
                  />
                  <Card.Title className="mt-2">{pkg.name}</Card.Title>
                  <Card.Text>{pkg.description}</Card.Text>
                  <Card.Text className="d-flex align-items-center">
                    <em className="fa-solid fa-dollar-sign me-2 secondary-color"></em>
                    <strong className="me-1">Price:</strong> {pkg.price}
                  </Card.Text>
                  <Card.Text className="d-flex align-items-center">
                    <em className="fa-solid fa-clock me-2 secondary-color"></em>
                    <strong className="me-1">Duration:</strong> {pkg.duration}
                  </Card.Text>
                  <Button
                    className="bg-primary"
                    onClick={() => handleBookPackage(pkg)}
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {packageBookingShow && (
        <Modal show={packageBookingShow} onHide={handlePackageBookingClose}>
          <Modal.Header closeButton>
            <Modal.Title>Package Booking Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your package has been booked successfully!</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handlePackageBookingClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <section id="contact" className="vw-100 bg-white p-0 m-0 p-5">
        <h2 className="text-center mb-4">Contact Us</h2>

        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <h4>Send Us a Message</h4>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group controlId="formMessage" className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Write your message here..."
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Send Message
                  </Button>
                  {messageSent && (
                    <p className="text-success mt-2">
                      Message sent successfully!
                    </p>
                  )}
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

        {/* Booking Confirmation Modal */}
        <Modal show={bookingShow} onHide={handleBookingClose}>
          <Modal.Header closeButton>
            <Modal.Title>Booking Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Your booking for {selectedRide?.name} has been confirmed!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleBookingClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={reviewShow} onHide={() => setReviewShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Write a Review for {selectedRide?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group controlId="formRating">
                <Form.Label>Rating (1-5)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  name="rating"
                  value={review.rating}
                  onChange={handleReviewChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formComment">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comment"
                  value={review.comment}
                  onChange={handleReviewChange}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="bg-primary mt-2 w-100"
              >
                Submit Review
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

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
