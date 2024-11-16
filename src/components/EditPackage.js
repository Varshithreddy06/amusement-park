import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select"; // Import react-select
import { db } from "../firebase/config";
import { ref, set, get } from "firebase/database";

const EditPackage = ({ user, packages, setPackages, addNotification }) => {
  const [packageDetails, setPackageDetails] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    rides: [],
  });
  const [availableRides, setAvailableRides] = useState([]); // Store available rides
  const [selectedRides, setSelectedRides] = useState([]); // Store selected ride IDs
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  // Check user role
  if (user.role !== "admin") {
    navigate("/");
  }

  // Fetch package details
  useEffect(() => {
    const packageData = packages.find((pkg) => pkg.id === id);
    if (packageData) {
      setPackageDetails(packageData);
      setSelectedRides(
        packageData.rides.map((ride) => ({ value: ride, label: ride }))
      );
    }
  }, [id, packages]);

  // Fetch available rides
  useEffect(() => {
    const fetchRides = async () => {
      const ridesRef = ref(db, "rides");
      const snapshot = await get(ridesRef);
      const ridesData = snapshot.val();
      if (ridesData) {
        const ridesArray = Object.keys(ridesData).map((key) => ({
          value: key,
          label: ridesData[key].name,
        }));
        setAvailableRides(ridesArray);
      }
    };
    fetchRides();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageDetails({ ...packageDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !packageDetails.name ||
      !packageDetails.description ||
      !packageDetails.price ||
      !packageDetails.duration ||
      !packageDetails.image ||
      selectedRides.length === 0
    ) {
      setError(
        "All fields are required, and at least one ride must be selected."
      );
      return;
    }

    const updatedPackage = {
      ...packageDetails,
      price: parseFloat(packageDetails.price),
      rides: selectedRides.map((ride) => ride.value), // Update selected rides
    };

    const packageRef = ref(db, "packages/" + id);
    await set(packageRef, updatedPackage);

    setPackages((prevPackages) =>
      prevPackages.map((pkg) => (pkg.id === id ? updatedPackage : pkg))
    );

    addNotification(
      `Package: ${packageDetails.name} has been update! Please find the new details in Rides tab.`
    );

    setError("");
    navigate("/packages");
  };

  return (
    <Container className="p-5 vh-100 add-package">
      <div className="bg-white p-5 rounded shadow">
        <h2 className="mb-4">Edit Package</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="packageName">
            <Form.Label>Package Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={packageDetails.name}
              onChange={handleChange}
              placeholder="Enter package name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="packageDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={packageDetails.description}
              onChange={handleChange}
              placeholder="Enter package description"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="packagePrice">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={packageDetails.price}
              onChange={handleChange}
              placeholder="Enter package price"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="packageDuration">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              name="duration"
              value={packageDetails.duration}
              onChange={handleChange}
              placeholder="Enter package duration (e.g., 3 days)"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="packageImage">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={packageDetails.image}
              onChange={handleChange}
              placeholder="Enter image URL"
              aria-label="Image URL"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="packageRides">
            <Form.Label>Select Rides</Form.Label>
            <Select
              isMulti
              options={availableRides}
              value={selectedRides}
              onChange={setSelectedRides}
              placeholder="Select rides..."
            />
          </Form.Group>

          <div className="d-flex justify-content-center mt-3">
            <Button className="bg-primary w-50" type="submit">
              Update Package
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default EditPackage;
