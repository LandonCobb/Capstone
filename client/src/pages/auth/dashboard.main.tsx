import * as React from "react";
import AppContext from "@/context/app.context";
import AuthTemplate from "@/components/template.authed";

const Dashboard: React.FC = () => {
  const context = React.useContext(AppContext)!;

  return (
    <AuthTemplate>
      <pre>{JSON.stringify(context, null, 2)}</pre>
    </AuthTemplate>
  );
};

export default Dashboard;
