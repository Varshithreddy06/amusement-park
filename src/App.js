import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import ViewAllRides from "./components/ViewAllRides";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get } from "firebase/database";

function App() {
  const [user, setUser] = useState({});

  const [rides, setRides] = useState([]);

  const [faqs, setFaqs] = useState([
    {
      question: "What are the park opening hours?",
      answer: "The park is open from 9 AM to 9 PM daily.",
    },
    {
      question: "Are there age restrictions for rides?",
      answer:
        "Yes, age restrictions vary by ride. Please check the ride details.",
    },
    {
      question: "Can I bring food and drinks into the park?",
      answer: "No, outside food and drinks are not allowed in the park.",
    },
    {
      question: "Is there a lost and found service?",
      answer: "Yes, please visit Guest Services for lost items.",
    },
    {
      question: "What should I do in case of an emergency?",
      answer:
        "Please contact a park staff member or use emergency phones located throughout the park.",
    },
  ]);

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

  const loadFAQ = async () => {
    const dbRef = ref(db, "faq");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const faq = snapshot.val();

      const tempFAQ = Object.keys(faq).map((id) => {
        return {
          ...faq[id],
          id,
        };
      });

      setFaqs(tempFAQ);
    } else {
      setFaqs([]);
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
      </Routes>
    </Router>
  );
}

export default App;
