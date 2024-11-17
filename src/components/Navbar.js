import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import Notifications from "./Notifications";
import { useLocation, Link } from "react-router-dom";

const NavBar = ({ user }) => {
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const toggleNotifications = () => {
    setNotificationsVisible((prev) => !prev);
  };

  // Function to handle navigation link clicks
  const handleNavLinkClick = () => {
    // Close notifications dropdown when a nav link is clicked
    setNotificationsVisible(false);
  };

  return (
    <Navbar expand="lg" className="position-absolute vw-100 bg-white">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="w-50">
          <img src="Logo.png" alt="Logo" style={{ width: "120px" }} />
        </Navbar.Brand>

        {location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <Nav className="me-2 my-2 my-lg-0" navbarScroll>
              <Nav.Link
                as={Link}
                to="/view-all-rides"
                className="d-flex justify-content-center align-items-center primary-color"
                onClick={handleNavLinkClick} // Close notifications on click
                aria-label="View all rides"
                aria-current={
                  location.pathname === "/view-all-rides" ? "page" : undefined
                }
              >
                {location.pathname === "/view-all-rides" ? (
                  <span className="text-decoration-underline">Rides</span>
                ) : (
                  <span className="text-decoration-none">Rides</span>
                )}
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/packages"
                className="d-flex justify-content-center align-items-center primary-color"
                onClick={handleNavLinkClick} // Close notifications on click
                aria-label="View packages"
                aria-current={
                  location.pathname === "/packages" ? "page" : undefined
                }
              >
                {location.pathname === "/packages" ? (
                  <span className="text-decoration-underline">Packages</span>
                ) : (
                  <span className="text-decoration-none">Packages</span>
                )}
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/faq"
                className="d-flex justify-content-center align-items-center primary-color"
                onClick={handleNavLinkClick} // Close notifications on click
                aria-label="FAQ"
                aria-current={location.pathname === "/faq" ? "page" : undefined}
              >
                {location.pathname === "/faq" ? (
                  <span className="text-decoration-underline">FAQ</span>
                ) : (
                  <span className="text-decoration-none">FAQ</span>
                )}
              </Nav.Link>

              {user.role === "admin" && (
                <Nav.Link
                  as={Link}
                  to="/analytics"
                  className="d-flex justify-content-center align-items-center primary-color"
                  onClick={handleNavLinkClick} // Close notifications on click
                  aria-label="Analytics"
                  aria-current={
                    location.pathname === "/analytics" ? "page" : undefined
                  }
                >
                  {location.pathname === "/analytics" ? (
                    <span className="text-decoration-underline">Analytics</span>
                  ) : (
                    <span className="text-decoration-none">Analytics</span>
                  )}
                </Nav.Link>
              )}

              <Nav.Link
                as={Link}
                to="/messages"
                className="d-flex justify-content-center align-items-center primary-color"
                onClick={handleNavLinkClick} // Close notifications on click
                aria-label="Messages"
                aria-current={
                  location.pathname === "/messages" ? "page" : undefined
                }
              >
                {location.pathname === "/messages" ? (
                  <span className="text-decoration-underline">Messages</span>
                ) : (
                  <span className="text-decoration-none">Messages</span>
                )}
              </Nav.Link>

              {user.role === "user" && (
                <Nav.Link
                  as={Link}
                  to="/bookings"
                  className="d-flex justify-content-center align-items-center primary-color"
                  onClick={handleNavLinkClick} // Close notifications on click
                  aria-label="Bookings"
                  aria-current={
                    location.pathname === "/bookings" ? "page" : undefined
                  }
                >
                  {location.pathname === "/bookings" ? (
                    <span className="text-decoration-underline">Bookings</span>
                  ) : (
                    <span className="text-decoration-none">Bookings</span>
                  )}
                </Nav.Link>
              )}

              <Nav.Link className="primary-color" onClick={toggleNotifications}>
                <span className="d-none">Notifications</span>
                <em
                  className="fa-solid fa-bell"
                  aria-label="Notifications"
                ></em>
              </Nav.Link>

              {notificationsVisible && (
                <div
                  className="position-absolute bg-light"
                  style={{
                    top: "70px",
                    right: "350px",
                    zIndex: 1000,
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "200px",
                  }}
                >
                  <Notifications userId={user.id} />
                </div>
              )}

              <div className="position-relative">
                <Nav.Link
                  as={Link}
                  to="/logout"
                  style={{ color: "#000" }}
                  onClick={handleNavLinkClick}
                  aria-label="Logout"
                >
                  Logout
                  <em className="fa-solid fa-arrow-right-from-bracket ms-2"></em>
                </Nav.Link>
              </div>
            </Nav>
          )}

        {location.pathname === "/login" && (
          <Nav className="me-2 my-2 my-lg-0" navbarScroll>
            <Nav.Link
              as={Link}
              to="/register"
              className="primary-color"
              onClick={handleNavLinkClick}
              aria-label="Register"
            >
              Register <em className="fa-solid fa-right-to-bracket"></em>
            </Nav.Link>
          </Nav>
        )}

        {location.pathname === "/register" && (
          <Nav className="me-2 my-2 my-lg-0" navbarScroll>
            <Nav.Link
              as={Link}
              to="/login"
              className="primary-color"
              onClick={handleNavLinkClick}
              aria-label="Login"
            >
              Login <em className="fa-solid fa-right-to-bracket"></em>
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
