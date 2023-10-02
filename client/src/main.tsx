import React from "react";
import ReactDOM from "react-dom/client";
import { Switch, Route } from "wouter";
import { AppStore } from "@/context/app.context";
import Home from "@/pages/home";
import "@/styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppStore>
      <Switch>
        <Route path="" component={Home} />
        {/* <Route path="/about" component={About}/> */}
        {/* <Route component={}/> */}
      </Switch>
    </AppStore>
  </React.StrictMode>
);
