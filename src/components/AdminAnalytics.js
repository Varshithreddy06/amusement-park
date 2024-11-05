import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const AdminAnalytics = ({ rides, packages, loadRides, loadPackages }) => {
  // Fetching data from Firebase
  useEffect(() => {
    loadRides();
    loadPackages();
  }, []);

  const start = new Date(2020, 0, 1); // January 1, 2020
  const end = new Date(); // Current date

  // Preparing data for charts
  const packageData = packages.map((pkg) => ({
    name: pkg.name, // Assuming each package has a name
    createdAt: pkg?.createdAt
      ? new Date(pkg.createdAt).toLocaleString()
      : getRandomDate(start, end).toLocaleString(), // Format as needed
  }));

  const rideData = rides.map((ride) => ({
    name: ride.name, // Assuming each ride has a name
    createdAt: ride?.createdAt
      ? new Date(ride.createdAt).toLocaleString()
      : getRandomDate(start, end).toLocaleString(), // Format as needed
  }));

  // Aggregate rides and packages by month
  const aggregateData = (data, type) => {
    const aggregated = data.reduce((acc, item) => {
      const date = item?.createdAt
        ? new Date(item.createdAt)
        : getRandomDate(start, end);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(aggregated).map(([month, count]) => ({
      month,
      count,
      type,
    }));
  };

  function getRandomDate(startDate, endDate) {
    const startTimestamp = startDate.getTime(); // Get timestamp of the start date
    const endTimestamp = endDate.getTime(); // Get timestamp of the end date

    // Generate a random timestamp between start and end timestamps
    const randomTimestamp =
      Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) +
      startTimestamp;

    // Return a Date object from the random timestamp
    return new Date(randomTimestamp);
  }

  const packageMonthlyData = aggregateData(packages, "Package");
  const rideMonthlyData = aggregateData(rides, "Ride");

  const combinedMonthlyData = [...packageMonthlyData, ...rideMonthlyData];

  // Grouping by month for combined data
  const finalMonthlyData = combinedMonthlyData.reduce((acc, item) => {
    const { month, count, type } = item;
    if (!acc[month]) {
      acc[month] = { month, rideCount: 0, packageCount: 0 };
    }
    if (type === "Ride") {
      acc[month].rideCount += count;
    } else {
      acc[month].packageCount += count;
    }
    return acc;
  }, {});

  const finalDataArray = Object.values(finalMonthlyData);

  return (
    <Container className="p-5 admin-analytics">
      <h2 className="mb-4 primary-color">Admin Analytics</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <h5 className="secondary-color">Packages Analytics</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={packageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="createdAt" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <h5 className="secondary-color">Rides Analytics</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rideData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="createdAt" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <h5 className="secondary-color">Monthly Rides and Packages</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={finalDataArray}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rideCount" fill="#8884d8" name="Rides" />
                  <Bar dataKey="packageCount" fill="#82ca9d" name="Packages" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAnalytics;
