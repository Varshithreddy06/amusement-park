import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";

const NavBar = ({ user }) => {
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <Navbar expand="lg" className="position-absolute vw-100 bg-white">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="w-50">
          <img src="logo.png" alt="Logo" style={{ width: "120px" }} />
        </Navbar.Brand>

        {location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <Nav className="me-2 my-2 my-lg-0" navbarScroll>
              <Nav.Link
                as={Link}
                to="/view-all-rides"
                className="d-flex justify-content-center align-items-center primary-color"
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
              >
                {location.pathname === "/faq" ? (
                  <span className="text-decoration-underline">FAQ</span>
                ) : (
                  <span className="text-decoration-none">FAQ</span>
                )}
              </Nav.Link>

              <div className="position-relative">
                <Nav.Link className="primary-color" onClick={toggleDropdown}>
                  <i className="fa-solid fa-circle-user"></i>
                </Nav.Link>
                {dropdownVisible && (
                  <div
                    className="position-absolute bg-light"
                    style={{
                      right: 0,
                      zIndex: 1000,
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      width: "200px",
                    }}
                  >
                    <Nav.Link as={Link} to="/profile" style={{ color: "#000" }}>
                      View Profile
                    </Nav.Link>
                    <Nav.Link as={Link} to="/logout" style={{ color: "#000" }}>
                      Logout{" "}
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </Nav.Link>
                  </div>
                )}
              </div>
            </Nav>
          )}

        {location.pathname === "/login" && (
          <Nav className="me-2 my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/register" className="primary-color">
              Register <i className="fa-solid fa-right-to-bracket"></i>
            </Nav.Link>
          </Nav>
        )}

        {location.pathname === "/register" && (
          <Nav className="me-2 my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/login" className="primary-color">
              Login <i className="fa-solid fa-right-to-bracket"></i>
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
