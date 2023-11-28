import * as React from "react";
import AppContext from "@/context/app.context";
import Template from "@/components/template";

const Home: React.FC = () => {
  const appContext = React.useContext(AppContext)!;
  return (
    <Template>
      <h1 style={{ textAlign: 'center' }}>Home</h1>
      <div style={{ margin: 10 }}>
        <pre>{JSON.stringify(appContext, null, 2)}</pre>
      </div>
    </Template>
  );
};

export default Home;
