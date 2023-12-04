import React, { useState, useEffect, useContext } from "react";
import Template from "@/components/template";
import { getAllRallies, createCheckout, getVehicleById } from "@/services";
import { Card, Input, Button, Modal, Select } from "antd";
import AppContext from "@/context/app.context";
import * as T from "@/types";

const Explore: React.FC = () => {
  const appContext = useContext(AppContext);
  const [rallies, setRallies] = useState<T.Rally[]>([]);
  const [filteredRallies, setFilteredRallies] = useState<T.Rally[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [modalRally, setModalRally] = useState<T.Rally | null>(null); // State to hold the rally for the modal
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<T.Vehicle[]>([]);

  const fetchVehicles = async () => {
    try {
      if (appContext?.user?.vehicleIds) {
        const vehicleDetails = await Promise.all(
          appContext.user.vehicleIds.map((vehicleId) =>
            getVehicleById(vehicleId)
          )
        );
        const validVehicles = vehicleDetails.filter(
          (vehicle) => vehicle !== null
        ) as T.Vehicle[];
        setVehicles(validVehicles);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    const fetchRallies = async () => {
      try {
        const res = await getAllRallies();
        if (res != null) {
          setRallies(res);
          setFilteredRallies(res);
        } else {
          setRallies([]);
          setFilteredRallies([]);
        }
      } catch (error) {
        console.error("Error fetching rallies:", error);
        setRallies([]);
        setFilteredRallies([]);
      }
    };

    fetchRallies();
    fetchVehicles();
  }, []);

  const handleSearch = () => {
    const filtered = rallies.filter(
      (rally) =>
        rally.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        rally.vehicleType.toLowerCase().includes(searchValue.toLowerCase()) ||
        rally.startPoint.toLowerCase().includes(searchValue.toLowerCase()) ||
        rally.endPoint.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredRallies(filtered);
  };

  const handleRegister = (rally: T.Rally) => {
    setModalRally(rally); // Set the rally for the modal
    setModalVisible(true);
  };

  return (
    <Template>
      <h1 style={{ textAlign: "center" }}>Explore Rallies!</h1>
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
              <h3>{rally.name}</h3>
              <p>Allowed Vehicle Type: {rally.vehicleType}</p>
              <p>Starting point: {rally.startPoint}</p>
              <p>Ending point: {rally.endPoint}</p>
              <p>Registration Fee: ${rally.regFee}</p>
              <p>Allotment: {rally.allotment}</p>
              <Button onClick={() => handleRegister(rally)}>
                Register
              </Button>{" "}
              {/* Pass rally to handleRegister */}
              <Modal
                title={`Register for ${modalRally?.name || ""}`}
                visible={modalVisible && modalRally === rally}
                onOk={() => {
                  createCheckout([
                    {
                      price: Math.ceil(parseFloat(rally.regFee) * 100),
                      product_name: `Registration for ${rally.name}`,
                      ralli_id: rally.ralliId,
                    },
                  ]).then((url) => {
                    url && window.open(url);
                  });
                  setModalVisible(false);
                }}
                onCancel={() => setModalVisible(false)}
              >
                {/* Modal content for registration */}
                <Select defaultValue="" style={{ width: "100%" }}>
                  {/* Map vehicles to options in Select */}
                  {vehicles.map((vehicle) => (
                    <Select.Option
                      key={vehicle.vehicleId}
                      value={vehicle.vehicleId}
                    >
                      {vehicle.model}
                    </Select.Option>
                  ))}
                </Select>
              </Modal>
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
