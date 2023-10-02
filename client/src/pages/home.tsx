import * as React from "react";
import AppContext from "@/context/app.context";
import Template from "@/components/template";
import Poopfield from "@/components/poopfield";

const Home: React.FC = () => {
  const appContext = React.useContext(AppContext)!;
  const [count, setCount] = React.useState(0);

  return (
    <Template>
      <div style={{ margin: 10 }}>
        <h1>Hello World</h1>
        <p>{count}</p>
        <button onClick={() => setCount(count + 1)}>Increase count</button>
        <pre>{JSON.stringify(appContext, null, 2)}</pre>
        <Poopfield/>
      </div>
    </Template>
  );
};

export default Home;
