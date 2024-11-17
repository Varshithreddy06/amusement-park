import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import Select from "react-select"; // Import react-select
import { db } from "../firebase/config";
import { ref, push, get } from "firebase/database";

const AddPackage = ({ setPackages, addNotification }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [rides, setRides] = useState([]); // Store available rides
  const [selectedRides, setSelectedRides] = useState([]); // Store selected ride IDs
  const navigate = useNavigate();
  const [error, setError] = useState(""); // State to manage error messages

  // Fetch available rides from Firebase
  useEffect(() => {
    const fetchRides = async () => {
      const ridesRef = ref(db, "rides");
      const snapshot = await get(ridesRef);
      const ridesData = snapshot.val();
      if (ridesData) {
        const ridesArray = Object.keys(ridesData).map((key) => ({
          value: key,
          label: ridesData[key].name, // Change to the ride name you want to display
        }));
        setRides(ridesArray);
      }
    };
    fetchRides();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !name ||
      !description ||
      !price ||
      !duration ||
      !image ||
      selectedRides.length === 0
    ) {
      setError(
        "All fields are required, and at least one ride must be selected."
      );
      return;
    }

    const createdAt = new Date().toISOString();
    const newPackage = {
      name,
      description,
      price: parseFloat(price),
      duration,
      image,
      rides: selectedRides.map((ride) => ride.value), // Include selected rides in the package data
      createdAt,
    };

    const packagesRef = ref(db, "packages");
    const newPackageRef = await push(packagesRef, newPackage);

    setPackages((prevPackages) => [
      ...prevPackages,
      { id: newPackageRef.key, ...newPackage },
    ]);

    addNotification(
      `A new package ${name} has been added! Please check it in Rides tab.`
    );

    navigate("/packages");
  };

  return (
    <Container className="p-5 vh-100 add-package">
      <div className="bg-white p-5 rounded shadow">
        <h2 className="mb-4">Add New Package</h2>
        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="packageName">
            <Form.Label>Package Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter package name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-describedby="packageNameHelp"
            />
            <small id="packageNameHelp" className="text-muted">
              Enter the name of the package (e.g., Family Fun Package).
            </small>
          </Form.Group>

          <Form.Group className="mb-3" controlId="packageDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter package description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              aria-describedby="packageDescriptionHelp"
            />
            <small id="packageDescriptionHelp" className="text-muted">
              Describe what the package includes (e.g., Includes 5 rides and
              free snacks).
            </small>
          </Form.Group>

          <Form.Group className="mb-3" controlId="packagePrice">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter package price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              aria-describedby="packagePriceHelp"
            />
            <small id="packagePriceHelp" className="text-muted">
              Specify the cost of the package (e.g., 50 for a day package).
            </small>
          </Form.Group>

          <Form.Group className="mb-3" controlId="packageDuration">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter package duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              aria-describedby="packageDurationHelp"
            />
            <small id="packageDurationHelp" className="text-muted">
              Enter the duration of the package (e.g., 3 days, 1 week).
            </small>
          </Form.Group>

          <Form.Group className="mb-3" controlId="packageImage">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              aria-describedby="packageImageHelp"
            />
            <small id="packageImageHelp" className="text-muted">
              Provide a link to the package banner (e.g.,
              https://example.com/image.jpg).
            </small>
          </Form.Group>

          <Form.Group className="mb-3" controlId="packageRides">
            <Form.Label>Select Rides</Form.Label>
            <Select
              isMulti
              options={rides}
              value={selectedRides}
              onChange={setSelectedRides}
              placeholder="Select rides..."
              aria-label="Select rides"
              aria-describedby="packageRidesHelp"
            />
            <small id="packageRidesHelp" className="text-muted">
              Choose rides included in the package.
            </small>
          </Form.Group>

          <div className="d-flex justify-content-center mt-3">
            <Button className="bg-primary w-50" type="submit">
              Add Package
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default AddPackage;
