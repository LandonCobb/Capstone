import * as React from "react";
import AppContext from "@/context/app.context";
import { Redirect } from "wouter";
import Loading from "../Loading";

/**
 * Enforces authentication for a component
 * @param Component
 */
export const withProtection =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P): React.ReactNode => {
    const { isAuthenticated, user, loading } = React.useContext(AppContext)!;
    if (loading) return <Loading />;
    if (!isAuthenticated || !user) return <Redirect to="/" />;
    return <Component {...props} />;
  };
