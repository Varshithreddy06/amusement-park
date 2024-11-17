import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import ViewAllRides from "./components/ViewAllRides";
import ViewAllPackages from "./components/ViewAllPackages"; // Import ViewAllPackages
import AddRide from "./components/AddRide";
import EditRide from "./components/EditRide";
import AddPackage from "./components/AddPackage"; // Import AddPackage
import EditPackage from "./components/EditPackage";
import FAQ from "./components/FAQ";
import AdminAnalytics from "./components/AdminAnalytics";
import Messages from "./components/Messages";
import Bookings from "./components/Bookings";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get, onValue, push, set } from "firebase/database";

function App() {
  const [user, setUser] = useState({
    id: "-O9GDCSnwvMW2upIU17l",
    name: "Varshit",
    email: "varshit@gmail.com",
    dateOfBirth: "2001-01-01",
    role: "admin",
  });
  const [rides, setRides] = useState([]);
  const [packages, setPackages] = useState([]);

  const [faqs, setFaqs] = useState([
    // Sample FAQs
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
      const ridesData = snapshot.val();
      const tempRides = Object.keys(ridesData).map((id) => ({
        ...ridesData[id],
        id,
      }));
      setRides(tempRides);
    } else {
      setRides([]);
    }
  };

  const loadPackages = async () => {
    const dbRef = ref(db, "packages");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const packagesData = snapshot.val();
      const tempPackages = Object.keys(packagesData).map((id) => ({
        ...packagesData[id],
        id,
      }));
      setPackages(tempPackages);
    } else {
      setPackages([]);
    }
  };

  const loadFAQ = async () => {
    const dbRef = ref(db, "faq");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const faqData = snapshot.val();
      const tempFAQ = Object.keys(faqData).map((id) => ({
        ...faqData[id],
        id,
      }));
      setFaqs(tempFAQ);
    } else {
      setFaqs([]);
    }
  };

  const addNotification = async (message) => {
    const dbRef = ref(db, "users");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const users = snapshot.val();

      for (const userid in users) {
        const notificationsRef = push(ref(db, "notifications"));
        await set(notificationsRef, {
          message: message,
          userid: userid,
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }
  };

  useEffect(() => {
    const ridesRef = ref(db, "rides");
    onValue(ridesRef, (snapshot) => {
      const data = snapshot.val();
      const ridesArray = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      setRides(ridesArray);
    });
  }, []);

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
                packages={packages}
                loadPackages={loadPackages}
                addNotification={addNotification}
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
          path="/faq"
          element={
            <ProtectedRoute user={user}>
              <FAQ
                user={user}
                faqs={faqs}
                setFaqs={setFaqs}
                loadFAQ={loadFAQ}
                addNotification={addNotification}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-all-rides"
          element={
            <ProtectedRoute user={user}>
              <ViewAllRides
                user={user}
                rides={rides}
                setRides={setRides}
                loadRides={loadRides}
                addNotification={addNotification}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-ride"
          element={
            <ProtectedRoute user={user}>
              <AddRide
                user={user}
                setRides={setRides}
                loadRides={loadRides}
                addNotification={addNotification}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-ride/:id"
          element={
            <ProtectedRoute user={user}>
              <EditRide
                user={user}
                rides={rides}
                setRides={setRides}
                addNotification={addNotification}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/packages" // New route for ViewAllPackages
          element={
            <ProtectedRoute user={user}>
              <ViewAllPackages
                user={user}
                packages={packages}
                setPackages={setPackages}
                rides={rides}
                loadPackages={loadPackages}
                loadRides={loadRides}
                addNotification={addNotification}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-package"
          element={
            <ProtectedRoute user={user}>
              <AddPackage
                setPackages={setPackages}
                addNotification={addNotification}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-package/:id"
          element={
            <ProtectedRoute user={user}>
              <EditPackage
                user={user}
                packages={packages}
                setPackages={setPackages}
                loadPackages={loadPackages}
                rides={rides}
                loadRides={loadRides}
                addNotification={addNotification}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <AdminAnalytics
              rides={rides}
              packages={packages}
              loadRides={loadRides}
              loadPackages={loadPackages}
            />
          }
        />

        <Route path="/bookings" element={<Bookings user={user} />} />

        <Route path="/messages" element={<Messages user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
