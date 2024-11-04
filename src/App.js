import React, { useState } from "react";
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
import FAQ from "./components/FAQ";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get } from "firebase/database";

function App() {
  const [user, setUser] = useState({
    name: "Admin",
    email: "admin@gmail.com",
    dateOfBirth: "2001-01-01",
    role: "admin",
  });
  const [rides, setRides] = useState([]);
  const [packages, setPackages] = useState([
    {
      id: "pkg1",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvkIZfPE9cozNfq8gj_H_ocRN9rbXR1AwfkA&s",
      name: "Family Fun Package",
      description:
        "A package perfect for families with access to kid-friendly rides, food coupons, and family shows.",
      price: "150",
      ridesIncluded: ["Roller Coaster", "Ferris Wheel", "Kids Play Zone"],
      duration: "1 Day",
    },
    {
      id: "pkg2",
      name: "Thrill Seeker Package",
      description:
        "For the adventurous! Includes unlimited access to thrill rides and a meal pass.",
      price: "100",
      ridesIncluded: ["Extreme Coaster", "Drop Tower", "Bumper Cars"],
      duration: "1 Day",
    },
    {
      id: "pkg3",
      name: "Weekend Getaway",
      description:
        "Enjoy a full weekend at the park with access to all rides, shows, and food discounts.",
      price: "250",
      ridesIncluded: ["All Rides Access"],
      duration: "2 Days",
    },
    {
      id: "pkg4",
      name: "VIP Experience",
      description:
        "Get a VIP tour with front-of-line access, gourmet meals, and exclusive access to special events.",
      price: "500",
      ridesIncluded: ["All Rides Access", "VIP Lounge Access"],
      duration: "1 Day",
    },
    {
      id: "pkg5",
      name: "Couples Special",
      description:
        "Ideal for couples, includes romantic rides, dinner reservations, and a private photo session.",
      price: "200",
      ridesIncluded: ["Romantic Ferris Wheel", "Couples Boat Ride"],
      duration: "1 Day",
    },
  ]);

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
          path="/faq"
          element={
            <ProtectedRoute user={user}>
              <FAQ
                user={user}
                faqs={faqs}
                setFaqs={setFaqs}
                loadFAQ={loadFAQ}
              />
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

        <Route
          path="/packages" // New route for ViewAllPackages
          element={
            <ProtectedRoute user={user}>
              <ViewAllPackages
                user={user}
                packages={packages}
                setPackages={setPackages}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
