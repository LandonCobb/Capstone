import * as React from "react";
import { useParams } from "react-router-dom";
import AuthTemplate from "@/components/template.authed";

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>(); // Fetch orderId from URL parameters

  return (
    <AuthTemplate>
      <h1 style={{ textAlign: 'center' }}>Order Successful</h1>
      <h3 style={{ textAlign: 'center' }}>Thank you for registering</h3>
      {/* <p style={{ textAlign: 'center' }}>Order ID: {orderId}</p> */}
    </AuthTemplate>
  );
};

export default OrderSuccess;