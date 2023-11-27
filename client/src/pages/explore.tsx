import React, { useState, useEffect } from "react";
import Template from "@/components/template";
import { getAllRallies } from "../services/rally";
import { Card, Input, Button } from "antd";
import * as T from "@/types";

const Explore: React.FC = () => {
  const [rallies, setRallies] = useState<T.Rally[]>([]);
  const [filteredRallies, setFilteredRallies] = useState<T.Rally[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const fetchRallies = async () => {
      try {
        const res = await getAllRallies();
        if (res != null) {
          setRallies(res); // Set rallies in state
        } else {
          setRallies([]); // Set empty array if no rallies found
        }
      } catch (error) {
        console.error("Error fetching rallies:", error);
        setRallies([]); // Set empty array if error occurs
      }
    };

    fetchRallies();
  }, []);

  const handleSearch = () => {
    const filtered = rallies.filter(
      (rally) =>
        rally.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        rally.vehicleType.toLowerCase().includes(searchValue.toLowerCase())
      // Add more conditions for searching other properties as needed
    );
    setFilteredRallies(filtered);
  };


  return (
    <Template>
      <h1 style={{ textAlign: 'center' }}>Explore Rallies!</h1>
      <div style={{ textAlign: "center" }}>
        <Input
          placeholder="Search Rallies"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          style={{ width: 300, marginBottom: 16 }}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredRallies.length > 0 ? (
          filteredRallies.map((rally, index) => (
            <Card key={index} style={{ width: 300, margin: 16 }}>
              {/* Customize the card content based on your data */}
              <h3>{rally.name}</h3>
              <p>{rally.vehicleType}</p>
              <p>Starting point: {rally.startPoint}</p>
              <p>Ending point: {rally.endPoint}</p>
              <p>Registration Fee: ${rally.regFee}</p>
            </Card>
          ))
        ) : (
          <p>No rallies found.</p>
        )}
      </div>
    </Template>
  );
};

export default Explore;