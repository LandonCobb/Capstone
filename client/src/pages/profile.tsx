import React, { useContext, useState, useEffect } from "react";
import AuthTemplate from "@/components/template.authed";
import AppContext from "@/context/app.context";
import { Button, Modal, Form, Input, Card } from "antd";
import { getRallyById } from "../services/rally";
import { createVehicle, getVehicleById } from "../services/vehicle";
import * as T from "@/types";

const Profile: React.FC = () => {
  const appContext = useContext(AppContext); // Assuming user information is available in AppContext
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rallies, setRallies] = useState<T.Rally[]>([]);
  const [vehicles, setVehicles] = useState<T.Vehicle[]>([]);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchVehicles = async () => {
    try {
      if (appContext?.user?.vehicleIds) {
        const vehicleDetails = await Promise.all(
          appContext.user.vehicleIds.map((vehicleId) => getVehicleById(vehicleId))
        );
        const validVehicles = vehicleDetails.filter((vehicle) => vehicle !== null) as T.Vehicle[];
        setVehicles(validVehicles);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };


  const handleAddVehicle = async () => {
    try {
      const values = await form.validateFields(); // Validate and get form values
      await createVehicle(values);
      console.log('Vehicle created successfully!');
      setIsModalVisible(false);
      fetchVehicles(); // Fetch and update the list of vehicles
    } catch (error) {
      console.error('Error creating vehicle:', error);
    }
  };

  useEffect(() => {
    // Fetch rallies on mount or whenever rallyIds change
    if (appContext?.user?.rallyIds) {
      Promise.all(appContext.user.rallyIds.map((rallyId) => getRallyById(rallyId)))
        .then((rallyDetails: (T.Rally | null)[]) => {
          const validRallies = rallyDetails.filter((rally) => rally !== null) as T.Rally[];
          setRallies(validRallies);
        })
        .catch((error) => {
          console.error('Error fetching rallies:', error);
        });
    }

    // Fetch vehicles on mount or whenever vehicleIds change
    fetchVehicles();
  }, [appContext?.user?.rallyIds, appContext?.user?.vehicleIds]);

  return (
    <AuthTemplate>
      <div>
        {/* Info Section */}
        <section style={{ textAlign: "center" }}>
          <h2>Info</h2>
          <p>User Email: {appContext?.user?.email}</p>
        </section>

        {/* Owned Rallies Section */}
        <section style={{ textAlign: "center" }}>
          <h2>Owned Rallies</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {rallies.length > 0 ? (
              rallies.map((rally, index) => (
                <Card key={index} style={{ width: 300, margin: 16 }}>
                  <h3>{rally.name}</h3>
                  <p>Allowed Vehicle Type: {rally.vehicleType}</p>
                  <p>Starting point: {rally.startPoint}</p>
                  <p>Ending point: {rally.endPoint}</p>
                  <p>Registration Fee: ${rally.regFee}</p>
                </Card>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>No rallies found.</p>
            )}
          </div>
        </section>

        {/* Your Vehicles Section */}
        <section style={{ textAlign: "center" }}>
          <h2>Your Vehicles</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => (
                <Card key={index} style={{ width: 300, margin: 16 }}>
                  <h3>{vehicle.model}</h3>
                  <p>Make: {vehicle.make}</p>
                  <p>Year: {vehicle.year}</p>
                </Card>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>No rallies found.</p>
            )}
          </div>
          <Button onClick={showModal}>Add Vehicle</Button>
          <Modal
      title="Add Vehicle"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="add"
          type="primary"
          onClick={handleAddVehicle} // Call handleAddVehicle directly
        >
          Add
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Make" name="make" rules={[{ required: true, message: 'Please enter the make!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Model" name="model" rules={[{ required: true, message: 'Please enter the model!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Year" name="year" rules={[{ required: true, message: 'Please enter the year!' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
        </section>
      </div>
    </AuthTemplate>
  );
};

export default Profile;
