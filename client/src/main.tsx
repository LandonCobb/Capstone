import React from "react";
import ReactDOM from "react-dom/client";
import { Switch, Route } from "wouter";
import { AppStore } from "@/context/app.context";
import { withDocTitle } from "@/components/hoc/useDocTitle.hoc";
import { withProtection } from "@/components/hoc/withProtection.hoc";
import * as Util from "@/util";
import { ToastContainer } from "react-toastify";
import "@/styles/index.scss";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppStore>
      <Switch>
        {Util.pages.map((page, i) => (
          <Route
            key={i}
            path={page.path}
            component={withDocTitle(
              page.title,
              page.requiresAuth
                ? withProtection(page.component)
                : page.component
            )}
          />
        ))}
      </Switch>
    </AppStore>
    <ToastContainer theme="dark" />
  </React.StrictMode>
);
