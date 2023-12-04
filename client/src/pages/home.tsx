import * as React from "react";
import Template from "@/components/template";
import { getAllRallies } from "@/services";
import { Card } from "antd";
import * as T from "@/types";

const Home: React.FC = () => {
  const [featuredRallies, setFeaturedRallies] = React.useState<T.Rally[]>([]);

  React.useEffect(() => {
    const fetchRallies = async () => {
      try {
        const allRallies = await getAllRallies();
        if (allRallies && allRallies.length > 0) {
          // Sort rallies by registration counts
          const sortedRallies = [...allRallies].sort(
            (a, b) => b.registrations - a.registrations
          );
          // Get top 3 rallies
          const top3Rallies = sortedRallies.slice(0, 3);
          setFeaturedRallies(top3Rallies);
        }
      } catch (error) {
        console.error("Error fetching rallies:", error);
      }
    };

    fetchRallies();
  }, []);

  return (
    <Template>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Featured Rallies</h2>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div
            style={{
              display: "inline-flex",
              justifyContent: "center",
              border: "7px solid red",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {/* Display cards for top 3 rallies */}
              {featuredRallies.map((rally, index) => (
                <Card key={index} style={{ width: 300, margin: 16 }}>
                  <h3>{rally.name}</h3>
                  <p>Allowed Vehicle Type: {rally.vehicleType}</p>
                  <p>Starting point: {rally.startPoint}</p>
                  <p>Ending point: {rally.endPoint}</p>
                  <p>Registrations: {rally.registrations}</p>
                  {/* Add other rally details to display in the card */}
                </Card>
              ))}
            </div>
          </div>
          <h2 style={{ textAlign: "center" }}>About Rally</h2>
          <p style={{ textAlign: "center" }}>Rally is a management system for motorsport enthusiasts. We provide an easy to use application to manage your motorsport rallies.</p>
          <p style={{ textAlign: "center" }}>Rally is also a social space; allowing connections between all kinds of motorsport enjoyers.</p>
        </div>
      </div>
    </Template>
  );
};

export default Home;
