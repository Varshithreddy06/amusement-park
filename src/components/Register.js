import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import { db } from "../firebase/config";
import { push, ref, set } from "firebase/database";

const Register = ({ user, setUser }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  if (user?.email) {
    return <Navigate to="/" />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const newDocRef = push(ref(db, "users"));
      await set(newDocRef, {
        name: form.name,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        password: form.password,
        role: form.role,
      });

      setUser({
        name: form.name,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        role: form.role,
      });

      setRedirect(true);
    } catch (error) {
      setError("Registration failed: " + error.message);
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="d-flex justify-content-around align-items-center vw-100 vh-100 register pt-5">
        <div></div>
        <Card className="shadow p-3 mb-5 bg-body rounded d-flex justify-content-center align-items-center register-card">
          <Card.Title className="primary-color mb-5">REGISTER</Card.Title>

          {error && <div className="text-danger">{error}</div>}

          <Form.Group className="my-2 w-75" controlId="username">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              className="border-0 border-bottom border-2 border-black rounded-0 p-0"
              value={form.name}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              className="border-0 border-bottom border-2 border-black rounded-0 p-0"
              value={form.email}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="dateofbirth">
            <Form.Label>Date Of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              className="border-0 border-bottom border-2 border-black rounded-0 p-0"
              value={form.dateOfBirth}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              className="border-0 border-bottom border-2 border-black rounded-0 p-0"
              value={form.password}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="my-2 w-75" controlId="confirmpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              className="border-0 border-bottom border-2 border-black rounded-0 p-0"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />
          </Form.Group>

          <br />

          <Button
            variant="primary"
            className="bg-primary border-0 w-50 mb-3"
            type="submit"
          >
            Register
          </Button>

          <Card.Link href="/login" className="primary-color">
            Coming back? Login here
          </Card.Link>
        </Card>
      </div>
    </Form>
  );
};

export default Register;
