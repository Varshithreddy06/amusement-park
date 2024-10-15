import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import { db } from "../firebase/config";
import { get, ref } from "firebase/database";

const Login = ({ user, setUser }) => {
  const [form, setForm] = useState({
    email: "admin@gmail.com",
    password: "admin1234",
  });

  const [redirect, setRedirect] = useState(false);

  if (user?.email) {
    return <Navigate to="/" />;
  }

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async () => {
    if (!form.email || !form.password) {
      return;
    }

    const dbRef = ref(db, "users");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const users = Object.values(snapshot.val());

      for (let i = 0; i < users.length; i++) {
        if (
          users[i].email === form.email &&
          users[i].password === form.password
        ) {
          setUser({
            name: users[i].name,
            email: users[i].email,
            dateOfBirth: users[i].dateOfBirth,
            role: users[i].role,
          });

          setRedirect(true);
        }
      }
    }
  };

  if (redirect) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Form>
      <div className="d-flex justify-content-around align-items-center vw-100 vh-100 login">
        <div></div>
        <Card className="shadow p-3 mb-5 bg-body rounded d-flex justify-content-center align-items-center login-card ">
          <Card.Title className="primary-color mb-5">LOGIN</Card.Title>

          <Form.Group
            className="mb-3 w-75"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              className="border-0 border-bottom border-black border-2 rounded-0 p-0"
            />
          </Form.Group>

          <Form.Group
            className="mb-3 w-75"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              className="border-0 border-bottom border-black border-2 rounded-0 p-0"
            />
          </Form.Group>

          <br />

          <Button
            variant="primary"
            className="bg-primary border-0 w-50"
            onClick={onSubmit}
          >
            Submit
          </Button>

          <Card.Link href="/register" className="primary-color my-3">
            Create a New Account here!
          </Card.Link>
        </Card>
      </div>
    </Form>
  );
};

export default Login;
