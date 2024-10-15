import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

import ProtectedRoute from "./routing/ProtectedRoute";

function App() {
  const [user, setUser] = useState({});

  const [rides, setRides] = useState([]);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/register"
          element={<Register user={user} setUser={setUser} />}
        />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} rides={rides} setRides={setRides} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
