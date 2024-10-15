import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import ViewAllRides from "./components/ViewAllRides";
import AddRide from "./components/AddRide";
import EditRide from "./components/EditRide";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get } from "firebase/database";

function App() {
  const [user, setUser] = useState({});

  const [rides, setRides] = useState([]);

  const loadRides = async () => {
    const dbRef = ref(db, "rides");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const rides = snapshot.val();

      const tempRides = Object.keys(rides).map((id) => {
        return {
          ...rides[id],
          id,
        };
      });

      setRides(tempRides);
    } else {
      setRides([]);
    }
  };

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
              <Dashboard
                user={user}
                rides={rides}
                setRides={setRides}
                loadRides={loadRides}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute user={user}>
              <Logout setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-all-rides"
          element={
            <ProtectedRoute user={user}>
              <ViewAllRides user={user} rides={rides} setRides={setRides} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-ride"
          element={
            <ProtectedRoute user={user}>
              <AddRide user={user} setRides={setRides} loadRides={loadRides} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-ride/:id"
          element={
            <ProtectedRoute user={user}>
              <EditRide user={user} rides={rides} setRides={setRides} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
