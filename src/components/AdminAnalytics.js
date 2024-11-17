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
  useEffect(() => {
    loadRides();
    loadPackages();
  }, []);

  const start = new Date(2020, 0, 1); // January 1, 2020
  const end = new Date(); // Current date

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
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp =
      Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) +
      startTimestamp;
    return new Date(randomTimestamp);
  }

  const packageMonthlyData = aggregateData(packages, "Package");
  const rideMonthlyData = aggregateData(rides, "Ride");
  const combinedMonthlyData = [...packageMonthlyData, ...rideMonthlyData];
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
      <h4 className="mb-4 primary-color">Admin Analytics</h4>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <h5 id="packages-analytics" className="secondary-color">
                Packages Analytics
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={packages}
                  role="img"
                  aria-labelledby="packages-analytics"
                  title="Line chart showing the creation dates of packages over time"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    label={{ value: "Package Name", position: "insideBottom" }}
                  />
                  <YAxis
                    label={{
                      value: "Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="createdAt"
                    stroke="#5d5aa8"
                    name="Created At"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <h5 id="rides-analytics" className="secondary-color">
                Rides Analytics
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={rides}
                  role="img"
                  aria-labelledby="rides-analytics"
                  title="Bar chart showing the creation dates of rides over time"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    label={{ value: "Ride Name", position: "insideBottom" }}
                  />
                  <YAxis
                    label={{
                      value: "Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="createdAt" fill="#3b6d52" name="Created At" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <h5 id="monthly-data" className="secondary-color">
                Monthly Rides and Packages
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={finalDataArray}
                  role="img"
                  aria-labelledby="monthly-data"
                  title="Bar chart showing the monthly counts of rides and packages"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{ value: "Month", position: "insideBottom" }}
                  />
                  <YAxis
                    label={{
                      value: "Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rideCount" fill="#5d5aa8" name="Rides Count" />
                  <Bar
                    dataKey="packageCount"
                    fill="#3b6d52"
                    name="Packages Count"
                  />
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
