import { ref, set } from "firebase/database";
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/config";

const EditRide = ({ user, rides, setRides, addNotification }) => {
  const [rideDetails, setRideDetails] = useState({
    name: "",
    description: "",
    image: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  if (user.role !== "admin") {
    navigate("/");
  }

  useEffect(() => {
    const ride = rides.find((ride) => ride.id === id);
    if (ride) {
      setRideDetails(ride);
    }
  }, [id, rides]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideDetails({ ...rideDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !rideDetails.name ||
      !rideDetails.description ||
      !rideDetails.image ||
      !rideDetails.latitude ||
      !rideDetails.longitude
    ) {
      setError("All fields are required.");
      return;
    }

    if (!isValidURL(rideDetails.image)) {
      setError("Please enter a valid image URL.");
      return;
    }

    // Parse latitude and longitude to numbers and validate
    const latitude = parseFloat(rideDetails.latitude);
    const longitude = parseFloat(rideDetails.longitude);
    if (isNaN(latitude) || isNaN(longitude)) {
      setError("Please enter valid numeric values for latitude and longitude.");
      return;
    }

    const rideRef = ref(db, "rides/" + rideDetails.id);
    await set(rideRef, {
      name: rideDetails.name,
      description: rideDetails.description,
      image: rideDetails.image,
      latitude,
      longitude,
    });

    addNotification(
      `Ride: ${rideDetails.name} has been updated! Please find the new details in Rides tab.`
    );

    setRides((prevRides) =>
      prevRides.map((ride) => (ride.id === id ? rideDetails : ride))
    );

    setError("");
    navigate("/view-all-rides");
  };

  const isValidURL = (string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?(www\\.)?([\\w-]+\\.)+[\\w-]+(\\/\\S*)?$"
    );
    return urlPattern.test(string);
  };

  return (
    <Container className="p-5 vh-100 edit-ride">
      <div className="bg-white p-5 rounded shadow">
        <h2 className="mb-4">Edit Ride</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formRideName" className="mb-3">
            <Form.Label>Ride Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={rideDetails.name}
              onChange={handleChange}
              placeholder="Enter ride name"
              required
            />
          </Form.Group>

          <Form.Group controlId="formRideDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={rideDetails.description}
              onChange={handleChange}
              placeholder="Enter ride description"
              required
            />
          </Form.Group>

          <Form.Group controlId="formRideImage" className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={rideDetails.image}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
            />
          </Form.Group>

          <Form.Group controlId="formRideLatitude" className="mb-3">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="text"
              name="latitude"
              value={rideDetails.latitude}
              onChange={handleChange}
              placeholder="Enter latitude"
              required
            />
          </Form.Group>

          <Form.Group controlId="formRideLongitude" className="mb-3">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="text"
              name="longitude"
              value={rideDetails.longitude}
              onChange={handleChange}
              placeholder="Enter longitude"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button className="bg-primary w-50" type="submit">
              Update Ride
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default EditRide;
